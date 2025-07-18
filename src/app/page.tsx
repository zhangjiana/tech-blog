import { getAllPosts, getFeaturedPosts, getAllCategories } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();
  const recentPosts = allPosts.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            羽灵的技术分享 专注技术分享
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            基于9年大型ToB项目经验，深度分享前端架构设计、工程实践与技术洞察
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">精选文章</h2>
            <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              查看全部 <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.slice(0, 2).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">技术分类</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <span className="text-xs text-blue-600">{category.count} 篇文章</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">最新文章</h2>
          <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            查看全部 <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">关于我</h2>
          <p className="text-gray-600 mb-6">
            我是一名拥有9年经验的前端架构师，专注于大型ToB项目的前端架构设计与落地。
            从早期的jQuery到现代的React/Vue生态，从单体应用到微前端架构，
            我见证并参与了前端技术的发展历程。
          </p>
          <p className="text-gray-600 mb-6">
            在这里，我将分享真实的项目经验、技术决策思考以及对前端发展趋势的判断。
            希望能为同样走在前端架构道路上的朋友们提供一些参考和启发。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            了解更多 <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
