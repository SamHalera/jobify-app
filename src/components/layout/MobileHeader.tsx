"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo, NavContent } from "./Sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Ouvrir le menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <MenuIcon className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent side="left" showCloseButton={false} className="w-64 p-0 flex flex-col bg-sidebar border-r border-sidebar-border">
          <div className="flex h-14 items-center border-b border-sidebar-border px-5">
            <Logo />
          </div>
          <NavContent onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <Logo />
    </header>
  );
}
