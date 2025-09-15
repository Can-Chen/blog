/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#2563eb',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            h1: {
              color: '#111827',
              fontWeight: '800',
            },
            h2: {
              color: '#111827',
              fontWeight: '700',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
            },
            code: {
              color: '#e11d48',
              backgroundColor: '#f1f5f9',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '4px',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
            },
            blockquote: {
              borderLeftColor: '#e5e7eb',
              color: '#6b7280',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
