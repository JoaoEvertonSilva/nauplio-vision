import { useCallback, useEffect, useState } from "react";

export type Marker = { x: number; y: number };

export type Analysis = {
  id: string;
  date: string; // ISO
  count: number;
  confidence: number; // 0-100
  variation: number | null; // % vs previous
  image: string | null; // data URL or asset url
  markers: Marker[];
};

const KEY = "naupliai.analyses.v1";

function seedMarkers(seed: number, n = 90): Marker[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  return Array.from({ length: n }, () => ({
    x: 4 + rnd() * 92,
    y: 4 + rnd() * 92,
  }));
}

function seed(): Analysis[] {
  const base = [1180, 1215, 1302, 1289, 1345, 1290];
  const now = Date.now();
  return base.map((count, i) => {
    const prev = i === 0 ? null : base[i - 1];
    return {
      id: `seed-${i}`,
      date: new Date(now - (base.length - i) * 36 * 3600 * 1000).toISOString(),
      count,
      confidence: 92 + ((i * 7) % 7),
      variation: prev ? Number((((count - prev) / prev) * 100).toFixed(1)) : null,
      image: null,
      markers: seedMarkers(i + 3, 60),
    };
  });
}

export function loadAnalyses(): Analysis[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Analysis[];
  } catch {
    return seed();
  }
}

function save(list: Analysis[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

const listeners = new Set<() => void>();

export function addAnalysis(a: Analysis) {
  const list = loadAnalyses();
  list.push(a);
  save(list);
  listeners.forEach((l) => l());
}

export function useAnalyses() {
  const [list, setList] = useState<Analysis[]>([]);
  const refresh = useCallback(() => setList(loadAnalyses()), []);

  useEffect(() => {
    refresh();
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, [refresh]);

  const sorted = [...list].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const total = sorted.reduce((s, a) => s + a.count, 0);

  return {
    analyses: sorted,
    latest: sorted[sorted.length - 1],
    total,
    average: sorted.length ? Math.round(total / sorted.length) : 0,
    count: sorted.length,
  };
}

/** Simulates an AI detection run. */
export function simulateAnalysis(image: string | null, previous?: Analysis): Analysis {
  const count = Math.round(1050 + Math.random() * 420);
  const confidence = Number((91 + Math.random() * 8).toFixed(1));
  const variation = previous
    ? Number((((count - previous.count) / previous.count) * 100).toFixed(1))
    : null;
  const markers = seedMarkers(Math.floor(Math.random() * 10000) + 1, 110);
  return {
    id: `a-${Date.now()}`,
    date: new Date().toISOString(),
    count,
    confidence,
    variation,
    image,
    markers,
  };
}

export function formatNumber(n: number) {
  return n.toLocaleString("pt-BR");
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusOf(variation: number | null) {
  if (variation === null) return { label: "Referência", tone: "neutral" as const };
  if (variation <= -5) return { label: "Perda crítica", tone: "bad" as const };
  if (variation < 0) return { label: "Atenção", tone: "warn" as const };
  return { label: "Estável", tone: "good" as const };
}
