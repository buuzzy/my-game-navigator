"use client"; // Swiper 组件需要在客户端运行

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 假设使用 Image

// 导入 Swiper React 组件
import { Swiper, SwiperSlide } from 'swiper/react';

// 导入 Swiper 核心样式和所需模块的样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // 可以选用淡入淡出效果

// 导入所需 Swiper 模块
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// 示例轮播数据 (数组形式)
const carouselData = [
  {
    id: "elden-ring-carousel",
    name: "艾尔登法环",
    mainImageUrl: "/placeholder-large-1.png", // 左侧大图
    screenshotUrls: [
         "/placeholder-ss-1a.png",
         "/placeholder-ss-1b.png", // 至少需要两个
         // "/placeholder-ss-1c.png",
         // "/placeholder-ss-1d.png",
    ],
    description: "不容错过的史诗级冒险",
    url: "/game/elden-ring",
  },
  {
    id: "bg3-carousel",
    name: "博德之门3",
    mainImageUrl: "/placeholder-large-2.png",
     screenshotUrls: [
         "/placeholder-ss-2a.png",
         "/placeholder-ss-2b.png",
         // "/placeholder-ss-2c.png",
         // "/placeholder-ss-2d.png",
    ],
    description: "集结队伍，重返博德之门",
    url: "/game/baldurs-gate-3",
  },
  {
    id: "cp2077-carousel",
    name: "赛博朋克 2077",
    mainImageUrl: "/placeholder-large-3.png",
     screenshotUrls: [
         "/placeholder-ss-3a.png",
         "/placeholder-ss-3b.png",
         // "/placeholder-ss-3c.png",
         // "/placeholder-ss-3d.png",
    ],
    description: "沉溺于力量、魅力和身体改造的大都会",
    url: "/game/cyberpunk-2077",
  },
  // 可以添加更多游戏
];

const FeaturedCarousel = () => {
  return (
    <section className="w-full max-w-6xl mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        精选和推荐
      </h2>

      {/* Swiper 容器 */}
      <Swiper
        // 安装所需模块
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={30} // Slide 之间的间距
        slidesPerView={1} // 每次只显示一个 Slide
        navigation // 启用前进后退箭头
        pagination={{ clickable: true }} // 启用分页器（小圆点），并允许点击切换
        loop={true} // 循环播放
        autoplay={{ // 自动播放设置
          delay: 3000, // 修改延迟为 3000ms (3秒)
          disableOnInteraction: false, // 用户操作后不停止自动播放 (可以设为 true)
        }}
        effect="fade" // 使用淡入淡出效果 (可选, 可换成 'slide')
        fadeEffect={{ crossFade: true }} // 淡入淡出效果配置
        className="rounded-lg shadow-lg overflow-hidden relative group bg-gray-800" // 加个背景色防止闪烁
      >
        {carouselData.map((game) => (
          <SwiperSlide key={game.id}>
            {/* 每个 Slide 内部使用 Flex 布局分成左右两部分 */}
            <div className="flex flex-col md:flex-row aspect-[16/9] md:aspect-[16/7]"> {/* 调整整体高宽比 */}

              {/* 左侧：主封面图 */}
              <Link href={game.url} className="w-full md:w-2/3 block relative overflow-hidden group/mainimg">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                   {/* 主图占位符 */}
                   {/* <Image
                     src={game.mainImageUrl}
                     alt={`${game.name} 主图`}
                     fill
                     style={{ objectFit: 'cover' }}
                     className="transition-transform duration-500 ease-in-out group-hover/mainimg:scale-105"
                   /> */}
                   <span className="text-white text-2xl font-bold opacity-50 pointer-events-none z-10">{game.name} 主图</span>
                </div>
                {/* 主图的底部信息可以移到右侧或保留 */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-20">
                     <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                </div> */}
              </Link>

              {/* 右侧：游戏信息和截图列表 */}
              <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between">
                 {/* 游戏标题和描述 */}
                 <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{game.name}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{game.description}</p>
                 </div>

                 {/* 截图缩略图列表 - 改为单列，上下排列 */}
                 <div className="grid grid-cols-1 gap-2 mt-auto"> {/* 改为 grid-cols-1 */}
                   {game.screenshotUrls.slice(0, 2).map((ssUrl, index) => ( // 只取前两张截图
                     <div key={index} className="aspect-video rounded overflow-hidden bg-black/30 relative group/ss">
                       {/* 截图占位符 */}
                       {/* <Image src={ssUrl} alt={`${game.name} 截图 ${index + 1}`} fill style={{ objectFit: 'cover' }} className="transition-opacity duration-300 group-hover/ss:opacity-80" /> */}
                       <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[9px] opacity-60 pointer-events-none">截图 {index+1}</span>
                     </div>
                   ))}
                 </div>
                 {/* 可以在这里添加价格、标签等其他信息 */}
              </div>

            </div>
          </SwiperSlide>
        ))}

        {/* 自定义导航按钮样式 (可选，覆盖默认样式) */}
        {/* Swiper 会自动添加 .swiper-button-prev 和 .swiper-button-next 类 */}
        <style jsx global>{`
          .swiper-button-prev,
          .swiper-button-next {
            color: white;
            opacity: 0.5;
            transition: opacity 0.3s ease;
            background-color: rgba(0, 0, 0, 0.3); /* 加个半透明背景 */
            padding: 8px;
            border-radius: 50%;
            width: 40px; /* 调整大小 */
            height: 40px;
            top: 50%; /* 垂直居中 */
            transform: translateY(-50%);
          }
          .swiper-button-prev::after,
          .swiper-button-next::after {
              font-size: 16px !important; /* 调整箭头大小 */
          }
          .swiper:hover .swiper-button-prev,
          .swiper:hover .swiper-button-next {
            opacity: 1;
          }
          .swiper-pagination-bullet {
            background-color: rgba(255, 255, 255, 0.5);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background-color: white;
          }
        `}</style>
      </Swiper>
    </section>
  );
};

export default FeaturedCarousel; 