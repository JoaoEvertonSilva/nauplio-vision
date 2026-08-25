import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ScanLine,
  Layers,
  Sigma,
  Gauge,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAnalyses, formatNumber, formatDate, statusOf } from "@/lib/analysis-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NaupliAI — Contagem de náuplios com Inteligência Artificial" },
      {
        name: "description",
        content:
          "Painel NaupliAI: envie a foto da amostra e obtenha contagem automática de náuplios, confiança da IA e variação entre análises.",
      },
      { property: "og:title", content: "NaupliAI — Contagem inteligente de náuplios" },
      {
        property: "og:description",
        content: "Transformando imagens em dados e dados em decisões na carcinicultura.",
      },
    ],
  }),
  component: Dashboard,
});

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="surface rise-in p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Dashboard() {
  const { analyses, total, average, count, latest } = useAnalyses();
  const recent = [...analyses].reverse().slice(0, 5);

  return (
    <AppShell>
      <section className="surface glow relative overflow-hidden p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Visão computacional para carcinicultura
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            Naupli<span className="text-gradient-aqua">AI</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Transformando imagens em dados e dados em decisões.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-aqua text-primary-foreground">
              <Link to="/analisar">
                <ScanLine className="mr-2 h-4 w-4" /> Analisar nova amostra
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/historico">Ver histórico</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat
          icon={Layers}
          label="Amostras analisadas"
          value={formatNumber(count)}
          hint="Total de análises registradas"
        />
        <Stat
          icon={Sigma}
          label="Náuplios contabilizados"
          value={formatNumber(total)}
          hint="Somatório de todas as amostras"
        />
        <Stat
          icon={Gauge}
          label="Média por amostra"
          value={formatNumber(average)}
          hint={
            latest
              ? `Última amostra: ${formatNumber(latest.count)} náuplios`
              : "Sem amostras ainda"
          }
        />
      </section>

      <section className="surface mt-6 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Últimas análises</h2>
          <Link
            to="/historico"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver tudo <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border/60">
          {recent.map((a) => {
            const s = statusOf(a.variation);
            const down = (a.variation ?? 0) < 0;
            return (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{formatNumber(a.count)} náuplios</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={
                      a.variation === null
                        ? "text-muted-foreground"
                        : down
                          ? "text-destructive"
                          : "text-success"
                    }
                  >
                    {a.variation === null ? (
                      "—"
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {down ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        {a.variation > 0 ? "+" : ""}
                        {a.variation.toFixed(1).replace(".", ",")}%
                      </span>
                    )}
                  </span>
                  <span className="hidden rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground sm:inline">
                    {s.label}
                  </span>
                </div>
              </li>
            );
          })}
          {!recent.length && (
            <li className="py-6 text-sm text-muted-foreground">
              Nenhuma análise ainda. Envie sua primeira amostra.
            </li>
          )}
        </ul>
      </section>
    </AppShell>
  );
}
