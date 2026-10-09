/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Monochromatic slate-blue palette (hue 220°) ── */
        mono: {
          50:  'hsl(220, 30%, 98%)',
          100: 'hsl(220, 25%, 95%)',
          150: 'hsl(220, 24%, 92%)',
          200: 'hsl(220, 22%, 87%)',
          300: 'hsl(220, 20%, 75%)',
          400: 'hsl(220, 18%, 58%)',
          500: 'hsl(220, 22%, 42%)',
          600: 'hsl(220, 32%, 32%)',
          700: 'hsl(220, 36%, 22%)',
          800: 'hsl(220, 40%, 14%)',
          900: 'hsl(220, 44%, 9%)',
        },
        /* CSS-var aliases for runtime theming */
        aqi: {
          bg:            'var(--bg-primary)',
          surface:       'var(--bg-secondary)',
          text:          'var(--text-primary)',
          muted:         'var(--text-muted)',
          brand:         'var(--brand)',
          'brand-hover': 'var(--brand-hover)',
          'brand-light': 'var(--brand-light)',
          'brand-subtle':'var(--brand-subtle)',
          border:        'var(--border-color)',
          /* Semantic aliases (all still slate-blue tones) */
          accent:        'hsl(220, 55%, 52%)',
          warning:       'hsl(220, 25%, 50%)',   /* desaturated for monochromatic feel */
          critical:      'hsl(220, 18%, 40%)',
          success:       'hsl(220, 40%, 38%)',
          /* Dark-mode surface shorthands */
          'dark-bg':      'hsl(220, 22%, 10%)',
          'dark-surface': 'hsl(220, 20%, 14%)',
          'dark-border':  'hsl(220, 18%, 24%)',
          'dark-text':    'hsl(220, 55%, 84%)',
          'dark-muted':   'hsl(220, 25%, 44%)',
          'dark-brand-light': 'hsl(220, 28%, 18%)',
        }
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'glass-glow': '0 0 25px rgba(56, 189, 248, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

