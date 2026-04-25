"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/play/local", label: "Играть" },
  { href: "/history", label: "История" },
  { href: "/leaderboard", label: "Лидерборд" },
  { href: "/pricing", label: "Прайсинг" },
  { href: "/profile", label: "Профиль" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Code <span className="text-primary">Gambit</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Переключить тему" type="button">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Link className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110" href="/pricing">
            Upgrade to Pro
          </Link>
          {user ? (
            <Button variant="secondary" size="sm" onClick={() => void signOut()} type="button">
              Выйти
            </Button>
          ) : (
            <Link className="rounded-full border border-border px-4 py-2 text-sm font-semibold" href="/login">
              Войти
            </Link>
          )}
        </div>
        <button className="rounded-full border border-border p-2 lg:hidden" onClick={() => setOpen((value) => !value)} type="button" aria-label="Открыть меню">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-background/95 px-4 py-4 lg:hidden">
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-muted">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Button variant="secondary" onClick={() => setTheme(isDark ? "light" : "dark")} type="button">
              {isDark ? "Светлая тема" : "Темная тема"}
            </Button>
            <Link onClick={() => setOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground" href="/pricing">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}