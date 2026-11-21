"use client";

import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  caption?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  caption,
  emptyMessage = "કોઈ માહિતી ઉપલબ્ધ નથી",
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-lg ${className}`}
      style={{
        border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
        borderRadius: "var(--radius-lg, 16px)",
        backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
        boxShadow: "var(--shadow-sm, 0 2px 8px -2px rgba(0, 0, 0, 0.35))",
      }}
    >
      <table className="w-full text-left border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-white/10" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-white/70 ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-white/50 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                className="hover:bg-white/[0.04] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 text-white/90 text-sm ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row, index) : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
