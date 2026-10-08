import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    slug: "demontage-entkernung",
    title: "Demontage & Entkernung",
    image: "/images/services/demontage-entkernung-v2.webp",
    imageAlt:
      "Teilweise entputzte Wand mit freigelegten Ziegeln und geordnet gestapelten Rückbaumaterialien.",
    imagePosition: "50% 55%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 58vw, 686px",
    intro:
      "Rückbau bestehender Einbauten und Oberflächen als Vorbereitung für die nächsten Arbeiten.",
    items: [
      "Nichttragende Trennwände, Trockenbaukonstruktionen und abgehängte Decken demontieren",
      "Türen, Zargen, alte Küchen und Einbaumöbel ausbauen",
      "Tapeten, Putz, Fliesen, vorhandenen Estrich und alte Bodenbeläge entfernen",
    ],
    note: "Ohne Eingriff in tragende oder statisch relevante Bauteile.",
    layout: "service-span-7",
  },
  {
    slug: "entruempelung-raeumung",
    title: "Entrümpelung & Räumung",
    image: "/images/services/entruempelung-raeumung.webp",
    imageAlt:
      "Kartons und Möbel stehen am Rand eines bereits weitgehend freigeräumten Zimmers.",
    imagePosition: "50% 50%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 42vw, 486px",
    intro:
      "Platz schaffen in Wohnungen, Häusern, Kellern, Garagen, Büros und auf Baustellen.",
    items: [
      "Möbel, zurückgelassene Gegenstände und sonstiges Räumgut entfernen",
      "Materialien sortieren, hinaustragen und in bereitgestellten Behältern oder Containern bereitstellen",
      "Wohnungs-, Haushalts-, Betriebs- und Baustellenräumungen",
    ],
    layout: "service-span-5",
  },
  {
    slug: "wohnungsaufbereitung",
    title: "Wohnungsaufbereitung",
    image: "/images/services/wohnungsaufbereitung-v2.webp",
    imageAlt:
      "An einer Zimmerwand ist links alte Tapete entfernt; rechts ist helle Raufasertapete angebracht.",
    imagePosition: "50% 50%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) calc(100vw - 48px), 1180px",
    intro:
      "Wohnungen für Übergabe, Mieterwechsel oder nachfolgende Renovierungsarbeiten vorbereiten. Der konkrete Umfang richtet sich nach Zustand und vereinbarter Leistung.",
    items: [
      "Alte Tapeten, Bodenbeläge und zurückgelassene Einbauten entfernen",
      "Bohrlöcher und Risse schließen sowie Tapeten, Türen und Oberflächen ausbessern",
      "Raufaserarbeiten mit weißem Überstreichen im Rahmen der Wohnungsaufbereitung",
      "Reinigung und Vorbereitung für Übergabe oder nachfolgende Gewerke",
    ],
    layout: "service-span-full",
  },
  {
    slug: "trockenbau",
    title: "Trockenbau",
    image: "/images/services/trockenbau.webp",
    imageAlt:
      "Nicht tragende Trockenbauwand mit teilweise sichtbarem Metallständerrahmen und Gipskartonplatten.",
    imagePosition: "50% 52%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 583px",
    intro:
      "Räume mit nichttragenden Trockenbaukonstruktionen gestalten und an neue Anforderungen anpassen.",
    items: [
      "Nichttragende Gipskarton-Trennwände montieren und demontieren",
      "Vorsatzschalen, Deckenbekleidungen und Unterdecken herstellen",
      "Dämmstoffe innerhalb von Trockenbaukonstruktionen einbringen",
    ],
    layout: "service-span-6",
  },
  {
    slug: "bodenlegearbeiten",
    title: "Bodenlegearbeiten",
    image: "/images/services/bodenlegearbeiten-v2.webp",
    imageAlt:
      "Helle Bodenplanken werden verlegt; neben der noch offenen Kante liegen lose Planken auf dem Untergrund.",
    imagePosition: "50% 60%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 583px",
    intro: "Neue Bodenbeläge für Wohn- und Nutzräume.",
    items: [
      "Laminat, Vinyl-/PVC-Beläge, Linoleum, Teppichboden und Fertigparkett verlegen",
      "Sockel-, Übergangs- und Abschlussleisten montieren",
    ],
    layout: "service-span-6",
  },
  {
    slug: "montage",
    title: "Baufertigteile & Montage",
    image: "/images/services/montage-v2.webp",
    imageAlt:
      "Weiße Innentür in neuer Zarge; die seitliche Verkleidung fehlt noch und vorbereitete Zierleisten stehen daneben.",
    imagePosition: "50% 55%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 42vw, 486px",
    intro: "Vorgefertigte Bauteile, Möbel und Einrichtungen fachgerecht montieren.",
    items: [
      "Vorgefertigte Innentüren und Zargen einbauen",
      "Regalsysteme, Fertigmöbel und Küchenschränke montieren",
      "Bestehende Möbel und Einbauten demontieren",
    ],
    note:
      "Ohne Elektro-, Gas-, Heizungs- oder Wasseranschlussarbeiten.",
    layout: "service-span-5",
  },
  {
    slug: "baureinigung",
    title: "Bau- & Endreinigung",
    image: "/images/services/baureinigung-v2.webp",
    imageAlt:
      "Sauberes Zimmer vor der Übergabe mit Eimer, Bodenwischer, Tüchern und Handbürste am Fenster.",
    imagePosition: "50% 85%",
    imageSizes:
      "(max-width: 680px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 58vw, 686px",
    intro: "Saubere Räume nach Rückbau, Ausbau oder vor der Übergabe.",
    items: [
      "Grund-, Bau- und Endreinigung",
      "Reinigung nach Demontage- und Ausbauarbeiten",
      "Übergabereinigung nach vereinbartem Leistungsumfang",
    ],
    layout: "service-span-7",
  },
] as const;

const workSteps = [
  "Rückbauen",
  "Freiräumen",
  "Vorbereiten",
  "Ausbauen",
  "Sauber übergeben",
];

export function Feature1() {
  return (
    <section
      className="services-showcase section"
      id="leistungen"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="services-heading">
          <h2 id="services-title">
            Leistungen mit <em>klarem Rahmen.</em>
          </h2>
          <p>
            Sieben Leistungsbereiche für Rückbau, Vorbereitung und ausgewählten Innenausbau.
            Welche Arbeiten erforderlich sind, richtet sich nach Zustand des Objekts und dem vereinbarten Leistungsumfang.
          </p>
        </div>

        <div className="service-grid-modern">
          {services.map((service) => (
            <article
              className={`service-card-modern card card-border ${service.layout}`}
              key={service.slug}
            >
              <figure className="service-media-modern">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={1440}
                  height={960}
                  sizes={service.imageSizes}
                  style={{ objectPosition: service.imagePosition }}
                />
              </figure>
              <div className="service-copy-modern card-body">
                <div className="service-copy-heading">
                  <h3>{service.title}</h3>
                  <p className="service-intro-modern">{service.intro}</p>
                </div>
                <div className="service-copy-details">
                  <ul className="service-list-modern">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {"note" in service && (
                    <p className="service-limit-modern">{service.note}</p>
                  )}
                  <a className="service-card-link link" href="#anfrage-form">
                    Leistung anfragen
                    <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="service-process">
          <ol className="service-process-flow" aria-label="Arbeitsschritte">
            {workSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            Einzelne Leistungen oder mehrere aufeinander abgestimmte
            Arbeitsschritte – passend zu Ihrem Objekt und Ihrem Vorhaben.
          </p>
        </div>
        <p className="service-scope-note">
          Alle Leistungen werden im jeweils zulässigen handwerksrechtlichen Rahmen ausgeführt. Arbeiten an tragenden
          oder statisch relevanten Bauteilen sowie Elektro-, Gas-, Heizungs- und Sanitärinstallationen sind nicht
          Bestandteil unseres Leistungsangebots.
        </p>
      </div>
    </section>
  );
}
