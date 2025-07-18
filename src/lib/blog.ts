import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost, BlogMetadata, BlogCategory } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 生成友好的URL slug
function generateSlug(name: string): string {
  // 对于纯英文，转换为小写并替换空格为连字符
  if (/^[a-zA-Z\s]+$/.test(name)) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
  // 对于包含中文的，直接使用原名称（URL会自动编码）
  return name;
}

export function getAllPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const stats = readingTime(content);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        category: data.category,
        tags: data.tags || [],
        featured: data.featured || false,
        content,
        readingTime: stats.text,
      };
    });

  return posts.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    let fileContents: string;
    
    try {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } catch {
      // 尝试 .mdx 扩展名
      const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
      fileContents = fs.readFileSync(mdxPath, 'utf8');
    }

    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      category: data.category,
      tags: data.tags || [],
      featured: data.featured || false,
      content,
      readingTime: stats.text,
    };
  } catch {
    return null;
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.featured);
}

export function getAllCategories(): BlogCategory[] {
  const allPosts = getAllPosts();
  const categoryMap = new Map<string, number>();
  
  allPosts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });
  
  const categories: BlogCategory[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: generateSlug(name),
    description: `${name}相关的技术文章`,
    count,
  }));
  
  return categories.sort((a, b) => b.count - a.count);
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagSet = new Set<string>();
  
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
} 