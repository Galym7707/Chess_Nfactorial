"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/ui/surface";
import { useAuth } from "./auth-provider";

export function LoginForm() {
  const router = useRouter();
  const { signIn, signUp, startDemoSession, configured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const error = mode === "login" ? await signIn(email, password) : await signUp(email, password, displayName);
    setBusy(false);
    if (error) {
      setMessage(error);
      return;
    }
    router.push("/profile");
  }

  return (
    <Surface className="mx-auto w-full max-w-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-primary">Account</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Вход в Code Gambit</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Email/password auth через Supabase. Сессия восстанавливается автоматически после перезагрузки.
      </p>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold">
        <button className={`rounded-full px-4 py-2 ${mode === "login" ? "bg-card shadow-soft" : "text-muted-foreground"}`} onClick={() => setMode("login")} type="button">
          Вход
        </button>
        <button className={`rounded-full px-4 py-2 ${mode === "register" ? "bg-card shadow-soft" : "text-muted-foreground"}`} onClick={() => setMode("register")} type="button">
          Регистрация
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        {mode === "register" ? <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" /> : null}
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
        <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Пароль" type="password" required minLength={6} />
        {message ? <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p> : null}
        <Button className="w-full" disabled={busy} type="submit">
          {busy ? "Проверка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
        </Button>
      </form>
      {!configured ? (
        <div className="mt-6 rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          Supabase env vars не найдены. Для локального просмотра можно включить демо-сессию; в production добавьте переменные из `.env.example`.
          <Button className="mt-4 w-full" variant="secondary" onClick={() => { startDemoSession(); router.push("/profile"); }} type="button">
            Запустить демо-сессию
          </Button>
        </div>
      ) : null}
    </Surface>
  );
}