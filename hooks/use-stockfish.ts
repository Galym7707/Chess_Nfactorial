"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StockfishClient, type EngineAnalysis, type EngineLimit } from "@/lib/engine/stockfish";

export function useStockfish() {
  const clientRef = useRef<StockfishClient | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new StockfishClient();
    clientRef.current = client;
    client
      .init()
      .then(() => setReady(true))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Stockfish init failed"));
    return () => {
      client.dispose();
      clientRef.current = null;
    };
  }, []);

  const analyzeFen = useCallback(async (fen: string, limit?: EngineLimit): Promise<EngineAnalysis> => {
    if (!clientRef.current) throw new Error("Stockfish is not ready");
    return clientRef.current.analyzeFen(fen, limit);
  }, []);

  return { ready, error, analyzeFen };
}