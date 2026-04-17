import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeCreate Intelligence',
  description: 'AI経営ダッシュボード / 株式会社ライフクリエイト',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
