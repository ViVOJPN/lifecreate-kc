import type { Config } from 'tailwindcss';

/**
 * ブランドカラー: lifecreate-kc.co.jp のコーポレートサイトCSSから抽出
 * - primary: #EB031C (コーポレートレッド)
 * - accent:  #FF6F7A (ホバー/ハイライト用コーラル)
 * - text:    #333333 / muted: #656565
 * - surface: #F5F5F5 / border: #E3E3E3
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
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
        neutral: {
          50: '#F5F5F5',
          100: '#F1F1F1',
          200: '#EAEAEA',
          300: '#E3E3E3',
          400: '#BABABA',
          500: '#ABABAB',
          600: '#656565',
          700: '#4D4D4D',
          800: '#333333',
          900: '#000000',
        },
        // セマンティックエイリアス
        primary: {
          DEFAULT: '#EB031C',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#FF6F7A',
          foreground: '#FFFFFF',
        },
        surface: '#F5F5F5',
        border: '#E3E3E3',
        foreground: '#333333',
        muted: {
          DEFAULT: '#F1F1F1',
          foreground: '#656565',
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          '"Yu Gothic"',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
