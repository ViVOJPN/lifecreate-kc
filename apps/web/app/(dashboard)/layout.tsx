import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] flex min-h-screen flex-col lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
