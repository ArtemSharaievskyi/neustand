import { ArrowUpRight } from "lucide-react";

const services = [
  {
    slug: "demontage-entkernung",
    title: "Demontage & Entkernung",
    intro:
      "Rückbau bestehender Einbauten und Oberflächen als Vorbereitung für die nächsten Arbeiten.",
    items: [
      "Nichttragende Trennwände, Gipskartonkonstruktionen und abgehängte Decken demontieren",
      "Türen und Zargen sowie alte Küchen und Einbaumöbel ausbauen",
      "Tapeten, Putz, Fliesen, alten Estrich und Bodenbeläge entfernen",
    ],
    note: "Ohne Eingriffe in tragende oder statisch relevante Bauteile.",
    layout: "service-span-7",
  },
  {
    slug: "entruempelung-raeumung",
    title: "Entrümpelung & Räumung",
    intro:
      "Platz schaffen in Wohnungen, Häusern, Kellern, Garagen, Büros und auf Baustellen.",
    items: [
      "Möbel, zurückgelassene Gegenstände und Abfälle aus den Räumen räumen",
      "Materialien sortieren, hinaustragen und in bereitgestellte Container einbringen",
    ],
    layout: "service-span-5",
  },
  {
    slug: "wohnungsaufbereitung",
    title: "Wohnungsaufbereitung",
    intro:
      "Wohnungen für Übergabe, Mieterwechsel oder Renovierung vorbereiten. Welche Arbeiten dazugehören, richtet sich nach Zustand und vereinbartem Umfang.",
    items: [
      "Alte Beläge entfernen, Löcher und Risse schließen, Tapeten und Türen ausbessern sowie Wandflächen auffrischen",
      "Tapezier- und Anstricharbeiten, einschließlich Raufasertapeten mit weißem Anstrich",
      "Reinigung und Vorbereitung zur Übergabe nach dem konkreten Bedarf",
    ],
    layout: "service-span-full",
  },
  {
    slug: "trockenbau",
    title: "Trockenbau",
    intro:
      "Räume mit nichttragenden Konstruktionen gestalten und an neue Anforderungen anpassen.",
    items: [
      "Gipskarton-Trennwände, Vorsatzschalen, abgehängte Decken und vergleichbare Trockenbaukonstruktionen montieren und demontieren",
    ],
    layout: "service-span-6",
  },
  {
    slug: "bodenlegearbeiten",
    title: "Bodenlegearbeiten",
    intro: "Neue Bodenbeläge für die weitere Nutzung Ihrer Räume.",
    items: [
      "Laminat, Vinyl- und PVC-Beläge, Linoleum, Teppichboden und Fertigparkett verlegen",
      "Passende Sockel- und Abschlussleisten montieren",
    ],
    layout: "service-span-6",
  },
  {
    slug: "montage",
    title: "Montage",
    intro: "Vorgefertigte Elemente und Einrichtungen passend montieren.",
    items: [
      "Vorgefertigte Innentüren und Zargen einbauen sowie Regale, Fertigmöbel und Küchenschränke montieren",
    ],
    note:
      "Ohne Anschlussarbeiten an Elektro-, Gas-, Heizungs- oder Wasserinstallationen.",
    layout: "service-span-5",
  },
  {
    slug: "baureinigung",
    title: "Baureinigung",
    intro: "Saubere Räume nach Rückbau, Ausbau und weiteren Arbeiten.",
    items: [
      "Grund- und Endreinigung sowie Reinigung nach Demontage- und Ausbauarbeiten",
      "Der Umfang richtet sich nach dem Zustand des Objekts und der Vereinbarung",
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
            Sieben Arbeitsbereiche für Rückbau, Vorbereitung und Innenausbau.
            Der Umfang richtet sich nach Zustand und Vorhaben.
          </p>
        </div>

        <div className="service-grid-modern">
          {services.map((service) => (
            <article
              className={`service-card-modern card card-border ${service.layout}`}
              key={service.slug}
            >
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
      </div>
    </section>
  );
}
