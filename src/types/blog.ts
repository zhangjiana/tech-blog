export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  featured?: boolean;
  content: string;
  readingTime: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface BlogMetadata {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  featured?: boolean;
} 