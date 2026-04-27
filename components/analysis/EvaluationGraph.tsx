"use client";

import { Surface } from "@/components/ui/surface";
import type { AnalyzedMove } from "@/lib/coach/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

type EvaluationGraphProps = {
  moves: AnalyzedMove[];
  selectedMoveIndex: number | null;
  onMoveSelect: (index: number) => void;
};

export function EvaluationGraph({ moves, selectedMoveIndex, onMoveSelect }: EvaluationGraphProps) {
  // Подготавливаем данные для графика
  const data = moves.map((move, index) => ({
    moveNumber: `${move.moveNumber}${move.color === "white" ? "." : "..."}`,
    evaluation: Math.max(-10, Math.min(10, move.scoreAfter / 100)), // Ограничиваем от -10 до +10
    index,
    isBlunder: move.classification === "blunder",
    isBrilliant: move.classification === "brilliant",
  }));

  return (
    <Surface>
      <h3 className="mb-4 font-display text-xl font-semibold">График оценки</h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload[0]) {
                const index = e.activePayload[0].payload.index;
                onMoveSelect(index);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="moveNumber"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              domain={[-10, 10]}
              ticks={[-10, -5, 0, 5, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value > 0 ? "+" : ""}${value.toFixed(2)}`, "Оценка"]}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="evaluation"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isBrilliant) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="rgb(34, 211, 238)"
                      stroke="rgb(34, 211, 238)"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  );
                }
                if (payload.isBlunder) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="rgb(220, 38, 38)"
                      stroke="rgb(220, 38, 38)"
                      strokeWidth={2}
                    />
                  );
                }
                if (payload.index === selectedMoveIndex) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                    />
                  );
                }
                return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--primary))" />;
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-cyan-400" />
          <span>Brilliant</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-600" />
          <span>Blunder</span>
        </div>
      </div>
    </Surface>
  );
}
