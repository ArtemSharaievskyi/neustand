import { LegalLayout } from "../components/legal-layout";

export default function ImpressumPage() {
  return (
    <LegalLayout eyebrow="RECHTLICHES" title="Impressum">
      <p className="legal-lede">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).</p>

      <h2>Anbieter</h2>
      <address>
        Artem Sharaievskyi<br />
        handelnd unter der Geschäftsbezeichnung<br />
        NEUSTAND – Rückbau · Wohnungsaufbereitung · Objektservice<br /><br />
        Danziger Straße 6<br />
        35410 Hungen
      </address>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+491623352139">+49 162 3352139</a><br />
        E-Mail: <a href="mailto:neustand.service@gmail.com">neustand.service@gmail.com</a><br />
        Kontakt auch über <a href="https://wa.me/491623352139" target="_blank" rel="noreferrer">WhatsApp</a>.
      </p>

      <h2>Weitere Angaben</h2>
      <p>Die folgenden Angaben werden vor einer Veröffentlichung ergänzt, sobald sie bestätigt sind:</p>
      <ul>
        <li>Rechtsform, sofern sie über die vorstehenden Angaben hinaus auszuweisen ist</li>
        <li>Vertretungsberechtigte Person, sofern abweichend oder zusätzlich erforderlich</li>
        <li>Registereintrag und Registernummer, sofern vorhanden</li>
        <li>Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer, sofern vorhanden bzw. erforderlich</li>
        <li>zuständige Aufsichtsbehörde, sofern eine Tätigkeit einer behördlichen Zulassung oder Aufsicht unterliegt</li>
        <li>journalistisch-redaktionell verantwortliche Person, sofern solche Inhalte angeboten werden</li>
      </ul>

      <p className="legal-note">Diese Seite ist ein nicht veröffentlichtes Arbeitsstadium. Die offenen Punkte müssen vor dem Livegang rechtlich und faktisch geprüft werden.</p>
    </LegalLayout>
  );
}
