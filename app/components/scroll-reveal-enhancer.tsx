"use client";

import { useEffect } from "react";
import { animate } from "motion";

type RevealRule = {
  selector: string;
  distance: number;
  duration: number;
  stagger?: number;
};

const revealRules: RevealRule[] = [
  { selector: ".services-heading", distance: 16, duration: 0.42 },
  { selector: ".service-card-modern", distance: 16, duration: 0.44, stagger: 0.045 },
  { selector: ".service-process-flow li", distance: 12, duration: 0.48, stagger: 0.055 },
  { selector: ".service-process > p", distance: 12, duration: 0.46 },
  { selector: ".service-scope-note", distance: 12, duration: 0.46 },
  { selector: ".audience-band-grid", distance: 16, duration: 0.44 },
  { selector: ".workflow-copy", distance: 16, duration: 0.44 },
  { selector: ".workflow-list li", distance: 12, duration: 0.48, stagger: 0.065 },
  { selector: ".owner-contact-grid", distance: 16, duration: 0.44 },
  { selector: ".faq-grid", distance: 16, duration: 0.44 },
  { selector: ".contact-panel-form", distance: 16, duration: 0.44 },
];

const revealEase = [0.23, 1, 0.32, 1] as const;

export function ScrollRevealEnhancer() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = revealRules.flatMap((rule) =>
      Array.from(document.querySelectorAll<HTMLElement>(rule.selector)).map(
        (element, index) => ({
          element,
          delay: (rule.stagger ?? 0) * index,
          distance: rule.distance,
          duration: rule.duration,
        }),
      ),
    );

    if (
      !targets.length ||
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const activeAnimations = new Set<{ stop: () => void }>();

    const reveal = (
      target: (typeof targets)[number],
      animateEntrance: boolean,
    ) => {
      if (target.element.dataset.scrollRevealed === "true") return;

      target.element.dataset.scrollRevealed = "true";
      if (!animateEntrance || reducedMotion.matches) return;

      const controls = animate(
        target.element,
        { opacity: [0, 1], y: [target.distance, 0] },
        {
          delay: target.delay,
          duration: target.duration,
          ease: revealEase,
        },
      );
      activeAnimations.add(controls);
      void controls.then(() => activeAnimations.delete(controls));
    };

    for (const target of targets) {
      target.element.dataset.scrollReveal = "true";
      target.element.style.setProperty(
        "--scroll-reveal-distance",
        `${target.distance}px`,
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = targets.find((item) => item.element === entry.target);
          if (target) reveal(target, true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    for (const target of targets) observer.observe(target.element);

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-scroll-reveal]");
      if (!element) return;
      const target = targets.find((item) => item.element === element);
      if (target) reveal(target, false);
    };

    const handleMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      root.removeAttribute("data-scroll-reveals");
      for (const target of targets) target.element.dataset.scrollRevealed = "true";
      for (const controls of activeAnimations) controls.stop();
      activeAnimations.clear();
    };

    document.addEventListener("focusin", handleFocusIn);
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    root.dataset.scrollReveals = "ready";

    return () => {
      root.removeAttribute("data-scroll-reveals");
      observer.disconnect();
      document.removeEventListener("focusin", handleFocusIn);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      for (const controls of activeAnimations) controls.stop();
      activeAnimations.clear();
      for (const target of targets) {
        target.element.removeAttribute("data-scroll-reveal");
        target.element.removeAttribute("data-scroll-revealed");
        target.element.style.removeProperty("--scroll-reveal-distance");
      }
    };
  }, []);

  return null;
}
