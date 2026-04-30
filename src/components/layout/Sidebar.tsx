"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  BuildingIcon,
  FileTextIcon,
  BarChartIcon,
  SparklesIcon,
} from "lucide-react";

export const navItems = [
  { href: "/applications", label: "Candidatures", icon: BriefcaseIcon },
  { href: "/companies", label: "Entreprises", icon: BuildingIcon },
  { href: "/documents", label: "Documents", icon: FileTextIcon },
  { href: "/stats", label: "Statistiques", icon: BarChartIcon },
];

export function NavContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavClick}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-linear-to-r from-sidebar-primary/25 to-sidebar-primary/5 text-sidebar-primary"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 inset-y-1.5 w-0.5 rounded-full bg-[#2E9CCA]" />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2E9CCA]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary/20">
            <SparklesIcon className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/80">Bonne chance !</p>
            <p className="text-[10px] text-sidebar-foreground/40">dans ta recherche</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#2E9CCA] to-[#25274D] shadow-sm shadow-[#2E9CCA]/30">
        <BriefcaseIcon className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-sidebar-foreground">Jobify</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo />
      </div>
      <NavContent />
    </aside>
  );
}
