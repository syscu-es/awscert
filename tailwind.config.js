/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        'brand-orange': '#f97316',
        'aws-squid': '#232F3E',
        'aws-orange': '#FF9900',
        'aws-orange-2': '#FF6B2C',
        'aws-blue': '#146EB4',
        'aws-cyan': '#00C9DB',
        'aws-violet': '#B388FF',
      }
    },
  },
  plugins: [],
}
