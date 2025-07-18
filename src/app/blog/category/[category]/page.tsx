import { getPostsByCategory, getAllCategories } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // 解码URL参数（处理中文分类）
  const decodedCategory = decodeURIComponent(category);
  
  // 获取分类信息
  const categories = getAllCategories();
  const categoryInfo = categories.find(cat => 
    cat.slug === category || cat.name === decodedCategory
  );

  if (!categoryInfo) {
    notFound();
  }

  // 使用实际的分类名称获取文章
  const posts = getPostsByCategory(categoryInfo.name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客列表
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {categoryInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {categoryInfo.description}
          </p>
          <div className="text-sm text-gray-500">
            共 {posts.length} 篇文章
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">所有分类</h3>
            <nav className="space-y-2">
              <Link
                href="/blog"
                className="block py-2 px-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
              >
                全部文章
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className={`block py-2 px-3 rounded-md transition-colors ${
                    cat.slug === category
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {cat.name} ({cat.count})
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无 {categoryInfo.name} 分类的文章
              </h3>
              <p className="text-gray-500 mb-4">
                该分类下还没有发布任何文章
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                浏览所有文章
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 