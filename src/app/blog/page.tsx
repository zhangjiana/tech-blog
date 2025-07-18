import { getAllPosts, getAllCategories } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';

export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">技术博客</h1>
        <p className="text-lg text-gray-600">
          深度分享前端架构设计经验与工程实践
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">分类导航</h3>
            <nav className="space-y-2">
              <Link
                href="/blog"
                className="block py-2 px-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
              >
                全部文章 ({allPosts.length})
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="grid gap-6">
            {allPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          
          {allPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无博客文章</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 