'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: React.ReactNode;
  time: string;
  reference?: string;
  suggestions?: string[];
};

const initialMessages: Message[] = [
  {
    id: 'm1',
    role: 'ai',
    time: '07:42',
    content: (
      <>
        おはようございます。本日の3件のうち、
        <strong className="text-foreground">会員化率ゼロ化</strong>
        について、もう少し掘り下げますか？
      </>
    ),
  },
  {
    id: 'm2',
    role: 'user',
    time: '07:43',
    content: '会員化率がゼロになったのはいつから？他店でも起きている？',
  },
  {
    id: 'm3',
    role: 'ai',
    time: '07:43',
    reference: '参照: 取引明細 2024 / 20,724行',
    content: (
      <>
        福岡インター店では<strong className="text-foreground">2024年4月</strong>
        から会員紐付けが断絶しています。
        <br />
        <br />
        3月までの月次紐付け率は
        <Num>9.3〜14.3%</Num>で安定、4月に<Num>0.1%</Num>、5月以降ほぼ
        <Num>0%</Num>が継続。
        <MiniViz />
        他5店舗にも同じクエリを走らせましょうか？
      </>
    ),
    suggestions: [
      'はい、他店にも同じ分析を',
      '原因の仮説を3つ挙げて',
      '店長ヒアリング質問を草案',
    ],
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        reference: '参照: 全店舗 取引明細 / 2024年 / 347,182行',
        content: (
          <>
            承知しました。他5店舗の会員紐付けデータを並列で分析中です…{' '}
            <span className="text-subtle">(2.3秒)</span>
          </>
        ),
        suggestions: ['さらに深掘り', 'レポート化', '経営会議の議題に追加'],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:px-5 md:py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft font-serif text-[16px] italic text-accent">
          L
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-[14px] text-foreground md:text-[15px]">
            LifeCreate AI
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-subtle">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive">
              <span className="absolute inset-0 rounded-full bg-positive animate-pulse-dot" />
            </span>
            <span className="truncate">Claude Opus 4.7 · 全データ接続</span>
          </div>
        </div>
        <div className="hidden shrink-0 font-mono text-[10px] uppercase tracking-widest text-subtle sm:block">
          Session #042
        </div>
      </div>

      <div
        ref={bodyRef}
        className="flex min-h-[60vh] flex-col gap-4 overflow-y-auto px-4 py-4 md:min-h-[520px] md:px-5 md:py-5"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} onChipClick={send} />
        ))}
        {typing ? <TypingIndicator /> : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-line bg-canvas px-4 py-3 md:px-5 md:py-4"
      >
        <div className="flex items-center gap-2.5 rounded border border-line bg-surface px-3 py-2.5 focus-within:border-accent/60 md:gap-3 md:px-4 md:py-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5 shrink-0 text-subtle"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AIに質問する — 自然言語で何でも"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-subtle"
          />
          <button
            type="submit"
            aria-label="送信"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 scrollbar-hide">
          {[
            '前月比で最も粗利を落としたカテゴリは？',
            '福岡インター店の在庫180日超を一覧化',
            'FC島根出雲店の立ち上げ期の類似事例を3件',
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="shrink-0 rounded border border-line bg-surface px-3 py-1 font-mono text-[10px] text-muted hover:border-accent/40 hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

function MessageBubble({
  msg,
  onChipClick,
}: {
  msg: Message;
  onChipClick: (q: string) => void;
}) {
  const isMe = msg.role === 'user';
  return (
    <div
      className={cn(
        'flex max-w-[88%] flex-col gap-1.5 animate-fade-up md:max-w-[78%]',
        isMe ? 'ml-auto items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-3 text-[13px] leading-relaxed',
          isMe
            ? 'bg-accent text-accent-foreground'
            : 'border border-line bg-elevated text-foreground',
        )}
      >
        {msg.content}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] text-subtle">
        <span>{msg.time}</span>
        {msg.reference ? <span>· {msg.reference}</span> : null}
      </div>
      {msg.suggestions ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {msg.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onChipClick(s)}
              className="rounded-full border border-line bg-elevated px-3 py-1 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex max-w-[78%] items-center gap-2 rounded-lg border border-line bg-elevated px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-subtle"
          style={{
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 rounded bg-canvas px-1 font-mono text-[12px] text-accent-strong">
      {children}
    </span>
  );
}

function MiniViz() {
  const bars = [60, 58, 62, 3, 5, 1, 1, 1, 1, 1, 1, 1];
  return (
    <div className="my-3 rounded border border-line bg-canvas p-3">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-subtle">
        月次 会員紐付け率 / 福岡インター店
      </div>
      <div className="flex h-20 items-end gap-[3px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-t-sm',
              h < 10 ? 'bg-accent' : 'bg-positive/70',
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-subtle">
        <span>1月</span>
        <span>3月</span>
        <span className="text-accent">4月↓</span>
        <span>6月</span>
        <span>9月</span>
        <span>12月</span>
      </div>
    </div>
  );
}
