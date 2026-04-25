"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";

export function AuthGate({ children, allowDemo = true }: { children: React.ReactNode; allowDemo?: boolean }) {
  const { user, loading, startDemoSession, configured } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-[1fr_340px]">
        <Skeleton className="h-[520px]" />
        <Skeleton className="h-[520px]" />
      </div>
    );
  }

  if (user) return <>{children}</>;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-3xl items-center px-4 py-12">
      <Surface className="w-full text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <LockKeyhole className="size-7" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold md:text-5xl">Нужен аккаунт Code Gambit</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          Этот режим сохраняет прогресс, партии, review и профиль. Войдите через Supabase Auth или запустите локальную демо-сессию, если секреты еще не настроены.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow" href="/login">
            Войти
          </Link>
          {allowDemo ? (
            <Button variant="secondary" onClick={startDemoSession} type="button">
              Демо-сессия
            </Button>
          ) : null}
        </div>
        {!configured ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Supabase env vars не заданы. Это контролируемый fallback для локального демо, не замена production auth.
          </p>
        ) : null}
      </Surface>
    </section>
  );
}