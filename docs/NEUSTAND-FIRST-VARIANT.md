# NEUSTAND – aktueller Website-Entwurf

## Gestaltungsrichtung

- Einseitige, adaptive Website ohne Nutzerkonto und ohne Website-Datenbank; die Anfrage wird serverseitig an einen konfigurierten E-Mail-Dienst weitergeleitet.
- Bestehende visuelle Richtung beibehalten: weißer Hintergrund, schwarze Typografie, orange Akzente. Überschriften verwenden Space Grotesk, Fließtext DM Sans, beide über `next/font/google` gebündelt.
- Die bestätigte Logo-Datei liegt unter `public/images/logo.png` und wird mit `next/image` geladen.
- Die drei Servicekarten verwenden lokale, KI-generierte Illustrationen. Sie werden ausdrücklich nicht als Portfolio oder ausgeführte Aufträge dargestellt.

## Inhalte

- Leistungen: Rückbau, Wohnungsaufbereitung, Objektservice.
- Zielgruppen: private Auftraggeber, Vermieter und Hausverwaltungen.
- Kontakt: E-Mail und WhatsApp; die bestätigten Links sind direkt im CTA eingebunden.
- Anfrageformular: Resend-Integration vorbereitet, mit serverseitiger Validierung, Dateitypprüfung, Honeypot und In-Memory-Rate-Limit.
- Rechtliche Seiten: `/impressum` und `/datenschutzerklaerung`.
- Ortsangaben erscheinen nicht in Werbetexten. Die bestätigte Anschrift steht in den rechtlichen Seiten.

## Registry-Quellen

- `components.json` konfiguriert den bestehenden shadcn MCP mit den Namespaces `@tailark-oss` und `@shadcnblocks`; ein zweiter MCP-Server und Ruflo wurden nicht angelegt.
- Als einheitlicher visueller Ausgangspunkt wurden die kostenlosen Shadcnblocks Radix Nova-Varianten `hero1`, `feature1`, `faq1` und `contact2` per `shadcn add` abgerufen und anschließend für NEUSTAND angepasst.
- Tailark OSS ist als kostenloser Namespace erreichbar und wurde mit `shadcn view` geprüft; seine Blöcke wurden nicht mit dem Nova-Satz gemischt.
- Shadcnblocks Free Blocks sind für die Nutzung in einem Endprodukt freigegeben, aber nicht MIT/open-source; sie dürfen nicht als eigene Komponentenbibliothek weiterverkauft oder gespiegelt werden.

## Technische Umsetzung

- Next.js 16.3.8, React 19.3.0, React DOM 19.3.0, TypeScript 5.9.3.
- Lokale Bilder werden über `next/image` mit `fill`, `sizes`, festem Medienrahmen und konfigurierten AVIF/WebP-Formaten ausgeliefert.
- Keine Analytics, Karten, Tracker, eingebetteten Inhalte oder nicht erforderlichen Cookies. Google Fonts werden nicht zur Laufzeit von Google geladen, sondern durch `next/font/google` in den Next.js-Build integriert.
- `npm run build` erzeugt statische App-Routen für Startseite, Impressum und Datenschutzerklärung.

## Vor Veröffentlichung

- In Impressum und Datenschutzerklärung offene tatsächliche Angaben bestätigen: Rechtsform, Register-/Steuerangaben, ggf. Aufsicht, Hosting-Anbieter, Serverstandort, Logfile-Fristen und Datenschutzkontakt.
- Hosting-Konfiguration und Datenschutztexte an den tatsächlichen Hoster und die realen Kommunikationsabläufe anpassen.
- Browser-, Accessibility- und Performance-Gates nach jeder wesentlichen Inhalts- oder Hostingänderung wiederholen.
