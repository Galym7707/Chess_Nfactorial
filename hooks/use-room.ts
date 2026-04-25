"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { applyRoomMove, fetchRoom, joinRoom, roomClient } from "@/lib/multiplayer/rooms";
import type { RoomState } from "@/types/app";

type PlayerColor = "white" | "black" | "spectator";

export function useRoom(roomId: string, userId: string | null) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [color, setColor] = useState<PlayerColor>("spectator");
  const [online, setOnline] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const joined = await joinRoom(roomId, userId);
      setRoom(joined.room);
      setColor(joined.color as PlayerColor);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Room load failed");
    } finally {
      setLoading(false);
    }
  }, [roomId, userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!userId) return;
    const client = roomClient();
    if (!client) {
      setOnline(room?.black_player_id ? 2 : 1);
      return;
    }

    const channel = client
      .channel(`room:${roomId}`, { config: { broadcast: { ack: true }, presence: { key: userId } } })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, (payload) => {
        setRoom(payload.new as RoomState);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length);
      })
      .on("broadcast", { event: "move" }, () => {
        void fetchRoom(roomId).then((latest) => {
          if (latest) setRoom(latest);
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void channel.track({ user_id: userId, online_at: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      channelRef.current = null;
      void client.removeChannel(channel);
    };
  }, [room?.black_player_id, roomId, userId]);

  const makeMove = useCallback(async (from: string, to: string, promotion?: "q" | "r" | "b" | "n") => {
    if (!room || !userId) return false;
    try {
      const next = await applyRoomMove({ room, userId, color, from, to, promotion });
      setRoom(next);
      await channelRef.current?.send({ type: "broadcast", event: "move", payload: { version: next.version } });
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed");
      const latest = await fetchRoom(roomId);
      if (latest) setRoom(latest);
      return false;
    }
  }, [color, room, roomId, userId]);

  return useMemo(() => ({ room, color, online, loading, error, reload, makeMove }), [color, error, loading, makeMove, online, reload, room]);
}