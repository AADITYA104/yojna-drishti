"use client";
import type { LucideIcon } from "lucide-react";

export interface RailItem { id: string; label: string; icon: LucideIcon }
interface Props { items: RailItem[]; current: string; onNavigate: (id: string) => void }

/** Floating pill rail. Works with your existing `currentPage` state (use withViewTransition in onNavigate). */
export function GlassRail({ items, current, onNavigate }: Props) {
  return (
    <nav className="dr-rail" aria-label="Main">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" title={label} aria-label={label}
          aria-current={current === id ? "page" : undefined} onClick={() => onNavigate(id)}>
          <Icon size={20} aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
