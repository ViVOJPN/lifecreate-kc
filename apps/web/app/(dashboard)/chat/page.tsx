import { Topbar } from '@/components/topbar';
import { ChatPanel } from './chat-panel';

/**
 * Phase 2a: 対話分析 (Conversational Agent)
 * 設計書 §3.3 参照。自然言語クエリ → ツール呼び出し (BigQuery SQL / 異常検知 / 相場) で応答。
 */
export default function ChatPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'Intelligence' }, { label: '対話分析' }]}
        actions={
          <>
            <button className="btn">新しいセッション</button>
            <button className="btn">履歴</button>
            <button className="btn btn-primary">共有</button>
          </>
        }
      />
      <div className="px-8 py-10">
        <header className="mb-8">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-mute">
            <span className="relative h-1.5 w-1.5 rounded-full bg-positive">
              <span className="absolute inset-0 rounded-full bg-positive animate-pulse-dot" />
            </span>
            全データ接続中 · 4事業横断
          </div>
          <h1 className="font-serif text-[40px] font-medium leading-tight tracking-tight text-foreground">
            <em className="not-italic italic text-accent">自然言語</em>で、すべての数字に問いかける。
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-dim">
            POS・TKC会計・Google広告・Google Business・相場メタAPIを横断で照会。
            クエリごとに参照データの行数・期間を明示し、次の深掘り候補を3件提示します。
          </p>
        </header>

        <ChatPanel />
      </div>
    </>
  );
}
