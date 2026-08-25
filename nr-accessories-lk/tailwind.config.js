export default {
  content: ['./**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        ink: {
          DEFAULT: '#0f172a',
          soft: '#475569',
          faint: '#94a3b8',
        },
        line: {
          DEFAULT: '#e2e8f0',
          strong: '#cbd5e1',
        },
        canvas: '#f8fafc',
        sale: '#f59e0b',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -16px rgba(15, 23, 42, 0.18)',
        lift: '0 2px 6px rgba(15, 23, 42, 0.06), 0 18px 40px -24px rgba(15, 23, 42, 0.28)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
}
