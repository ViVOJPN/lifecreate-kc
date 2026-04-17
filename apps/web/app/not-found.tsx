import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative z-[2] flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle">
        404 · Not Found
      </div>
      <h1 className="font-serif text-[40px] font-medium leading-tight tracking-tight text-foreground md:text-[56px]">
        そのページは<em className="not-italic italic text-accent">まだ</em>ありません。
      </h1>
      <p className="max-w-md text-[13px] leading-relaxed text-muted md:text-[14px]">
        実装ロードマップの Phase 次第でこれから追加されるか、URL が変わった可能性があります。
        Intelligence ホームへ戻って、AI に経路を尋ねてください。
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/briefing" className="btn btn-primary">
          朝の3つの示唆へ
        </Link>
        <Link href="/chat" className="btn">
          AIに質問する
        </Link>
      </div>
    </div>
  );
}
