import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);
