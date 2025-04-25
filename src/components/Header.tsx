"use client"; // 标记为客户端组件，因为使用了 useState

import { useState } from 'react'; // 导入 useState
import Link from 'next/link'; // 使用 Next.js 的 Link 组件进行客户端导航

const Header = () => {
  // 定义状态来控制移动菜单的打开/关闭
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 切换移动菜单状态的函数
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 关闭移动菜单的函数（例如点击链接后）
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50"> {/* 添加背景、阴影、粘性定位 */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo 和标题 */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center" onClick={closeMobileMenu}> {/* 点击 Logo 关闭菜单 */}
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
            主页
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

        {/* 移动端菜单按钮 */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={toggleMobileMenu} // 点击时切换菜单状态
          >
            <span className="sr-only">打开主菜单</span>
            {/* Heroicon - bars-3 (汉堡图标) */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* 移动端菜单面板 - 根据 isMobileMenuOpen 状态条件渲染 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          {/* 背景遮罩 */}
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={closeMobileMenu} aria-hidden="true"></div>

          {/* 菜单面板 */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-white/10">
            {/* 面板头部：Logo 和关闭按钮 */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center" onClick={closeMobileMenu}>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                   游戏导航站
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                onClick={toggleMobileMenu} // 点击关闭按钮
              >
                <span className="sr-only">关闭菜单</span>
                {/* Heroicon - x-mark */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 菜单链接 */}
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/25">
                <div className="space-y-2 py-6">
                  <Link
                    href="/"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={closeMobileMenu} // 点击链接后关闭菜单
                  >
                    所有游戏
                  </Link>
                  <Link
                    href="/categories"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={closeMobileMenu}
                  >
                    分类
                  </Link>
                  <Link
                    href="/about"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={closeMobileMenu}
                  >
                    关于
                  </Link>
                </div>
                {/* 未来可以在这里添加登录链接等 */}
                {/* <div className="py-6">
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
                    登录
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
