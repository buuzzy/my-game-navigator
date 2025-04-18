import Image from 'next/image'; // 引入 Image 组件

// 定义 GameCard 组件期望接收的数据类型
interface GameCardProps {
  name: string;
  coverUrl?: string; // 将 coverUrl 设为可选
  description: string;
  tags: string[];
}

// 定义 GameCard 组件
// 使用 { game } 作为 props，或者直接解构: { name, coverUrl, description, tags }
const GameCard: React.FC<GameCardProps> = ({ name, coverUrl, description, tags }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex mb-6 flex-col sm:flex-row"> {/* 调整为 flex-col 在小屏，flex-row 在 sm 及以上 */}
      {/* 封面区域 */}
      <div className="w-full h-48 sm:w-32 sm:h-auto bg-gray-300 dark:bg-gray-600 flex-shrink-0 relative flex items-center justify-center"> {/* 调整尺寸和 flex 属性 */}
        {coverUrl ? (
          // 如果有 coverUrl，则显示图片
          <Image
            src={coverUrl}
            alt={`${name} Cover`}
            fill
            style={{ objectFit: 'cover' }}
            // sizes="(max-width: 640px) 100vw, 8rem" // 可选：为不同屏幕尺寸提供优化提示
          />
        ) : (
          // 否则，显示占位符
          <span className="text-gray-500 dark:text-gray-400 text-sm">封面</span>
        )}
      </div>

      {/* 游戏信息 */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{name}</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3"> {/* line-clamp-3 应直接生效 */}
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto pt-2"> {/* 稍微增加标签和描述之间的间距 */}
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard; // 导出组件
