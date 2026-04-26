"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Users } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { createFriendRoom } from "@/lib/multiplayer/rooms";

function CreateFriendRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRoom() {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const room = await createFriendRoom(user.id);
      router.push(`/play/friend/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать комнату");
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-[78svh] max-w-7xl items-center gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Badge><Users className="size-3" /> Игра по ссылке</Badge>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">Игра с другом по одной ссылке</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Создайте комнату, отправьте ссылку другу и играйте на одной позиции. Статус второго игрока виден сразу, а партия восстанавливается после переподключения.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={createRoom} disabled={busy} type="button"><Link2 className="size-5" /> {busy ? "Создаю..." : "Создать комнату"}</Button>
        </div>
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>
      <Surface className="overflow-hidden">
        <div className="rounded-[1.6rem] bg-brand-radial p-6 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Перед партией</p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-white/60">Белые</p>
              <p className="mt-1 font-display text-2xl">Хозяин</p>
            </div>
            <div className="rounded-3xl border border-dashed border-white/30 p-4">
              <p className="text-sm text-white/60">Черные</p>
              <p className="mt-1 font-display text-2xl">Ожидание</p>
            </div>
          </div>
          <div className="mt-20 rounded-full bg-white/10 px-4 py-3 text-sm">Комната проверяет порядок ходов и не принимает запоздавшие действия.</div>
        </div>
      </Surface>
    </section>
  );
}

export default function PlayFriendPage() {
  return (
    <AuthGate>
      <CreateFriendRoom />
    </AuthGate>
  );
}
