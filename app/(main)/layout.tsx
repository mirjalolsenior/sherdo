import { Sidebar } from '@/components/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
