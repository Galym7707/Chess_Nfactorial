import { Surface } from "@/components/ui/surface";

export function MoveList({ moves }: { moves: string[] }) {
  return (
    <Surface className="max-h-[340px] overflow-hidden p-0">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-lg font-semibold">История ходов</h3>
      </div>
      {moves.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Партия еще не началась.</p>
      ) : (
        <ol className="max-h-[276px] space-y-1 overflow-auto p-3 text-sm">
          {moves.map((move, index) => (
            <li key={`${move}-${index}`} className="grid grid-cols-[48px_1fr] rounded-2xl px-3 py-2 hover:bg-muted/60">
              <span className="text-muted-foreground">{index + 1}.</span>
              <span className="font-medium">{move}</span>
            </li>
          ))}
        </ol>
      )}
    </Surface>
  );
}