import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'Monaco', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            lineHeight: '1.75',
            h1: { fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem' },
            h2: { fontSize: '1.875rem', fontWeight: '600', marginBottom: '0.875rem' },
            h3: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' },
            code: {
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config

export default config 