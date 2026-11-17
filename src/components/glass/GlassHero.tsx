import type { ReactNode } from "react";

interface Stat {
  value: ReactNode;
  label: string;
}

interface Props {
  title: string;
  lead: string;
  stats: Stat[];
  actions?: ReactNode;
  imageSrc?: string;
}

/** Overview hero: Authentic Gujarat photography + refined blue glass stats. */
export function GlassHero({
  title,
  lead,
  stats,
  actions,
  imageSrc = "/images/gujarat/rann-of-kutch.jpg",
}: Props) {
  return (
    <section className="dr-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="dr-hero__img"
        src={imageSrc}
        alt="Gujarat Heritage & Development"
        fetchPriority="high"
        style={{ filter: "none" }}
      />
      <div className="dr-hero__body">
        <div>
          <h1 className="dr-hero__title">{title}</h1>
          <p className="dr-hero__lead">{lead}</p>
          {actions && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {actions}
            </div>
          )}
        </div>
        <div className="dr-glass dr-hero__stats">
          {stats.map((s) => (
            <div className="dr-hero__stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
