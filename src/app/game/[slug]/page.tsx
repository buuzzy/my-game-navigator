import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { notFound } from "next/navigation"; // 导入 notFound

// Supabase 客户端初始化 (与 API 路由类似，在服务器端运行)
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// 简单的类型定义，基于我们知道的数据库字段
// 注意：数据库实际类型可能需要微调（例如 Date 类型）
interface GameDetails {
  id: number; // Supabase 内部 ID
  rawg_id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  screenshot_urls: string[] | null;
  tags: string[] | null;
  release_date: string | null; // 可能是 'YYYY-MM-DD' 格式
  developers: string[] | null;
  publishers: string[] | null;
  rating: number | null;
  metacritic_score: number | null;
  platforms: string[] | null;
  // 其他字段根据需要添加
}

// 获取数据的异步函数
// 在服务器组件中，可以直接在组件内部 `await` 数据获取
async function getGameDetails(slug: string): Promise<GameDetails | null> {
  // 检查环境变量和客户端创建
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Game Detail Page: Supabase environment variables are not set."
    );
    // 在无法连接数据库的情况下，可以选择抛出错误或返回 null
    // 抛出错误会触发 Next.js 的错误页面
    throw new Error(
      "Database connection failed: Missing environment variables."
    );
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log(`Game Detail Page: Fetching details for slug: ${slug}`);
    const { data, error } = await supabase
      .from("games")
      .select("*") // 获取所有字段
      .eq("slug", slug) // 使用 slug 精确匹配
      .single(); // 期望只返回一个结果，如果找不到或找到多个则为 error

    if (error) {
      // 如果错误是因为没有找到记录 (PGRST116)，则返回 null
      if (error.code === "PGRST116") {
        console.log(`Game Detail Page: Game with slug "${slug}" not found.`);
        return null;
      }
      // 其他数据库错误
      console.error(
        `Game Detail Page: Supabase query error for slug "${slug}":`,
        error
      );
      // 抛出错误以显示错误页面
      throw new Error(
        `Failed to fetch game details from database: ${error.message}`
      );
    }

    console.log(
      `Game Detail Page: Successfully fetched details for ${data?.name}`
    );
    return data as GameDetails; // 假设返回的数据匹配接口
  } catch (err) {
    // 捕获创建客户端或查询中的其他错误
    console.error(
      `Game Detail Page: Error fetching game details for slug "${slug}":`,
      err
    );
    // 重新抛出错误
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("An unknown error occurred while fetching game details.");
    }
  }
}

// 页面组件定义
// params 会自动包含从 URL 路径中提取的参数，例如 { slug: "elden-ring" }
export default async function GameDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 调用异步函数获取数据
  const game = await getGameDetails(slug);

  // 如果游戏未找到，调用 notFound() 显示 Next.js 的 404 页面
  if (!game) {
    notFound();
  }

  // 基本的页面渲染
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* 封面图 */}
      {game.cover_url && (
        <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={game.cover_url}
            alt={`${game.name} Cover`}
            fill
            style={{ objectFit: "cover" }}
            priority // 优先加载封面图
          />
        </div>
      )}

      {/* 游戏标题 */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {game.name}
      </h1>

      {/* 基本信息行 */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        {game.release_date && (
          <span>
            发布日期: {new Date(game.release_date).toLocaleDateString()}
          </span>
        )}
        {game.rating && <span>评分: {game.rating.toFixed(1)} / 5</span>}
        {game.metacritic_score && (
          <span>Metacritic: {game.metacritic_score}</span>
        )}
      </div>

      {/* 描述 */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-semibold mb-3">关于游戏</h2>
        {/* 使用 pre-wrap 保留换行符 */}
        <p className="whitespace-pre-wrap">
          {game.description || "暂无描述。"}
        </p>
      </div>

      {/* 截图廊 (简单实现) */}
      {game.screenshot_urls && game.screenshot_urls.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">截图</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {game.screenshot_urls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-video rounded overflow-hidden shadow"
              >
                <Image
                  src={url}
                  alt={`${game.name} Screenshot ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  loading="lazy" // 懒加载截图
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 更多信息区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        {/* 平台 */}
        {game.platforms && game.platforms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">平台</h3>
            <div className="flex flex-wrap gap-2">
              {game.platforms.map((platform) => (
                <span
                  key={platform}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        {game.tags && game.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 开发商 */}
        {game.developers && game.developers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">开发商</h3>
            <p>{game.developers.join(", ")}</p>
          </div>
        )}

        {/* 发行商 */}
        {game.publishers && game.publishers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">发行商</h3>
            <p>{game.publishers.join(", ")}</p>
          </div>
        )}
      </div>

      {/* 可以添加返回链接 */}
      <div className="mt-8">
        <a
          href="/"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          返回首页
        </a>
        <span className="mx-2">|</span>
        {/* 如果需要，可以提供返回搜索页的链接，但这需要知道之前的搜索词 */}
        {/* <a href="/search" className="text-indigo-600 dark:text-indigo-400 hover:underline">返回搜索</a> */}
      </div>
    </div>
  );
}

// 可选：添加 generateStaticParams 以在构建时预渲染已知游戏的页面
// export async function generateStaticParams() {
//   if (!supabaseUrl || !supabaseAnonKey) return [];
//   const supabase = createClient(supabaseUrl, supabaseAnonKey);
//   const { data: games } = await supabase.from('games').select('slug');
//   return games?.map((game) => ({
//     slug: game.slug,
//   })) || [];
// }

// 可选：添加 revalidate 控制页面的 ISR (增量静态再生) 行为
// export const revalidate = 3600; // 例如，每小时重新验证一次
