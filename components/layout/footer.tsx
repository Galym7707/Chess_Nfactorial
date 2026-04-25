import Link from "next/link";

const links = [
  ["Sandbox", "/play/sandbox"],
  ["Local Duel", "/play/local"],
  ["AI Arena", "/play/ai"],
  ["Play with Friend", "/play/friend"],
  ["Leaderboard", "/leaderboard"],
  ["Pricing", "/pricing"],
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_1.2fr] md:px-6">
        <div>
          <p className="font-display text-2xl font-semibold">Code <span className="text-primary">Gambit</span></p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Шахматы для разработчиков и студентов: правила, AI Coach в стиле code review, realtime-комнаты и growth-oriented профиль.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-2xl px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}