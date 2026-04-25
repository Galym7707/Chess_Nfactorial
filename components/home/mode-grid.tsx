"use client";

import { Bot, FlaskConical, Swords, Users } from "lucide-react";
import { ModeCard } from "./mode-card";

const modes = [
  { level: "РЎР»Р°Р±С‹Р№", title: "Sandbox", href: "/play/sandbox", icon: FlaskConical, description: "Р”РѕСЃРєР° Р±РµР· РїСЂР°РІРёР»: СЃРІРѕР±РѕРґРЅРѕРµ РїРµСЂРµС‚Р°СЃРєРёРІР°РЅРёРµ С„РёРіСѓСЂ Рё С‡РµСЃС‚РЅС‹Р№ Р±РµР№РґР¶ Rules Off." },
  { level: "РЎСЂРµРґРЅРёР№", title: "Local Duel", href: "/play/local", icon: Swords, description: "РџРѕР»РЅР°СЏ chess.js РїР°СЂС‚РёСЏ РЅР° РѕРґРЅРѕРј СЌРєСЂР°РЅРµ: СЂРѕРєРёСЂРѕРІРєР°, en passant, promotion, РјР°С‚, РїР°С‚, PGN/FEN." },
  { level: "РЎРёР»СЊРЅС‹Р№", title: "AI Arena", href: "/play/ai", icon: Bot, description: "Stockfish РІ Web Worker, СѓСЂРѕРІРЅРё СЃР»РѕР¶РЅРѕСЃС‚Рё, РёСЃС‚РѕСЂРёСЏ Р°РєРєР°СѓРЅС‚Р° Рё post-game review." },
  { level: "Р’РµР»РёРєРёР№", title: "Play with Friend", href: "/play/friend", icon: Users, description: "РљРѕРјРЅР°С‚С‹ РїРѕ СЃСЃС‹Р»РєРµ, Supabase Realtime, Presence Рё Р·Р°С‰РёС‚Р° СЃРѕСЃС‚РѕСЏРЅРёСЏ С‡РµСЂРµР· version." },
];

export function ModeGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Levels</p>
        <h2 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Р’СЃРµ СѓСЂРѕРІРЅРё Р·Р°РґР°РЅРёСЏ вЂ” РІ РѕРґРЅРѕРј РїСЂРѕРґСѓРєС‚Рµ</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
          Р­С‚Рѕ РЅРµ РЅР°Р±РѕСЂ РґРµРјРѕ-СЃС‚СЂР°РЅРёС†. Р РµР¶РёРјС‹ РёСЃРїРѕР»СЊР·СѓСЋС‚ РѕР±С‰СѓСЋ РЅР°РІРёРіР°С†РёСЋ, Р±СЂРµРЅРґРёРЅРі, auth, РёСЃС‚РѕСЂРёСЋ, С‚РµРјС‹ РґРѕСЃРєРё Рё РїСЂРѕРґСѓРєС‚РѕРІСѓСЋ РјРѕРґРµР»СЊ Pro.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modes.map((mode) => <ModeCard key={mode.href} {...mode} />)}
      </div>
    </section>
  );
}