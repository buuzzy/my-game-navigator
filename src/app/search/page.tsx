"use client"; // 需要读取 URL 参数，标记为客户端组件

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react"; // 导入 useState 和 useEffect
import GameCard from "@/components/GameCard"; // 导入 GameCard 组件

// 定义游戏数据类型 (与更新后的 API 返回匹配)
interface Game {
  name: string;
  slug: string;
  cover_url: string | null; // API 返回的是 cover_url
  description: string;
  tags: string[];
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  // 确认使用 'query' 作为 URL 参数名
  const query = searchParams.get("query");

  // 添加状态来管理搜索结果、加载状态和错误
  const [results, setResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 useEffect 在 query 变化时获取数据
  useEffect(() => {
    if (query && typeof query === "string" && query.trim() !== "") {
      const fetchResults = async () => {
        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
          const response = await fetch(
            `/api/search?query=${encodeURIComponent(query)}`
          );

          if (!response.ok) {
            let errorMsg = `Failed to fetch: ${response.status} ${response.statusText}`;
            try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorMsg;
            } catch {}
            throw new Error(errorMsg);
          }

          // API 返回的数据直接匹配 Game 接口
          const data: Game[] = await response.json();
          setResults(data);
        } catch (err) {
          console.error("Search fetch error:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchResults();
    } else {
      setResults([]);
      setIsLoading(false);
      setError(null);
    }
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24">
      <h1 className="text-2xl font-semibold mb-6">搜索结果</h1>

      {/* 可以在这里或 Header 添加实际的输入框 */}

      {isLoading && (
        <p className="text-lg text-gray-500 dark:text-gray-400 animate-pulse">
          正在加载...
        </p>
      )}

      {error && (
        <div className="text-center p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-md">
          <p className="text-lg text-red-700 dark:text-red-200 font-semibold">
            发生错误
          </p>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {!isLoading && !error && query && results.length > 0 && (
        <div className="w-full max-w-5xl">
          {" "}
          {/* 稍微增大最大宽度以容纳卡片 */}
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            为 "
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {query}
            </span>
            " 找到 {results.length} 个结果:
          </p>
          {/* 使用 div 来包裹卡片列表 */}
          <div className="flex flex-col gap-6">
            {" "}
            {/* 卡片之间使用 gap */}
            {results.map((game) => (
              // 将 GameCard 包裹在 Link 组件中以实现跳转
              <Link
                href={`/game/${game.slug}`}
                key={game.slug}
                className="block hover:opacity-90 transition-opacity"
              >
                <GameCard
                  name={game.name}
                  // 将 API 返回的 cover_url 传递给 GameCard 的 coverUrl prop
                  coverUrl={game.cover_url ?? undefined} // 如果 cover_url 为 null，传递 undefined
                  description={game.description}
                  tags={game.tags}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && query && results.length === 0 && (
        <p className="text-lg text-gray-500 dark:text-gray-400">
          未能找到与 "<span className="font-medium">{query}</span>" 相关的游戏。
        </p>
      )}

      {!query && !isLoading && !error && (
        <p className="text-lg text-gray-500 dark:text-gray-400">
          请输入搜索词以查找游戏。
        </p>
      )}

      <Link
        href="/"
        className="mt-8 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        返回首页
      </Link>
    </div>
  );
}
