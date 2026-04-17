import type { Config } from 'tailwindcss';

/**
 * LifeCreate Intelligence - Design Tokens
 * ダーク基調 × コーポレートレッド (#EB031C)
 *
 * トークン命名規則:
 *  - canvas / elevated / surface は背景の階層 (bg-canvas / bg-elevated / bg-surface)
 *  - line は区切り線色 (border-line)
 *  - foreground / muted / subtle はテキスト階層
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0A0A',
        elevated: '#121212',
        surface: {
          DEFAULT: '#1A1A1A',
          hover: '#232323',
        },
        line: {
          DEFAULT: '#2A2A2A',
          strong: '#3A3A3A',
        },
        foreground: '#F5F5F5',
        muted: '#A0A0A0',
        subtle: '#6A6A6A',
        brand: {
          50: '#FFE5E8',
          100: '#FFC2C8',
          200: '#FF8A95',
          300: '#FF6F7A',
          400: '#F43A4A',
          500: '#EB031C',
          600: '#C60218',
          700: '#9E0213',
          800: '#77010E',
          900: '#4F0109',
          DEFAULT: '#EB031C',
        },
        accent: {
          DEFAULT: '#EB031C',
          strong: '#FF2D44',
          soft: 'rgba(235, 3, 28, 0.12)',
          foreground: '#FFFFFF',
        },
        critical: {
          DEFAULT: '#EB031C',
          soft: 'rgba(235, 3, 28, 0.10)',
        },
        warning: {
          DEFAULT: '#D4A34B',
          soft: 'rgba(212, 163, 75, 0.10)',
        },
        positive: {
          DEFAULT: '#88A569',
          soft: 'rgba(136, 165, 105, 0.10)',
        },
        info: '#6B8CB0',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: [
          'var(--font-zen-kaku)',
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '1.3'],
      },
      borderRadius: {
        lg: '10px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        glow: '0 0 14px rgba(235, 3, 28, 0.45)',
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 4px 20px rgba(0,0,0,0.4)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.92)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse 2.4s ease-in-out infinite',
        scan: 'scan 2.2s linear infinite',
        'fade-up': 'fadeUp 0.28s ease-out both',
        'slide-in': 'slideIn 0.22s ease-out',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
