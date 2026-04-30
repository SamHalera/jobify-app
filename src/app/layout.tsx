import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Jobify — Ma recherche d'emploi",
  description: "Suivez et organisez votre recherche d'emploi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile top bar (hamburger + drawer) */}
        <MobileHeader />

        <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}
