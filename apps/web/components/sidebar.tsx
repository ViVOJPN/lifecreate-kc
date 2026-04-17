'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: { text: string; tone?: 'default' | 'accent' };
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: 'Intelligence',
    items: [
      {
        label: '朝の3つの示唆',
        href: '/briefing',
        badge: { text: '3' },
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l2-2 4 4L19 4l2 2-11 11-6-6z" />
          </svg>
        ),
      },
      {
        label: '対話分析',
        href: '/chat',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        label: '店舗マップ',
        href: '/stores',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 2a8 8 0 00-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 00-8-8z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: '事業セグメント',
    items: [
      {
        label: 'ハンズクラフト',
        href: '/hands-craft',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 7l-5 5 5 5M4 20h16" />
          </svg>
        ),
      },
      {
        label: 'エコプラス',
        href: '/eco-plus',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-2a6 6 0 0112 0v2" />
          </svg>
        ),
      },
      {
        label: 'ライフサポート',
        href: '/life-support',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
        ),
      },
      {
        label: 'FC管理',
        href: '/fc',
        badge: { text: 'NEW', tone: 'accent' },
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'AIエージェント',
    items: [
      {
        label: '査定アシスタント',
        href: '/appraisal',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      },
      {
        label: '値下げタイミング',
        href: '/pricing',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        ),
      },
      {
        label: '広告ROI',
        href: '/ads',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3v18h18" />
            <path d="M7 14l3-3 4 4 5-6" />
          </svg>
        ),
      },
      {
        label: '需要予測',
        href: '/forecast',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
          </svg>
        ),
      },
      {
        label: '顧客LTV予測',
        href: '/ltv',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
          </svg>
        ),
      },
      {
        label: '競合分析',
        href: '/competitor',
        badge: { text: 'NEW', tone: 'accent' },
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
  {
    label: '設定',
    items: [
      {
        label: 'データソース',
        href: '/settings/sources',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1" />
          </svg>
        ),
      },
    ],
  },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-5 border-b border-line px-6 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_14px_rgba(235,3,28,0.8)]">
            <span className="absolute inset-0 rounded-full bg-accent animate-pulse-dot" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-serif text-[15px] tracking-tight text-foreground">
              LifeCreate{' '}
              <em className="not-italic font-serif italic text-accent">Intelligence</em>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-subtle">
              AI Command Center
            </div>
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <nav key={section.label} className="mb-5 px-3">
          <div className="mb-1.5 px-3 font-mono text-[9px] uppercase tracking-widest text-subtle">
            {section.label}
          </div>
          {section.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  'group flex items-center gap-2.5 rounded px-3 py-2.5 text-[13px] transition-colors',
                  active
                    ? 'bg-accent-soft text-foreground'
                    : 'text-muted hover:bg-surface-hover hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 shrink-0',
                    active ? 'text-accent' : 'text-subtle group-hover:text-muted',
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      'shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold',
                      item.badge.tone === 'accent'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-surface-hover text-muted',
                    )}
                  >
                    {item.badge.text}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      ))}
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Route change → auto close drawer
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Mobile topbar (hamburger) */}
      <div className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur lg:hidden">
        <button
          aria-label="メニューを開く"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded border border-line text-muted hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(235,3,28,0.9)]">
            <span className="absolute inset-0 rounded-full bg-accent animate-pulse-dot" />
          </span>
          <span className="font-serif text-[13px] text-foreground">
            LifeCreate{' '}
            <em className="not-italic italic text-accent">Intelligence</em>
          </span>
        </div>
        <div className="w-9" aria-hidden />
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 overflow-y-auto border-r border-line bg-canvas py-7 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="relative h-full w-[260px] max-w-[85vw] overflow-y-auto border-r border-line bg-canvas py-7 animate-slide-in">
            <button
              aria-label="閉じる"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded text-muted hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent onLinkClick={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
