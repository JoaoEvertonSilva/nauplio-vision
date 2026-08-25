import type { Marker } from "@/lib/analysis-store";
import sampleImg from "@/assets/sample-nauplii.jpg";

type Props = {
  image: string | null;
  markers?: Marker[] | undefined;
  scanning?: boolean | undefined;
  className?: string | undefined;
};

export function DetectionImage({ image, markers, scanning, className }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/70 bg-secondary/40 ${className ?? ""}`}
    >
      <img
        src={image ?? sampleImg}
        alt="Amostra de náuplios analisada"
        loading="lazy"
        className="block w-full object-cover"
      />
      {markers?.map((m, i) => (
        <span
          key={i}
          className="marker-pop absolute h-3 w-3 rounded-full border-2 border-primary shadow-[0_0_8px_var(--primary)]"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            animationDelay: `${(i % 30) * 25}ms`,
          }}
        />
      ))}
      {scanning && (
        <>
          <div className="absolute inset-0 bg-background/40" />
          <div className="scan-line" />
        </>
      )}
    </div>
  );
}
