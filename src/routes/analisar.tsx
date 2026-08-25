import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  UploadCloud,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DetectionImage } from "@/components/DetectionImage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  addAnalysis,
  formatDate,
  formatNumber,
  simulateAnalysis,
  useAnalyses,
  type Analysis,
} from "@/lib/analysis-store";
import sampleImg from "@/assets/sample-nauplii.jpg";

export const Route = createFileRoute("/analisar")({
  head: () => ({
    meta: [
      { title: "Analisar amostra — NaupliAI" },
      {
        name: "description",
        content:
          "Envie a imagem da amostra e execute a análise por IA para contar náuplios com marcadores de detecção.",
      },
      { property: "og:title", content: "Analisar amostra — NaupliAI" },
      {
        property: "og:description",
        content: "Upload da amostra, detecção simulada por IA e contagem automática.",
      },
    ],
  }),
  component: AnalyzePage,
});

const steps = [
  "Pré-processando imagem…",
  "Detectando organismos…",
  "Classificando náuplios…",
  "Consolidando contagem…",
];

function AnalyzePage() {
  const { latest } = useAnalyses();
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const run = () => {
    setRunning(true);
    setResult(null);
    setProgress(0);
    setStep(0);
    const previous = latest;
    let p = 0;
    const timer = setInterval(() => {
      p += 4 + Math.random() * 6;
      setProgress(Math.min(p, 100));
      setStep(Math.min(steps.length - 1, Math.floor((p / 100) * steps.length)));
      if (p >= 100) {
        clearInterval(timer);
        const a = simulateAnalysis(image, previous);
        addAnalysis(a);
        setResult(a);
        setRunning(false);
      }
    }, 160);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setProgress(0);
  };

  const down = (result?.variation ?? 0) < 0;
  const alert = result && result.variation !== null && result.variation <= -3;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Analisar nova amostra</h1>
        <p className="mt-1 text-muted-foreground">
          Envie a foto da amostra e a IA identificará e contará os náuplios.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="surface p-5 sm:p-6">
          {!image ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                readFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                dragging ? "border-primary bg-secondary/60" : "border-border bg-secondary/20"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-aqua text-primary-foreground">
                <UploadCloud className="h-7 w-7" />
              </span>
              <p className="mt-4 font-medium">Arraste a imagem da amostra aqui</p>
              <p className="mt-1 text-sm text-muted-foreground">
                ou clique para selecionar um arquivo (JPG, PNG)
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => readFile(e.target.files?.[0])}
              />
              <Button
                variant="secondary"
                className="mt-5"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(sampleImg);
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Usar amostra de exemplo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <DetectionImage
                image={image}
                markers={result?.markers}
                scanning={running}
              />
              {running ? (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4 animate-pulse" /> {steps[step]}
                    </span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="mt-2" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {!result && (
                    <Button
                      size="lg"
                      className="bg-gradient-aqua text-primary-foreground"
                      onClick={run}
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Analisar com IA
                    </Button>
                  )}
                  <Button variant="secondary" size="lg" onClick={reset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Nova imagem
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4">
          {!result ? (
            <div className="surface flex h-full min-h-56 flex-col items-center justify-center p-8 text-center">
              <p className="font-medium text-muted-foreground">
                O resultado da análise aparecerá aqui
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Contagem, confiança da IA e comparação com a amostra anterior.
              </p>
            </div>
          ) : (
            <>
              <div className="surface rise-in p-6">
                <p className="text-sm text-muted-foreground">Náuplios identificados</p>
                <p className="mt-1 font-display text-5xl font-semibold text-gradient-aqua">
                  {formatNumber(result.count)}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Confiança da IA</p>
                    <p className="mt-1 text-lg font-semibold">
                      {result.confidence.toFixed(1).replace(".", ",")}%
                    </p>
                    <Progress value={result.confidence} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Variação</p>
                    <p
                      className={`mt-1 inline-flex items-center gap-1 text-lg font-semibold ${
                        result.variation === null
                          ? ""
                          : down
                            ? "text-destructive"
                            : "text-success"
                      }`}
                    >
                      {result.variation === null ? (
                        "—"
                      ) : (
                        <>
                          {down ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {result.variation > 0 ? "+" : ""}
                          {result.variation.toFixed(1).replace(".", ",")}%
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      em relação à última amostra
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-xs text-muted-foreground">
                  Analisado em {formatDate(result.date)} · {result.markers.length}{" "}
                  marcadores exibidos na imagem (amostragem visual)
                </p>
              </div>

              {alert && (
                <div className="rise-in flex gap-3 rounded-2xl border border-destructive/50 bg-destructive/10 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      Atenção: foi identificada uma possível redução na quantidade de
                      náuplios.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Perda estimada de{" "}
                      {formatNumber(
                        Math.abs(
                          Math.round(
                            (result.count * (result.variation ?? 0)) /
                              (100 + (result.variation ?? 0)),
                          ),
                        ),
                      )}{" "}
                      náuplios em relação à amostra anterior. Verifique aeração,
                      temperatura e manejo do tanque.
                    </p>
                  </div>
                </div>
              )}

              <div className="surface p-5">
                <h2 className="text-sm font-semibold">Comparação com análises anteriores</h2>
                <Comparison current={result} />
                <Button asChild variant="secondary" className="mt-4 w-full">
                  <Link to="/historico">Abrir histórico completo</Link>
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Comparison({ current }: { current: Analysis }) {
  const { analyses } = useAnalyses();
  const previous = analyses.filter((a) => a.id !== current.id).slice(-3).reverse();
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {previous.map((a) => {
        const diff = current.count - a.count;
        return (
          <li key={a.id} className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{formatDate(a.date)}</span>
            <span className="flex items-center gap-3">
              <span>{formatNumber(a.count)}</span>
              <span className={diff < 0 ? "text-destructive" : "text-success"}>
                {diff > 0 ? "+" : ""}
                {formatNumber(diff)}
              </span>
            </span>
          </li>
        );
      })}
      {!previous.length && (
        <li className="text-muted-foreground">Esta é a primeira amostra registrada.</li>
      )}
    </ul>
  );
}
