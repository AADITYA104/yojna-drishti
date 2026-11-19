"use client";

import { useEffect } from "react";

/**
 * Global ScrollRevealProvider for Yojana Drishti.
 * Observes all elements matching .reveal, .reveal-left, .reveal-scale,
 * .reveal-stagger, .chart-animate, .kpi-card-animate across the DOM.
 * When scrolled into view, it seamlessly activates them with the 'is-visible' class.
 */
export function ScrollRevealProvider() {
  useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-scale, .reveal-stagger";
    document.documentElement.classList.add("has-scroll-reveal");

    function attachObserver() {
      const targets = document.querySelectorAll<HTMLElement>(selectors);

      if (!("IntersectionObserver" in window)) {
        targets.forEach((element) => element.classList.add("is-visible"));
        return null;
      }

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      targets.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          obs.observe(el);
        }
      });
      return obs;
    }

    let obs = attachObserver();

    // Re-observe whenever user navigates or dynamic content loads
    const mutObs = new MutationObserver(() => {
      obs?.disconnect();
      obs = attachObserver();
    });

    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs?.disconnect();
      mutObs.disconnect();
      document.documentElement.classList.remove("has-scroll-reveal");
    };
  }, []);

  return null;
}
