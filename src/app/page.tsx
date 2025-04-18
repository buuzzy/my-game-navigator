import GameCard from "@/components/GameCard";

// 示例游戏数据 - 暂时移除 coverUrl 或设为 undefined
const games = [
  {
    id: "elden-ring",
    name: "艾尔登法环 (Elden Ring)",
    // coverUrl: "/placeholder-cover.jpg", // 暂时注释掉或移除
    description: "一款由 FromSoftware 开发、万代南梦宫娱乐发行的黑暗奇幻风格动作角色扮演游戏。玩家将踏上辽阔的\"交界地\"，展开充满挑战的冒险。",
    tags: ["动作RPG", "开放世界", "魂系", "奇幻"],
  },
  {
    id: "baldurs-gate-3",
    name: "博德之门3 (Baldur's Gate 3)",
     coverUrl: undefined, // 或者直接不写 coverUrl 属性
    description: "由 Larian Studios 开发并发行的角色扮演游戏，基于《龙与地下城》规则设定。游戏设定在被遗忘的国度，玩家将集结队伍，重返博德之门。",
    tags: ["CRPG", "回合制", "龙与地下城", "剧情丰富"],
  },
  // 在这里添加更多游戏...
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24">
      {/* 网站主标题 */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-gray-100">
        我的游戏导航站
      </h1>

      {/* 游戏列表容器 - 改用 Grid 布局 */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 遍历游戏数据并渲染 GameCard 组件 */}
        {games.map((game) => (
          <GameCard
            key={game.id} // 使用唯一 id 作为 key
            name={game.name}
            coverUrl={game.coverUrl} // 传递可能为 undefined 的 coverUrl
            description={game.description}
            tags={game.tags}
          />
        ))}
      </div>
    </main>
  );
}
