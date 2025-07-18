import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            前端架构师
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">
              博客
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              关于
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 