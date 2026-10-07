import Image from "next/image";
import Link from "next/link";
import { Contact2 } from "./components/contact2";
import { Faq1 } from "./components/faq1";
import { Feature1 } from "./components/feature1";
import { Hero1 } from "./components/hero1";
import { SiteNav } from "./components/site-nav";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <SiteNav />

      <main id="main-content" tabIndex={-1}>
        <Hero1 />
        <Feature1 />

        <section
          className="audience-band section"
          aria-labelledby="audience-title"
        >
          <div className="container audience-band-grid">
            <div className="audience-band-copy">
              <h2 id="audience-title">
                Für private Auftraggeber, Vermieter und Hausverwaltungen.
              </h2>
              <p>
                Ob einzelne Arbeiten oder mehrere Räume: Der Umfang wird direkt
                mit Ihnen abgestimmt.
              </p>
            </div>
            <ul className="audience-band-list">
              <li>Private Auftraggeber</li>
              <li>Vermieter</li>
              <li>Hausverwaltungen</li>
            </ul>
          </div>
        </section>

        <section
          className="workflow section"
          id="ablauf"
          aria-labelledby="workflow-title"
        >
          <div className="container workflow-grid">
            <div className="workflow-copy">
              <h2 id="workflow-title">
                Von der Anfrage zur <em>abgestimmten Arbeit.</em>
              </h2>
              <p>
                Sie beschreiben die Aufgabe. Wir klären die offenen Punkte
                gemeinsam und legen den Umfang vor Beginn fest.
              </p>
            </div>
            <ol className="workflow-list">
              <li>
                <span>01</span>
                <div>
                  <h3>Anfrage senden</h3>
                  <p>
                    Beschreiben Sie Räume, Ausgangslage und gewünschte Arbeiten.
                    Fotos können Sie direkt anhängen.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Details klären</h3>
                  <p>
                    Zustand, Arbeitsumfang und offene Fragen werden miteinander
                    besprochen.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Termin abstimmen</h3>
                  <p>
                    Leistungsumfang, Angebot und ein passender Termin werden
                    vor Beginn festgelegt.
                  </p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <h3>Vereinbarte Arbeiten ausführen</h3>
                  <p>
                    NEUSTAND setzt den abgestimmten Leistungsumfang um.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section
          className="owner-contact section"
          id="ansprechpartner"
          aria-labelledby="owner-title"
        >
          <div className="container owner-contact-grid">
            <h2 id="owner-title">
              Direkt mit <em>Artem sprechen.</em>
            </h2>
            <div className="owner-contact-copy">
              <p>
                Artem Sharaievskyi ist Ihr Ansprechpartner bei NEUSTAND. Aufgabe,
                Zustand und gewünschter Umfang lassen sich direkt besprechen.
              </p>
              <a href="mailto:neustand.service@gmail.com">
                neustand.service@gmail.com <Arrow />
              </a>
              <a
                href="https://wa.me/491623352139"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp öffnen <Arrow />
              </a>
            </div>
          </div>
        </section>

        <Faq1 />
        <Contact2 />
      </main>

      <footer className="footer-modern" id="rechtliches">
        <div className="container footer-modern-main">
          <div>
            <Link
              className="footer-modern-brand"
              href="/"
              aria-label="NEUSTAND Startseite"
            >
              <Image
                src="/images/logo.png"
                alt=""
                width={1942}
                height={809}
                sizes="190px"
              />
            </Link>
            <p>Rückbau · Wohnungsaufbereitung · Objektservice</p>
            <a href="mailto:neustand.service@gmail.com">
              neustand.service@gmail.com
            </a>
          </div>
          <nav aria-label="Rechtliche Informationen und Kontakt">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutzerklaerung">Datenschutzerklärung</Link>
            <a
              href="https://wa.me/491623352139"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </nav>
        </div>
        <div className="container footer-modern-bottom">
          <span>© NEUSTAND</span>
          <a href="#top">Zurück nach oben <Arrow /></a>
        </div>
      </footer>
    </>
  );
}
