/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: { dark: '#0D2137', DEFAULT: '#1A3D5E', mid: '#2D5A8A', light: '#3A7BC8' },
        emerald: { DEFAULT: '#27AE60', light: '#34D278', pale: '#E8F8EF' },
        slate: '#7A8FA3',
        surface: '#F5F7FA',
        border: '#E8ECF0',
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '20px',
      },
      typography: () => ({
        neutral: {
          css: {
            "--tw-prose-body": "var(--color-txt-secondary)",
            "--tw-prose-headings": "var(--color-txt-primary)",
            "--tw-prose-lead": "var(--color-txt-secondary)",
            "--tw-prose-links": "var(--color-txt-secondary)",
            "--tw-prose-bold": "var(--color-txt-secondary)",
            "--tw-prose-counters": "var(--color-txt-secondary)",
            "--tw-prose-bullets": "var(--color-txt-secondary)",
            "--tw-prose-hr": "var(--color-txt-secondary)",
            "--tw-prose-quotes": "var(--color-txt-secondary)",
            "--tw-prose-quote-borders": "var(--color-txt-primary)",
            "--tw-prose-captions": "var(--color-txt-secondary)",
            "--tw-prose-code": "var(--color-txt-primary)",
            "--tw-prose-pre-code": "var(--color-txt-primary)",
            "--tw-prose-pre-bg": "transparent",
            "--tw-prose-th-borders": "var(--color-txt-secondary)",
            "--tw-prose-td-borders": "var(--color-txt-secondary)",
          },
        },
      }),
    },
  },
};
