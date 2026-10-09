import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import { Button } from "./ui/button";

const heroImageOptions = {
  alt: "Symbolbild eines teils entkernten Wohnraums mit freigelegtem Mauerwerk und Sanierungsarbeiten.",
  sizes: "100vw",
  quality: 82,
  loading: "eager" as const,
  fetchPriority: "high" as const,
};

const {
  props: heroImageProps,
} = getImageProps({
  ...heroImageOptions,
  src: "/images/hero.webp",
  width: 2912,
  height: 1632,
});

export function Hero1() {
  return (
    <section className="home-hero hero" id="top" aria-labelledby="hero-title">
      <picture className="home-hero-picture">
        <img
          {...heroImageProps}
          className="home-hero-image"
        />
      </picture>
      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="container home-hero-inner hero-content">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">
            NEUSTAND <span aria-hidden="true">·</span> Rückbau{" "}
            <span aria-hidden="true">·</span> Wohnungsaufbereitung{" "}
            <span aria-hidden="true">·</span> Objektservice
          </p>
          <h1 id="hero-title">Raum für einen neuen Anfang.</h1>
          <p className="home-hero-lede">
            Von Rückbau und Räumung bis zur Vorbereitung und zum Innenausbau:
            Wir stimmen die Leistungen auf den Zustand Ihres Objekts und Ihr
            Vorhaben ab.
          </p>
          <div className="home-hero-actions">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="btn home-hero-button"
            >
              <a href="#anfrage-form">
                Anfrage senden
                <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2} />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn home-hero-button"
            >
              <a href="#leistungen">Leistungen ansehen</a>
            </Button>
          </div>
          <p className="home-hero-email">
            <span>E-Mail</span>
            <a href="mailto:neustand.service@gmail.com">
              neustand.service@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
