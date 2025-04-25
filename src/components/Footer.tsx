import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // 获取当前年份

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto"> {/* mt-auto 会尝试将页脚推到底部 (在flex布局中效果更好) */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {currentYear} 我的游戏导航站. 保留所有权利.
          </p>
          {/* 可以添加一些次要链接 */}
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link href="/privacy" className="text-xs leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              隐私政策
            </Link>
            <Link href="/terms" className="text-xs leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
