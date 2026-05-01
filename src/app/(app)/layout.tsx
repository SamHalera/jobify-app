import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <MobileHeader />
      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
        {children}
      </main>
    </>
  );
}
