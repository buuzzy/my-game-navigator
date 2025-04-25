import Link from 'next/link';
import Image from 'next/image'; // 如果要用 Next/Image 显示占位符

// 更新推荐游戏数据，减少侧边推荐
const featuredGameData = {
  main: {
    id: "elden-ring-featured",
    name: "艾尔登法环",
    imageUrl: "/placeholder-large.png", // 假设的占位图路径
    description: "不容错过的史诗级冒险",
    url: "/game/elden-ring",
  },
  side: [ // 只保留两个侧边推荐
    { id: "bg3-featured", name: "博德之门3", imageUrl: "/placeholder-small-1.png", url: "/game/baldurs-gate-3" },
    { id: "cp2077-featured", name: "赛博朋克 2077", imageUrl: "/placeholder-small-2.png", url: "/game/cyberpunk-2077" },
    // 移除了 Hades 和 Ori
  ]
};

const FeaturedGames = () => {
  return (
    <section className="w-full max-w-6xl mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        精选和推荐
      </h2>
      {/* 调整 Grid 布局: 大屏幕上分为 5 列，主推荐占 3 列，侧边占 2 列 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 主推荐位 (大图) - 占据 3 列 */}
        <Link href={featuredGameData.main.url} className="group block lg:col-span-3 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-[1.02]"> {/* 调整 col-span 和 hover 效果 */}
           <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
             {/* 可以添加 Image 组件 */}
             {/* <Image src={featuredGameData.main.imageUrl} alt={featuredGameData.main.name} fill style={{ objectFit: 'cover' }} className="group-hover:opacity-90 transition-opacity"/> */}
             <span className="text-white text-2xl font-bold opacity-80 pointer-events-none z-10">主打推荐</span>
           </div>
           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
             <h3 className="text-lg font-bold text-white mb-1">{featuredGameData.main.name}</h3>
             <p className="text-sm text-gray-200">{featuredGameData.main.description}</p>
           </div>
        </Link>

        {/* 侧边推荐位 (小图列表) - 占据 2 列 */}
        {/* 内部 Grid 改为 2 行 */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-4">
          {featuredGameData.side.map((game) => (
            <Link key={game.id} href={game.url} className="group block rounded-lg overflow-hidden shadow relative transition-transform transform hover:scale-105"> {/* 调整圆角和 hover 效果 */}
              <div className="aspect-[16/7] sm:aspect-video lg:aspect-[16/7] bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center relative"> {/* 调整宽高比 */}
                {/* <Image src={game.imageUrl} alt={game.name} fill style={{ objectFit: 'cover' }} className="group-hover:opacity-90 transition-opacity"/> */}
                 <span className="text-white text-xs opacity-70 pointer-events-none z-10">推荐</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent"> {/* 调整 padding */}
                <h4 className="text-sm font-semibold text-white truncate">{game.name}</h4> {/* 调整字体大小 */}
              </div>
            </Link>
          ))}
        </div>
      </div>
       {/* 暂时移除滚动提示或控件，未来实现滚动时再添加 */}
       {/* <div class="carousel_thumbs">...</div> */}
       {/* <div class="arrow left">...</div> */}
       {/* <div class="arrow right">...</div> */}
    </section>
  );
};

export default FeaturedGames; 