import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

// Type definitions (assuming these exist or create/import them)
interface Game {
  id: number;
  name: string;
  slug: string;
  cover_url: string | null;
  description: string | null;
  tags: string[] | null;
  release_date: string | null; // Keep as string initially from DB
}

// --- Environment Variables ---
// Read variables based on your .env.local names
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use the Service Role Key for backend operations

// OpenAI Credentials (for Embeddings)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiBaseUrl = process.env.OPENAI_BASE_URL;

// DeepSeek Credentials (for Query Transformation) - 新增
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL;

// --- Initialize Supabase Client ---
if (!supabaseUrl || !supabaseServiceKey) {
  // Updated error message for clarity
  throw new Error(
    "Supabase Project URL or Service Role Key is missing in environment variables."
  );
}
// Initialize with Service Role Key for server-side RPC calls
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Initialize OpenAI Client (for Embeddings) ---
if (!openaiApiKey) {
  // 保留对 OpenAI Key 的检查，因为 Embedding 仍需它
  throw new Error("OpenAI API Key (for embeddings) is missing.");
}
const openaiEmbeddingClient = new OpenAI({
  apiKey: openaiApiKey,
  baseURL: openaiBaseUrl,
});
console.log("OpenAI Embedding Client Initialized."); // 确认日志

// --- Initialize DeepSeek Client (for Query Transformation) --- 新增
if (!deepseekApiKey || !deepseekBaseUrl) {
  // 添加对 DeepSeek 环境变量的检查
  throw new Error(
    "DeepSeek API Key or Base URL (for query transformation) is missing."
  );
}
const deepseekClient = new OpenAI({
  apiKey: deepseekApiKey,
  baseURL: deepseekBaseUrl,
});
console.log("DeepSeek Client Initialized."); // 确认日志

// --- Constants ---
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536; // 确认维度与模型和 SQL 函数匹配
const MAX_RESULTS = 20; // Limit the total number of results

// 新增：定义用于转换的 DeepSeek 模型名称 (请根据 DeepSeek 文档确认可用模型，'deepseek-chat' 是常见选项)
const TRANSFORM_MODEL = "deepseek-chat";

// Helper function to generate embeddings
async function getEmbedding(text: string): Promise<number[]> {
  console.log(
    `Hybrid Search API: Generating embedding (OpenAI) for: "${text}"...`
  );
  try {
    // 使用 openaiEmbeddingClient
    const response = await openaiEmbeddingClient.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    console.log(`Hybrid Search API: Query vectorized (OpenAI).`);
    if (
      response.data &&
      response.data.length > 0 &&
      response.data[0].embedding
    ) {
      // 确保返回的向量维度正确
      if (response.data[0].embedding.length !== EMBEDDING_DIMENSIONS) {
        console.warn(
          `Hybrid Search API: Warning - Embedding dimension mismatch. Expected ${EMBEDDING_DIMENSIONS}, got ${response.data[0].embedding.length}`
        );
      }
      return response.data[0].embedding;
    } else {
      console.error(
        "Hybrid Search API: Failed to get embedding (OpenAI), empty response or missing data."
      );
      throw new Error("Failed to get embedding (OpenAI)");
    }
  } catch (error) {
    console.error(
      "Hybrid Search API: Error generating embedding (OpenAI):",
      error
    );
    throw error; // Re-throw the error to be handled by the main function
  }
}

// --- NEW: Helper function for Query Transformation (使用 DeepSeek Client) ---
const transformPromptTemplate = `你是一个游戏搜索引擎的查询转换助手。请将用户的自然语言请求转换为一个简洁的关键词/短语查询字符串，用于游戏数据库的全文搜索。输出应该只包含最关键的游戏名称、类型、特征、平台或玩法描述词语，并尽量保持原始词语。保持简短。不要包含任何解释性文字，只输出查询字符串。

示例 1:
用户请求: "我想找一些有点像《黑暗之魂》但没那么难，而且画面风格独特的魂类游戏。"
输出: "soulslike unique art style not too hard dark souls"

示例 2:
用户请求: "有没有适合周末晚上和女朋友一起玩的、氛围轻松的合作解谜游戏？"
输出: "co-op puzzle game relaxing atmosphere multiplayer"

示例 3:
用户请求: "推荐几款评价很高的太空科幻题材的策略游戏。"
输出: "space sci-fi strategy high rating"

示例 4:
用户请求: "上周那个很火的、可以在里面扮演一只猫到处探索的赛博朋克风格独立游戏叫什么来着？"
输出: "cat protagonist cyberpunk exploration indie recent popular"

示例 5:
用户请求: "elden ring"
输出: "elden ring"

示例 6:
用户请求: "能联机的开放世界西部射击游戏"
输出: "multiplayer open world western shooter"

---

现在，请转换以下用户请求：
用户请求: "{USER_QUERY}"
输出:`;

async function transformQueryWithLLM(originalQuery: string): Promise<string> {
  const prompt = transformPromptTemplate.replace("{USER_QUERY}", originalQuery);

  try {
    console.log(
      `Hybrid Search API: Transforming query with LLM (DeepSeek): "${originalQuery}"`
    );
    // 使用 deepseekClient
    const response = await deepseekClient.chat.completions.create({
      model: TRANSFORM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // 低温以获得更确定的输出
      max_tokens: 60, // 限制输出长度，避免过长
      stream: false, // 确保我们得到完整的响应
    });

    const transformedQuery =
      response.choices[0]?.message?.content?.trim() || originalQuery;
    // 基本的后处理：移除可能出现的引号
    const cleanedQuery = transformedQuery.replace(/^["']|["']$/g, "");
    console.log(
      `Hybrid Search API: Transformed query (DeepSeek): "${cleanedQuery}"`
    );
    // 增加一个检查，如果转换后的查询太短或与原始查询相同，可能需要考虑是否使用原始查询
    if (
      cleanedQuery.length < 3 ||
      cleanedQuery.toLowerCase() === originalQuery.toLowerCase()
    ) {
      console.log(
        "Hybrid Search API: Transformed query is too short or same as original, potentially using original for FTS as well."
      );
      // 这里可以决定是否回退，当前逻辑是仍然使用转换后的（即使相同）
    }
    return cleanedQuery;
  } catch (error) {
    console.error(
      "Hybrid Search API: Error during LLM query transformation (DeepSeek):",
      error
    );
    console.log(
      "Hybrid Search API: Falling back to original query for FTS due to transformation error."
    );
    return originalQuery; // 错误时回退到原始查询
  }
}

// --- Main API Route Handler ---
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // 重命名为 originalQuery 以示区分
  const originalQuery = searchParams.get("query");

  if (!originalQuery) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  console.log(
    `\nHybrid Search API: Received original query: "${originalQuery}"`
  );

  try {
    // 并行执行查询转换和向量生成，以节省时间
    const transformPromise = transformQueryWithLLM(originalQuery);
    const embeddingPromise = getEmbedding(originalQuery); // 仍然使用原始查询生成向量

    // 等待两个操作完成
    const [transformedQueryText, embedding] = await Promise.all([
      transformPromise,
      embeddingPromise,
    ]);

    // --- RRF Parameter Tuning (Iteration 3) ---
    // 优化目标：大幅降低阈值，确保 RDR2 能匹配 'open world western'，同时尝试提升语义权重
    const rrfParams = {
      full_text_weight: 1.1, // 略微提高 FTS 权重，兼顾 "western" 关键词
      semantic_weight: 2.0, // 更激进地提高 semantic 权重
      rrf_k: 20, // 进一步减小 k，极度放大 FTS/向量 Top 结果优势
    };
    console.log(
      `Hybrid Search API: Using RRF Params: full_text_weight=${rrfParams.full_text_weight}, semantic_weight=${rrfParams.semantic_weight}, rrf_k=${rrfParams.rrf_k}`
    );

    // --- Semantic Threshold (Iteration 3) ---
    // 大幅降低阈值，首要目标是让相关结果 (如 RDR2) 能进入 RRF 阶段
    const semanticThreshold = 0.38; // 保持上次成功的阈值
    console.log(
      `Hybrid Search API: Using Semantic Threshold: ${semanticThreshold}`
    );

    // 调用 hybrid_search_games 函数
    console.log(
      `Hybrid Search API: Calling hybrid_search_games with transformed text ("${transformedQueryText}") and original embedding...`
    );
    const { data: hybridResults, error: hybridError } = await supabase.rpc(
      "hybrid_search_games",
      {
        query_text: transformedQueryText, // 使用转换后的文本进行 FTS
        query_embedding: embedding, // 使用原始嵌入进行向量搜索
        match_count: MAX_RESULTS,
        full_text_weight: rrfParams.full_text_weight,
        semantic_weight: rrfParams.semantic_weight,
        rrf_k: rrfParams.rrf_k,
        semantic_threshold: semanticThreshold, // 使用大幅降低后的阈值
      }
    );

    if (hybridError) {
      console.error(
        "Hybrid Search API: Error calling hybrid_search_games RPC:",
        hybridError
      );
      // 抛出错误，让下面的 catch 处理，以便记录更详细的 DB 错误信息
      throw hybridError;
    }

    // SQL 函数直接返回最终排序好的结果
    const finalResults = (hybridResults || []) as Game[];

    console.log(
      `Hybrid Search API: Received ${finalResults.length} results from hybrid search.`
    );
    // 增加日志查看返回结果的 slug，便于调试
    console.log(
      `Hybrid Search API: First few identifiers: [${finalResults
        .slice(0, 7) // 显示前 7 个 slug
        .map((g) => g.slug)
        .join(", ")}]`
    );
    console.log(
      `Hybrid Search API: Returning ${finalResults.length} final results.`
    );

    // 直接返回 RRF 函数的结果
    return NextResponse.json(finalResults);
  } catch (error: any) {
    console.error("Hybrid Search API: Critical error in handler:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An internal server error occurred";
    // 尝试解析 PostgREST 错误以提供更具体的信息
    if (error.code && error.message) {
      console.error(
        `Hybrid Search API: DB Error Code: ${error.code}, Message: ${error.message}, Details: ${error.details}, Hint: ${error.hint}`
      );
      // 返回更具体的数据库错误信息给客户端（如果安全的话）
      // 或者返回通用错误信息，但记录详细信息
      return NextResponse.json(
        { error: `Search failed due to database error: ${error.message}` },
        { status: 500 }
      );
    }
    // 返回通用错误
    return NextResponse.json(
      { error: "Search failed", details: errorMessage },
      { status: 500 }
    );
  }
}
