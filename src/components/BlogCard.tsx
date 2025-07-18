import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {post.category}
          </span>
          <time className="text-sm text-gray-500" dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}
          </time>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
} 