"use client";
import { useEffect, useRef } from "react";

/**
 * Attaches IntersectionObserver to reveal elements when scrolled into view.
 * Elements with class "reveal", "reveal-left", "reveal-scale", or "reveal-stagger"
 * will receive the "is-visible" class upon intersecting the viewport.
 */
export function useScrollReveal(containerRef?: React.RefObject<HTMLElement | null>) {
  const defaultRef = useRef<HTMLDivElement>(null);
  const ref = containerRef ?? defaultRef;

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-scale, .reveal-stagger"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
