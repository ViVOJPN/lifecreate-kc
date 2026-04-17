import { Topbar } from '@/components/topbar';
import { ChatPanel } from './chat-panel';

export default function ChatPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'Intelligence' }, { label: '対話分析' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">新セッション</button>
            <button className="btn hidden md:inline-flex">履歴</button>
            <button className="btn btn-primary">共有</button>
          </>
        }
      />
      <div className="page">
        <header className="mb-6 md:mb-8">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-subtle">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive">
              <span className="absolute inset-0 rounded-full bg-positive animate-pulse-dot" />
            </span>
            全データ接続中 · 4事業横断
          </div>
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
            <em className="not-italic italic text-accent">自然言語</em>で、すべての数字に問いかける。
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-muted md:text-[14px]">
            POS・TKC会計・Google広告・Google Business・相場メタAPIを横断で照会。
            クエリごとに参照データの行数・期間を明示し、次の深掘り候補を3件提示します。
          </p>
        </header>

        <ChatPanel />
      </div>
    </>
  );
}
