import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import { Button } from "./ui/button";

const heroImageOptions = {
  alt: "",
  sizes: "100vw",
  quality: 82,
  loading: "eager" as const,
  fetchPriority: "high" as const,
};

const {
  props: { srcSet: desktopSrcSet, ...desktopImageProps },
} = getImageProps({
  ...heroImageOptions,
  src: "/images/neustand-hero-transformation-wide.png",
  width: 1916,
  height: 821,
});

const {
  props: { srcSet: mobileSrcSet, sizes: mobileSizes },
} = getImageProps({
  ...heroImageOptions,
  src: "/images/neustand-hero-transformation-mobile.png",
  width: 1122,
  height: 1402,
});

export function Hero1() {
  return (
    <section className="home-hero hero" id="top" aria-labelledby="hero-title">
      <picture className="home-hero-picture" aria-hidden="true">
        <source
          media="(max-width: 680px)"
          srcSet={mobileSrcSet}
          sizes={mobileSizes}
        />
        <img
          {...desktopImageProps}
          srcSet={desktopSrcSet}
          className="home-hero-image"
          alt=""
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
