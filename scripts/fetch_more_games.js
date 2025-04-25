const https = require("https");
const path = require("path");
const fs = require("fs"); // 引入 fs 模块用于文件操作
const dotenv = require("dotenv"); // 使用 dotenv 加载 .env.local 文件

// --- 配置 ---
// 加载项目根目录的 .env.local 文件
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// 从环境变量读取配置
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const FUNCTION_NAME = "fetch-game-data"; // 与我们修改的 Function 保持一致

// RAWG API 配置
const RAWG_BASE_URL = "api.rawg.io";
const GAMES_ENDPOINT = "/api/games";
const PAGE_SIZE = 40;
const MAX_PAGES_TO_FETCH = 70; // <--- 恢复为一个更合理的值，例如 10 页
const ORDERING = "-rating"; // 按评分降序获取热门游戏
// const PLATFORMS = "4,1,187,186"; // 可以根据需要取消注释或修改平台过滤

// Supabase Function 调用配置
const FUNCTION_CALL_DELAY_MS = 700; // 保持调用延迟

// 用于记录已成功处理 slug 的文件路径
const PROCESSED_LOG_FILE = path.join(__dirname, "processed_slugs.log");

// --- 辅助函数 ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 读取已处理 slugs 的函数
function loadProcessedSlugs() {
  try {
    if (fs.existsSync(PROCESSED_LOG_FILE)) {
      const data = fs.readFileSync(PROCESSED_LOG_FILE, "utf8");
      return new Set(data.split("\n").filter((slug) => slug.trim() !== ""));
    }
  } catch (err) {
    console.error(
      `Error reading processed slugs log file (${PROCESSED_LOG_FILE}):`,
      err
    );
  }
  return new Set();
}

// 记录一个成功处理的 slug
function logProcessedSlug(slug) {
  try {
    fs.appendFileSync(PROCESSED_LOG_FILE, `${slug}\n`, "utf8");
  } catch (err) {
    console.error(
      `Error writing to processed slugs log file (${PROCESSED_LOG_FILE}):`,
      err
    );
  }
}

// 发起 HTTPS GET 请求的 Promise 封装 (用于 RAWG API)
function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      path: path,
      method: "GET",
      headers: headers,
    };
    // console.log(`[Debug] Sending GET request to: https://${hostname}${path}`); // 可选的更详细调试日志
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        // console.log(`[Debug] Received response for: https://${hostname}${path} - Status: ${res.statusCode}`); // 可选的更详细调试日志
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(
              new Error(
                `Failed to parse JSON response. Status: ${res.statusCode}. Data: ${data}`
              )
            );
          }
        } else {
          reject(
            new Error(
              `Request failed. Status Code: ${res.statusCode}. Response: ${data}`
            )
          );
        }
      });
    });
    req.on("error", (e) => {
      console.error(
        `[Debug] Request error for https://${hostname}${path}: ${e.message}`
      ); // 可选的更详细调试日志
      reject(e);
    });
    req.end();
  });
}

// 调用 Supabase Function 的 Promise 封装 (复用自 populate_db.js 并稍作修改)
function callSupabaseFunction(functionUrl, anonKey, gameIdentifier) {
  const postData = JSON.stringify({ gameIdentifier });
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };
  const url = new URL(functionUrl); // 使用 URL 对象解析 hostname 和 path
  // console.log(`[Debug] Sending POST request to: ${functionUrl} for identifier: ${gameIdentifier}`); // 可选的更详细调试日志

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        // console.log(`[Debug] Received response from Supabase Function for ${gameIdentifier} - Status: ${res.statusCode}`); // 可选的更详细调试日志
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseBody);
        } catch (e) {
          parsedResponse = { responseBody }; // 不是 JSON，保留原始响应
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            statusCode: res.statusCode,
            message: parsedResponse.message || "OK",
            data: parsedResponse,
          });
        } else {
          // 失败时也 resolve，但在结果中标记 error
          resolve({
            success: false,
            statusCode: res.statusCode,
            message:
              parsedResponse.error || parsedResponse.message || responseBody,
            data: parsedResponse,
          });
        }
      });
    });
    req.on("error", (error) => {
      // 请求本身出错时 reject
      console.error(
        `[Debug] Supabase function request error for "${gameIdentifier}":`,
        error.message
      ); // 可选的更详细调试日志
      reject(error);
    });
    req.write(postData);
    req.end();
  });
}

// --- 主逻辑 ---
async function fetchAndPopulate() {
  console.log(
    `--- Starting Game Data Fetch (Fetching ~${
      MAX_PAGES_TO_FETCH * PAGE_SIZE
    } slugs) ---`
  );

  // 检查环境变量
  if (!RAWG_API_KEY || !SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) {
    console.error(
      "Error: Missing required environment variables (RAWG_API_KEY, SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY)."
    );
    console.error(
      "Ensure they are set in the .env.local file in the project root."
    );
    process.exit(1);
  }
  console.log("Environment variables loaded successfully.");

  // 1. 加载已处理的 slugs
  const processedSlugs = loadProcessedSlugs();
  console.log(
    `Loaded ${processedSlugs.size} previously processed slugs from ${PROCESSED_LOG_FILE}`
  );

  // 2. 从 RAWG API 获取游戏 Slugs
  let allSlugs = [];
  console.log(
    `Attempting to fetch up to ${MAX_PAGES_TO_FETCH} pages from RAWG API...`
  );
  try {
    for (let page = 1; page <= MAX_PAGES_TO_FETCH; page++) {
      const queryParams = new URLSearchParams({
        key: RAWG_API_KEY,
        page: page.toString(),
        page_size: PAGE_SIZE.toString(),
        ordering: ORDERING,
        // platforms: PLATFORMS,
      });
      const path = `${GAMES_ENDPOINT}?${queryParams.toString()}`;
      console.log(`  -> Fetching RAWG API page ${page}: ${path}`);
      const response = await httpsGet(RAWG_BASE_URL, path);

      if (response && Array.isArray(response.results)) {
        const slugsFromPage = response.results
          .map((game) => game.slug)
          .filter((slug) => slug);
        allSlugs.push(...slugsFromPage);
        console.log(
          `     Found ${slugsFromPage.length} slugs on page ${page}.`
        );
        if (!response.next || slugsFromPage.length === 0) {
          console.log(
            "     No more pages or results found according to API. Stopping slug fetching."
          );
          break;
        }
      } else {
        console.warn(
          `     Warning: Invalid response structure for page ${page}. Skipping.`
        );
      }
      console.log(`     Waiting 200ms...`);
      await delay(200);
    }
  } catch (error) {
    console.error("\nError fetching slugs from RAWG API:", error.message);
    process.exit(1);
  }

  const uniqueSlugs = Array.from(new Set(allSlugs));
  console.log(
    `\nTotal unique slugs fetched in this run: ${uniqueSlugs.length}`
  );

  if (uniqueSlugs.length === 0) {
    console.log("No new slugs fetched to process. Exiting.");
    return;
  }

  // 3. 恢复：过滤掉已处理的 slugs
  const slugsToProcess = uniqueSlugs.filter(
    (slug) => !processedSlugs.has(slug)
  );
  const skippedCount = uniqueSlugs.length - slugsToProcess.length; // 恢复计算
  console.log(
    `Skipping ${skippedCount} slugs already processed (found in log).` // 恢复日志
  );
  console.log(
    `Processing ${slugsToProcess.length} new or previously failed slugs.` // 恢复日志
  );

  if (slugsToProcess.length === 0) {
    console.log("All fetched slugs were already processed. Exiting.");
    return;
  }

  // 4. 逐个调用 Supabase Function
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/${FUNCTION_NAME}`;
  console.log(
    `\nStarting to populate Supabase via Edge Function: ${functionUrl}`
  );
  console.log(`Delay between function calls: ${FUNCTION_CALL_DELAY_MS}ms`);

  let successCount = 0;
  let failureCount = 0;

  // --- 恢复循环 ---
  for (let i = 0; i < slugsToProcess.length; i++) {
    const slug = slugsToProcess[i];
    console.log(
      `\n[${i + 1}/${
        slugsToProcess.length
      }] --> Calling Function for slug: ${slug}...`
    );

    try {
      const result = await callSupabaseFunction(
        functionUrl,
        SUPABASE_ANON_KEY,
        slug
      );
      if (result.success) {
        console.log(`  ✅ Success (${result.statusCode}): ${result.message}`);
        logProcessedSlug(slug); // 记录成功处理的 slug
        successCount++;
      } else {
        // Function 返回非 2xx 状态码，或请求本身出错（网络等）
        console.warn(`  ⚠️ Failed (${result.statusCode}): ${result.message}`);
        failureCount++;
        // 注意：这里没有记录失败的 slug 到日志，所以下次还会尝试
      }
    } catch (error) {
      // 这个 catch 理论上不应被频繁触发，因为 callSupabaseFunction 内部处理了请求错误并 resolve
      console.error(
        `  ❌ Unexpected Error during function call for slug "${slug}":`,
        error.message
      );
      failureCount++;
    }

    // 在每次调用后添加延迟
    if (i < slugsToProcess.length - 1 && FUNCTION_CALL_DELAY_MS > 0) {
      // console.log(`      Waiting for ${DELAY_MS}ms...`);
      await delay(FUNCTION_CALL_DELAY_MS);
    }
  }

  // 5. 报告结果 (恢复使用 skippedCount)
  console.log(`\n--- Data Fetch Run Complete ---`);
  console.log(`Total unique slugs fetched in this run: ${uniqueSlugs.length}`);
  console.log(`Skipped (already processed according to log): ${skippedCount}`); // 恢复
  console.log(`Attempted to process: ${slugsToProcess.length}`);
  console.log(`  Successfully processed & logged: ${successCount}`);
  console.log(`  Failed (non-2xx status or request error): ${failureCount}`);
}

// 运行主函数
fetchAndPopulate();
