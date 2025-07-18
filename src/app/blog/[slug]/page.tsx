import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客列表
        </Link>
        
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            <time className="text-sm text-gray-500" dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
            </time>
            <span className="text-sm text-gray-500">{post.readingTime}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{post.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        </header>
      </div>

      <article className="prose prose-lg max-w-none">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
} 