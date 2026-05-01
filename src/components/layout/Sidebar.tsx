"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  BuildingIcon,
  FileTextIcon,
  BarChartIcon,
  LogOutIcon,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export const navItems = [
  { href: "/applications", label: "Candidatures", icon: BriefcaseIcon },
  { href: "/companies", label: "Entreprises", icon: BuildingIcon },
  { href: "/documents", label: "Documents", icon: FileTextIcon },
  { href: "/stats", label: "Statistiques", icon: BarChartIcon },
];

export function NavContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

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
                    <span className="absolute left-0 inset-y-1.5 w-0.5 rounded-full bg-[#4361EE]" />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#4361EE]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3 space-y-2">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#4361EE]/30 to-[#3A0CA3]/30 shrink-0">
            <span className="text-xs font-semibold text-sidebar-primary">
              {session?.user.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground/90 truncate">
              {session?.user.name ?? "—"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 truncate">
              {session?.user.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
        >
          <LogOutIcon className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
          Se déconnecter
        </button>
      </div>
    </>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#F72585] to-[#7209B7] shadow-sm shadow-[#F72585]/30">
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
