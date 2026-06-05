/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        theme: 'var(--theme-color)',
        bg: 'var(--bg-color)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  // O JSON do funil usa classes utilitárias dinâmicas (grid-cols-*, h-[..], gap-*, etc).
  // O safelist abaixo garante que as variações usadas pelo funil não sejam removidas no purge.
  safelist: [
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
    'mx-auto', 'mr-auto', 'ml-auto',
    'rounded-2xl', 'rounded-xl', 'rounded-lg', 'rounded-full', 'rounded-none',
    'shadow-md', 'shadow-lg', 'hover:shadow-lg',
    'gap-1', 'gap-2', 'gap-3', 'gap-4',
  ],
  plugins: [],
}
