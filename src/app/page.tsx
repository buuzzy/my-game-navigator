"use client"; // 因为要使用 useState 和 useRouter，需要标记为客户端组件

import { useState } from "react"; // 导入 useState
import { useRouter } from "next/navigation"; // 导入 useRouter
import GameCard from "@/components/GameCard"; // 重新添加这一行导入！
// import FeaturedGames from "@/components/FeaturedGames"; // 移除旧的导入
import FeaturedCarousel from "@/components/FeaturedCarousel"; // 导入新的轮播组件

// 示例游戏数据 - 暂时移除 coverUrl 或设为 undefined
const games = [
  {
    id: "elden-ring",
    name: "艾尔登法环 (Elden Ring)",
    // coverUrl: "/placeholder-cover.jpg", // 暂时注释掉或移除
    description:
      '一款由 FromSoftware 开发、万代南梦宫娱乐发行的黑暗奇幻风格动作角色扮演游戏。玩家将踏上辽阔的"交界地"，展开充满挑战的冒险。',
    tags: ["动作RPG", "开放世界", "魂系", "奇幻"],
  },
  {
    id: "baldurs-gate-3",
    name: "博德之门3 (Baldur's Gate 3)",
    coverUrl: undefined, // 或者直接不写 coverUrl 属性
    description:
      "由 Larian Studios 开发并发行的角色扮演游戏，基于《龙与地下城》规则设定。游戏设定在被遗忘的国度，玩家将集结队伍，重返博德之门。",
    tags: ["CRPG", "回合制", "龙与地下城", "剧情丰富"],
  },
  {
    id: "cyberpunk-2077",
    name: "赛博朋克 2077 (Cyberpunk 2077)",
    // coverUrl: "/placeholder-cover-3.jpg",
    description:
      "一款由 CD Projekt RED 开发并发行的动作角色扮演游戏，改编自桌面游戏《赛博朋克2020》。故事发生在夜之城，一座沉溺于力量、魅力和身体改造的大都会。",
    tags: ["动作RPG", "开放世界", "赛博朋克", "剧情丰富"],
  },
  // 在这里添加更多游戏...
];

// 提取所有唯一标签
const allTags = Array.from(new Set(games.flatMap((game) => game.tags)));

export default function Home() {
  // useState Hook 来管理当前选中的标签，初始值为 'All'
  const [selectedTag, setSelectedTag] = useState<string>("All");
  // 添加 searchTerm 状态
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter(); // 获取 router 实例

  // 根据选中的标签过滤游戏列表
  const filteredGames =
    selectedTag === "All"
      ? games // 如果选中 'All'，显示所有游戏
      : games.filter((game) => game.tags.includes(selectedTag)); // 否则，只显示包含选中标签的游戏

  // 处理搜索提交的函数
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const trimmedSearchTerm = searchTerm.trim(); // 去除前后空格
    if (trimmedSearchTerm) {
      // 确保搜索词不为空
      // 注意：确保这里的参数名 'query' 与 search/page.tsx 和 api/search/route.ts 中的一致
      router.push(`/search?query=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      console.log("搜索词不能为空");
      // 可以在这里添加用户提示，例如设置一个错误状态或让输入框聚焦
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24">
      {/* 网站主标题 */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-gray-100">
        发现你的下一款挚爱游戏
      </h1>

      {/* 搜索栏 - 将 handleSearch 绑定到 onSubmit */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl mb-16 flex gap-3 items-center"
      >
        <input
          type="search"
          // 绑定 value 和 onChange
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索游戏..."
          className="flex-grow px-5 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-shadow duration-200 ease-in-out shadow-sm focus:shadow-md"
          // 可选：添加 onKeyDown 处理 Enter 键，但 onSubmit 通常足够
          // onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e as any); }} // 不推荐，onSubmit 更好
        />
        <button
          type="submit"
          className="px-8 py-3 text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors shadow hover:shadow-md"
        >
          搜索
        </button>
      </form>

      {/* 推荐栏目 - 使用轮播组件 */}
      <FeaturedCarousel />

      {/* 分类/标签过滤标题 */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 mt-10">
        按标签浏览
      </h2>

      {/* 标签过滤按钮区域 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {/* "全部"按钮 */}
        <button
          onClick={() => setSelectedTag("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
                      ${
                        selectedTag === "All"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
        >
          全部
        </button>
        {/* 动态生成标签按钮 */}
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)} // 点击时更新选中的标签
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
                        ${
                          selectedTag === tag
                            ? "bg-indigo-600 text-white" // 选中时的样式
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`} // 未选中时的样式
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 游戏列表容器 - 使用过滤后的列表 */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(
          (
            game // 注意这里使用的是 filteredGames
          ) => (
            <GameCard
              key={game.id}
              name={game.name}
              coverUrl={game.coverUrl}
              description={game.description}
              tags={game.tags}
            />
          )
        )}
        {/* 如果过滤后没有游戏，可以显示提示信息 */}
        {filteredGames.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 md:col-span-2 lg:col-span-3 text-center mt-8">
            没有找到包含标签 "{selectedTag}" 的游戏。
          </p>
        )}
      </div>
    </main>
  );
}
