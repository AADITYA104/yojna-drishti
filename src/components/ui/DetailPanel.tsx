"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
}: DetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel: Bottom Sheet on Mobile, Slide-Over on Desktop */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`fixed z-50 inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-md max-h-[90vh] md:max-h-none flex flex-col overflow-hidden ${className}`}
            style={{
              backgroundColor: "var(--color-surface-solid, #152735)",
              borderTop: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
              borderLeft: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
              borderTopLeftRadius: "var(--radius-lg, 16px)",
              borderTopRightRadius: "var(--radius-lg, 16px)",
              boxShadow: "var(--shadow-lg, 0 16px 36px -10px rgba(0, 0, 0, 0.52))",
            }}
          >
            {/* Grab handle for touch users */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-3 md:hidden" aria-hidden="true" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-white/60 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="પેનલ બંધ કરો (Close panel)"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                style={{ borderRadius: "var(--radius-sm, 8px)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
