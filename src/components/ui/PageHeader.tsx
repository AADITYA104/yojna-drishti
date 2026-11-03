import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  accent?: "mor" | "haldi" | "indigo" | "neem" | "madder";
  actions?: ReactNode;
}

/** One header for all 14 pages. Each page picks an accent so pages stop feeling identical. */
export function PageHeader({ title, description, icon: Icon, accent = "mor", actions }: PageHeaderProps) {
  return (
    <header className="dr-page-head dr-bandhani dr-intro" data-accent={accent}>
      <span className="dr-page-head__icon" aria-hidden="true"><Icon size={26} /></span>
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="dr-page-head__actions">{actions}</div>}
    </header>
  );
}
