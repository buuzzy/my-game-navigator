// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"; // 使用具体版本
import { OpenAI, APIError } from "npm:openai@^4.0.0"; // 导入 OpenAI 库，可以考虑导入 APIError 类型
import { corsHeaders } from "../_shared/cors.ts"; // 用于处理 CORS

// --- 配置 ---
// 从 Supabase Secrets 或本地 .env.local (用于 supabase start) 读取
const RAWG_API_KEY = Deno.env.get("RAWG_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// 新增：从环境变量读取 OpenAI 相关配置
const OPENAI_BASE_URL = Deno.env.get("OPENAI_BASE_URL");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const EMBEDDING_MODEL = "text-embedding-3-small"; // 确认使用的模型
const MAX_CHARS_FOR_EMBEDDING = 20000; // 和批量脚本保持一致的截断限制

console.log("Function started: fetch-game-data with embedding generation");

// --- 初始化 OpenAI 客户端 (如果配置存在) ---
let openai: OpenAI | null = null;
if (OPENAI_BASE_URL && OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: OPENAI_BASE_URL,
    });
    console.log("OpenAI client initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize OpenAI client:", e);
    // 初始化失败，后续 embedding 会跳过，但函数可能仍能继续处理其他数据
  }
} else {
  console.warn(
    "OpenAI environment variables (OPENAI_BASE_URL, OPENAI_API_KEY) are not fully configured. Embedding generation will be skipped."
  );
}

serve(async (req: Request) => {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 检查基础环境变量是否加载
    if (!RAWG_API_KEY) {
      throw new Error("RAWG API Key is missing in the environment.");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase URL or Service Role Key is missing.");
    }

    // 1. 从请求体中获取游戏 slug 或 id
    const { gameIdentifier } = await req.json();
    if (!gameIdentifier) {
      throw new Error("Missing 'gameIdentifier' in request body");
    }
    console.log(`Processing request for gameIdentifier: ${gameIdentifier}`);

    // 2. 调用 RAWG API 获取游戏详情
    const gameDetailsResponse = await fetch(
      `https://api.rawg.io/api/games/${gameIdentifier}?key=${RAWG_API_KEY}`
    );
    if (!gameDetailsResponse.ok) {
      const errorBody = await gameDetailsResponse.text();
      throw new Error(
        `Failed to fetch game details from RAWG: ${gameDetailsResponse.status} ${gameDetailsResponse.statusText}. Body: ${errorBody}`
      );
    }
    const gameDetails = await gameDetailsResponse.json();
    console.log(
      `Fetched details for ${gameDetails.name} (ID: ${gameDetails.id})`
    );

    // 3. 调用 RAWG API 获取截图
    let screenshots: string[] = [];
    if (gameDetails.id) {
      const screenshotsResponse = await fetch(
        `https://api.rawg.io/api/games/${gameDetails.id}/screenshots?key=${RAWG_API_KEY}`
      );
      if (screenshotsResponse.ok) {
        const screenshotsData = await screenshotsResponse.json();
        screenshots =
          screenshotsData.results?.map((ss: { image: string }) => ss.image) ||
          [];
        console.log(`Fetched ${screenshots.length} screenshots`);
      } else {
        console.warn(
          `Failed to fetch screenshots for game ID ${gameDetails.id}: ${screenshotsResponse.status} ${screenshotsResponse.statusText}`
        );
      }
    } else {
      console.warn("Game ID not found in details, cannot fetch screenshots.");
    }

    // 4. 准备基础游戏数据
    const aliases = new Set<string>();
    if (gameDetails.name) aliases.add(gameDetails.name.trim());
    if (gameDetails.name_original)
      aliases.add(gameDetails.name_original.trim());
    if (Array.isArray(gameDetails.alternative_names)) {
      gameDetails.alternative_names.forEach((altName: string) => {
        if (altName) aliases.add(altName.trim());
      });
    }
    const searchAliasesArray = Array.from(aliases).filter(
      (alias) => alias.length > 0
    );

    // --- 新增：生成 Embedding ---
    let embeddingVector: number[] | null = null; // 初始化为 null
    const gameName = gameDetails.name || "";
    const gameDescription =
      gameDetails.description_raw || gameDetails.description || "";
    // --- 新增：获取标签和别名，用于构建文本 ---
    const gameTags =
      gameDetails.tags?.map((tag: { name: string }) => tag.name) || [];
    // searchAliasesArray 已经在前面生成好了

    if (
      openai &&
      (gameName ||
        gameDescription ||
        gameTags.length > 0 ||
        searchAliasesArray.length > 0)
    ) {
      // 检查所有字段
      // 仅当 OpenAI 客户端可用且至少有一个字段非空时尝试

      // --- *** 修改点：构建包含所有字段的 combinedText *** ---
      const gameTagsString = gameTags.join(", "); // 将标签数组转换为逗号分隔的字符串
      const gameAliasesString = searchAliasesArray.join(", "); // 将别名数组转换为逗号分隔的字符串
      // 使用与 generate_embeddings.js 一致的格式
      let combinedText = `Name: ${gameName}\nAliases: ${gameAliasesString}\nTags: ${gameTagsString}\nDescription: ${gameDescription}`;
      // --- 结束修改点 ---

      // --- 处理文本超长 (应用到新的 combinedText) ---
      if (combinedText.length > MAX_CHARS_FOR_EMBEDDING) {
        console.warn(
          `[Edge Function] 游戏 slug ${gameIdentifier} 的组合文本过长 (${combinedText.length})，将截断。`
        );
        // 可以保留之前的截断逻辑，或者根据需要调整
        combinedText = combinedText.substring(0, MAX_CHARS_FOR_EMBEDDING);
        console.log(`[Edge Function] 截断后长度: ${combinedText.length}`);
      }
      const sourceText = combinedText; // 这是最终发送给 OpenAI 的文本

      try {
        console.log(
          `[Edge Function] 正在为 slug ${gameIdentifier} 生成 embedding... (文本长度: ${sourceText.length})`
        );
        const embeddingResponse = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: sourceText,
          encoding_format: "float",
        });

        if (embeddingResponse?.data?.[0]?.embedding) {
          embeddingVector = embeddingResponse.data[0].embedding;
          console.log(
            `[Edge Function] Embedding 生成成功 for slug ${gameIdentifier}.`
          );
        } else {
          console.error(
            `[Edge Function] Embedding API 响应格式无效 for slug ${gameIdentifier}:`,
            JSON.stringify(embeddingResponse) // 打印完整响应以便调试
          );
        }
      } catch (error: unknown) {
        console.error(
          `[Edge Function] 生成 Embedding 时出错 for slug ${gameIdentifier}:`
        );
        if (error instanceof APIError) {
          console.error(`  Status: ${error.status}`);
          console.error(`  Message: ${error.message}`);
          console.error(`  Code: ${error.code}`);
          console.error(`  Type: ${error.type}`);
        } else if (error instanceof Error) {
          console.error(`  Error Message: ${error.message}`);
        } else {
          console.error(`  Unknown Error: ${JSON.stringify(error)}`);
        }
        console.warn(
          `[Edge Function] Proceeding without embedding for slug ${gameIdentifier} due to error.`
        );
      }
    } else if (!openai) {
      console.log(
        `[Edge Function] 跳过 slug ${gameIdentifier} 的 embedding 生成，因为 OpenAI 客户端未配置或初始化失败。`
      );
    } else {
      console.log(
        `[Edge Function] 跳过 slug ${gameIdentifier} 的 embedding 生成，因为名称、描述、标签和别名均为空。` // 更新日志
      );
    }
    // --- 结束：生成 Embedding ---

    // 5. 准备最终要插入/更新到 Supabase 的数据 (包含 embedding)
    const gameDataToUpsert = {
      rawg_id: gameDetails.id,
      name: gameName,
      slug: gameDetails.slug,
      description: gameDescription,
      cover_url: gameDetails.background_image,
      screenshot_urls: screenshots,
      tags: gameTags, // 存储原始标签数组
      release_date: gameDetails.released || null,
      developers:
        gameDetails.developers?.map((dev: { name: string }) => dev.name) || [],
      publishers:
        gameDetails.publishers?.map((pub: { name: string }) => pub.name) || [],
      rating: gameDetails.rating || null,
      metacritic_score: gameDetails.metacritic || null,
      platforms:
        gameDetails.platforms?.map(
          (p: { platform: { name: string } }) => p.platform.name
        ) || [],
      search_aliases: searchAliasesArray, // 存储原始别名数组
      embedding: embeddingVector, // 包含 embedding 向量（可能为 null）
    };

    // 6. 连接 Supabase 并执行 Upsert 操作 (使用 Admin Client)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(
      `Attempting to upsert game: ${gameDataToUpsert.name} (RAWG ID: ${
        gameDataToUpsert.rawg_id
      }) (包含 embedding: ${!!embeddingVector})`
    );
    const { data, error } = await supabaseAdmin
      .from("games") // 确认表名是 'games'
      .upsert(gameDataToUpsert, { onConflict: "rawg_id" }) // 假设 rawg_id 是你的唯一冲突键
      .select("id, name, slug") // 只选择少量关键信息返回
      .single();

    if (error) {
      let dbErrorMessage = "Supabase DB Error";
      try {
        dbErrorMessage = JSON.stringify(error, null, 2);
      } catch {
        dbErrorMessage = String(error);
      }
      console.error("Supabase upsert failed:", dbErrorMessage);
      throw new Error(`Database upsert operation failed: ${dbErrorMessage}`);
    }

    console.log(
      `Successfully upserted game: ${data?.name} (DB ID: ${data?.id})`
    );

    // 7. 返回成功响应
    return new Response(
      JSON.stringify({
        success: true,
        message: `Game data for ${gameIdentifier} processed successfully (embedding generated: ${!!embeddingVector}).`,
        upsertedData: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred during function execution.";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Function execution failed:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Caught a non-Error exception during execution:", error);
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = String(error);
      }
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* 
本地调用说明 (需要本地 Docker 环境和 .env.local 文件):
1. 运行 `supabase start`
2. 使用 curl (将 YOUR_SUPABASE_ANON_KEY 替换为本地默认 Key):
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetch-game-data' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"gameIdentifier": "elden-ring"}' // 或其他 slug/ID
*/
