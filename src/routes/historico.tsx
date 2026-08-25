import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { DetectionImage } from "@/components/DetectionImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatNumber,
  statusOf,
  useAnalyses,
  type Analysis,
} from "@/lib/analysis-store";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de análises — NaupliAI" },
      {
        name: "description",
        content:
          "Acompanhe a evolução da contagem de náuplios: datas, quantidades, variação, status e gráfico de tendência.",
      },
      { property: "og:title", content: "Histórico de análises — NaupliAI" },
      {
        property: "og:description",
        content: "Evolução das contagens de náuplios amostra por amostra.",
      },
    ],
  }),
  component: HistoryPage,
});

const toneClass = {
  neutral: "border-border/70 bg-secondary/60 text-muted-foreground",
  good: "border-success/40 bg-success/10 text-success",
  warn: "border-warning/40 bg-warning/10 text-warning",
  bad: "border-destructive/40 bg-destructive/10 text-destructive",
};

function HistoryPage() {
  const { analyses } = useAnalyses();
  const [selected, setSelected] = useState<Analysis | null>(null);

  const chartData = analyses.map((a) => ({
    label: new Date(a.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    count: a.count,
  }));

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Histórico de análises</h1>
        <p className="mt-1 text-muted-foreground">
          Evolução da contagem de náuplios ao longo das amostras.
        </p>
      </div>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Evolução da quantidade de náuplios
        </h2>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                stroke="var(--border)"
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                stroke="var(--border)"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
                formatter={(v: number) => [formatNumber(v), "Náuplios"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                fill="url(#fillCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Quantidade</th>
                <th className="px-5 py-3 font-medium">Variação</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[...analyses].reverse().map((a) => {
                const s = statusOf(a.variation);
                const down = (a.variation ?? 0) < 0;
                return (
                  <tr key={a.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(a.date)}</td>
                    <td className="px-5 py-3 font-medium">{formatNumber(a.count)}</td>
                    <td className="px-5 py-3">
                      {a.variation === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 ${down ? "text-destructive" : "text-success"}`}
                        >
                          {down ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {a.variation > 0 ? "+" : ""}
                          {a.variation.toFixed(1).replace(".", ",")}%
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${toneClass[s.tone]}`}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(a)}>
                        <Eye className="mr-1.5 h-4 w-4" /> Ver
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da análise</DialogTitle>
            <DialogDescription>
              {selected ? formatDate(selected.date) : ""}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <DetectionImage image={selected.image} markers={selected.markers} />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Náuplios</p>
                  <p className="font-display text-xl font-semibold">
                    {formatNumber(selected.count)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confiança</p>
                  <p className="font-display text-xl font-semibold">
                    {selected.confidence.toFixed(1).replace(".", ",")}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Variação</p>
                  <p
                    className={`font-display text-xl font-semibold ${
                      (selected.variation ?? 0) < 0 ? "text-destructive" : "text-success"
                    }`}
                  >
                    {selected.variation === null
                      ? "—"
                      : `${selected.variation > 0 ? "+" : ""}${selected.variation
                          .toFixed(1)
                          .replace(".", ",")}%`}
                  </p>
                </div>
              </div>
              {selected.variation !== null && selected.variation <= -3 && (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  Atenção: foi identificada uma possível redução na quantidade de náuplios.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
