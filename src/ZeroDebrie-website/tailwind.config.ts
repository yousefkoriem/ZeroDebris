import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        brand: 'rgb(var(--cyan-500) / <alpha-value>)',
        cyan: {
          500: 'rgb(var(--cyan-500) / <alpha-value>)',
        },
        amber: {
          500: 'rgb(var(--amber-500) / <alpha-value>)',
        },
        danger: {
          500: 'rgb(var(--danger-500) / <alpha-value>)',
        },
        success: {
          500: 'rgb(var(--success-500) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
export default config
