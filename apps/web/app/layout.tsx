import type { Metadata } from 'next';
import { Fraunces, Zen_Kaku_Gothic_New, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-zen-kaku',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LifeCreate Intelligence / AI 経営ダッシュボード',
  description:
    '株式会社ライフクリエイトの AI Command Center。朝の3つの示唆、対話分析、値下げタイミング最適化。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${fraunces.variable} ${zenKaku.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
