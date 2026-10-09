"use client";

import { useEffect } from "react";
import { animate } from "motion";

type RevealRule = {
  selector: string;
  distance: number;
  duration: number;
  stagger?: number;
};

type ServiceCardTarget = {
  card: HTMLElement;
  image: HTMLElement;
  copy: HTMLElement;
  index: number;
};

type RunningAnimation = {
  stop: () => void;
  then: (onResolve: () => void, onReject?: () => void) => Promise<void>;
};

const revealRules: RevealRule[] = [
  { selector: ".services-heading", distance: 16, duration: 0.42 },
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
    const serviceCards = Array.from(
      document.querySelectorAll<HTMLElement>(".service-card-modern"),
    ).flatMap((card, index) => {
      const image = card.querySelector<HTMLElement>(".service-media-modern");
      const copy = card.querySelector<HTMLElement>(".service-copy-heading");
      return image && copy ? [{ card, image, copy, index }] : [];
    });

    if (
      (!targets.length && !serviceCards.length) ||
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const activeAnimations = new Set<{ stop: () => void }>();
    const serviceAnimations = new Map<HTMLElement, Set<RunningAnimation>>();
    let revealObserver: IntersectionObserver | undefined;
    let serviceObserver: IntersectionObserver | undefined;

    const trackServiceAnimation = (
      target: ServiceCardTarget,
      controls: RunningAnimation,
    ) => {
      const controlsForCard = serviceAnimations.get(target.card) ?? new Set();
      controlsForCard.add(controls);
      serviceAnimations.set(target.card, controlsForCard);
      activeAnimations.add(controls);
      void controls.then(
        () => activeAnimations.delete(controls),
        () => activeAnimations.delete(controls),
      );
    };

    const openServiceCard = (target: ServiceCardTarget) => {
      target.card.dataset.serviceReveal = "open";
      target.image.dataset.serviceImageReveal = "open";
      target.copy.dataset.serviceCopyReveal = "open";
      serviceObserver?.unobserve(target.card);
      for (const controls of serviceAnimations.get(target.card) ?? []) {
        controls.stop();
        activeAnimations.delete(controls);
      }
      serviceAnimations.delete(target.card);
      target.image.style.removeProperty("clip-path");
      target.copy.style.removeProperty("opacity");
      target.copy.style.removeProperty("transform");
    };

    const getServiceCardDelay = (target: ServiceCardTarget) => {
      const isPhone = window.matchMedia("(max-width: 680px)").matches;
      if (isPhone) return target.index * 0.015;

      const rowTop = target.card.getBoundingClientRect().top;
      const rowPeers = serviceCards.filter(
        (candidate) =>
          Math.abs(candidate.card.getBoundingClientRect().top - rowTop) < 1,
      );
      return rowPeers.indexOf(target) * 0.075;
    };

    const revealServiceCard = (
      target: ServiceCardTarget,
      animateEntrance: boolean,
    ) => {
      const state = target.card.dataset.serviceReveal;
      if (state === "open") return;
      if (state === "entering") {
        if (!animateEntrance) openServiceCard(target);
        return;
      }
      if (state !== "waiting") return;
      target.card.dataset.serviceReveal = "entering";

      if (!animateEntrance || reducedMotion.matches) {
        openServiceCard(target);
        return;
      }

      const isPhone = window.matchMedia("(max-width: 680px)").matches;
      const imageAnimation = animate(
        target.image,
        { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
        {
          delay: getServiceCardDelay(target),
          duration: isPhone ? 0.34 : 0.4,
          ease: revealEase,
        },
      );
      trackServiceAnimation(target, imageAnimation);
      void imageAnimation.then(
        () => {
          if (target.card.dataset.serviceReveal !== "entering") return;
          target.image.dataset.serviceImageReveal = "open";
          target.image.style.removeProperty("clip-path");

          const copyAnimation = animate(
            target.copy,
            { opacity: [0, 1], y: [12, 0] },
            {
              delay: isPhone ? 0.01 : 0.025,
              duration: isPhone ? 0.27 : 0.32,
              ease: revealEase,
            },
          );
          trackServiceAnimation(target, copyAnimation);
          void copyAnimation.then(
            () => {
              if (target.card.dataset.serviceReveal !== "entering") return;
              target.copy.dataset.serviceCopyReveal = "open";
              target.copy.style.removeProperty("opacity");
              target.copy.style.removeProperty("transform");
              target.card.dataset.serviceReveal = "open";
            },
            () => openServiceCard(target),
          );
        },
        () => openServiceCard(target),
      );
    };

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

    if (targets.length) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = targets.find((item) => item.element === entry.target);
            if (target) reveal(target, true);
            revealObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
      );

      for (const target of targets) revealObserver.observe(target.element);
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-scroll-reveal]");
      if (element) {
        const target = targets.find((item) => item.element === element);
        if (target) reveal(target, false);
      }

      const serviceCard = event.target.closest<HTMLElement>(".service-card-modern");
      const serviceTarget = serviceCards.find((item) => item.card === serviceCard);
      if (serviceTarget) revealServiceCard(serviceTarget, false);
    };

    const handleMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      revealObserver?.disconnect();
      serviceObserver?.disconnect();
      root.removeAttribute("data-scroll-reveals");
      root.removeAttribute("data-service-reveals");
      for (const target of targets) target.element.dataset.scrollRevealed = "true";
      for (const controls of activeAnimations) controls.stop();
      activeAnimations.clear();
      serviceAnimations.clear();
      for (const target of serviceCards) openServiceCard(target);
    };

    for (const target of targets) {
      target.element.dataset.scrollReveal = "true";
      target.element.style.setProperty(
        "--scroll-reveal-distance",
        `${target.distance}px`,
      );
    }

    if (serviceCards.length) {
      for (const target of serviceCards) {
        target.card.dataset.serviceReveal = "waiting";
        target.image.dataset.serviceImageReveal = "waiting";
        target.copy.dataset.serviceCopyReveal = "waiting";
      }

      serviceObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = serviceCards.find((item) => item.card === entry.target);
            if (target) revealServiceCard(target, true);
            serviceObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
      );

      for (const target of serviceCards) serviceObserver.observe(target.card);
    }

    document.addEventListener("focusin", handleFocusIn);
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    if (targets.length) root.dataset.scrollReveals = "ready";
    if (serviceCards.length) root.dataset.serviceReveals = "ready";

    return () => {
      root.removeAttribute("data-scroll-reveals");
      root.removeAttribute("data-service-reveals");
      revealObserver?.disconnect();
      serviceObserver?.disconnect();
      document.removeEventListener("focusin", handleFocusIn);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      for (const controls of activeAnimations) controls.stop();
      activeAnimations.clear();
      for (const target of targets) {
        target.element.removeAttribute("data-scroll-reveal");
        target.element.removeAttribute("data-scroll-revealed");
        target.element.style.removeProperty("--scroll-reveal-distance");
      }
      for (const target of serviceCards) {
        target.card.removeAttribute("data-service-reveal");
        target.image.removeAttribute("data-service-image-reveal");
        target.copy.removeAttribute("data-service-copy-reveal");
        target.image.style.removeProperty("clip-path");
        target.copy.style.removeProperty("opacity");
        target.copy.style.removeProperty("transform");
      }
    };
  }, []);

  return null;
}
