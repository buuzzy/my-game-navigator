import Link from 'next/link'; // 使用 Next.js 的 Link 组件进行客户端导航

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50"> {/* 添加背景、阴影、粘性定位 */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo 和标题 */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            {/* 暂时用文字 Logo */}
            {/* <img className="h-8 w-auto rounded-full mr-2" src="/logo-placeholder.svg" alt="Logo" /> */}
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              游戏导航站
            </span>
          </Link>
        </div>

        {/* 导航链接 */}
        <div className="hidden lg:flex lg:gap-x-12"> {/* lg:flex 在大屏幕上显示 */}
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
            所有游戏
          </Link>
          <Link href="/categories" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
            分类
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
            关于
          </Link>
        </div>

        {/* 右侧占位 (未来可放用户头像、登录按钮等) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">Log in <span aria-hidden="true">&rarr;</span></a> */}
        </div>

        {/* 移动端菜单按钮 (功能暂不实现) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            // onClick={() => setMobileMenuOpen(true)} // 需要 state 来控制
          >
            <span className="sr-only">Open main menu</span>
            {/* Heroicon - bars-3 */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>
      {/* 移动端菜单面板 (功能暂不实现) */}
      {/* <div className="lg:hidden" role="dialog" aria-modal="true"> ... </div> */}
    </header>
  );
};

export default Header;
