import { LegalLayout } from "../components/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout eyebrow="RECHTLICHES" title="Datenschutzerklärung">
      <p className="legal-lede">Hinweise zur Datenverarbeitung auf Grundlage der aktuell implementierten Website-Funktionen.</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für diese Website ist Artem Sharaievskyi, handelnd unter der Geschäftsbezeichnung NEUSTAND – Rückbau · Wohnungsaufbereitung · Objektservice.
      </p>
      <address>
        Danziger Straße 6<br />
        35410 Hungen<br />
        E-Mail: <a href="mailto:neustand.service@gmail.com">neustand.service@gmail.com</a><br />
        Telefon: <a href="tel:+491623352139">+49 162 3352139</a>
      </address>

      <h2>2. Umfang der aktuellen Website</h2>
      <p>
        Die Website enthält derzeit keine Analyse, keine Werbung, keine Karten, keine externen Schriftarten, keine Tracker, keine eingebetteten Drittanbieter-Inhalte und keine Nutzerkonten. Nicht erforderliche Cookies werden nicht eingesetzt; ein Cookie-Banner ist deshalb in dieser Fassung nicht vorgesehen.
      </p>

      <h2>3. Technischer Betrieb</h2>
      <p>
        Für die Auslieferung der Website werden technisch notwendige Serververbindungen aufgebaut. Welche Server-Logdaten dabei verarbeitet werden, wie lange sie gespeichert werden, wo die Verarbeitung stattfindet und wer Hosting-Anbieter ist, hängt von der noch nicht bestätigten Hosting-Konfiguration ab.
      </p>
      <p>
        Vor einer Veröffentlichung müssen daher Hosting-Anbieter, Verarbeitungsort, konkrete Logdaten, Speicherdauer, Empfänger, Rechtsgrundlage und – sofern erforderlich – ein Vertrag zur Auftragsverarbeitung ergänzt und geprüft werden.
      </p>

      <h2>4. Anfrageformular</h2>
      <p>
        Über das Formular können Vorname, Nachname, E-Mail-Adresse, Nachricht und freiwillig Fotos oder PDF-Unterlagen übermittelt werden. Anhänge werden nur im Rahmen der Anfrage verarbeitet, nicht in <code>public/</code> veröffentlicht und nicht in einer Website-Datenbank gespeichert. Die technische Verarbeitung erfolgt auf dem Server der Website und – wenn die Versandkonfiguration aktiviert ist – über den ausgewählten E-Mail-Dienstleister. Der konkrete Dienstleister, Verarbeitungsort und die Speicherfristen müssen vor Veröffentlichung bestätigt und hier ergänzt werden.
      </p>
      <p>
        Das Formular akzeptiert derzeit JPG, PNG, WebP und PDF: höchstens 5 Dateien, maximal 5 MB je Datei und maximal 10 MB insgesamt. Die Website prüft Eingabefelder, Dateianzahl, Dateigröße und den tatsächlichen Dateityp serverseitig. Ein Versand erfolgt nur bei vollständig konfiguriertem Serverdienst; ohne dessen Zugangsdaten wird keine Erfolgsmeldung angezeigt.
      </p>
      <p>
        Die Serverintegration ist für die Resend Email API vorbereitet. Sie bleibt deaktiviert, solange die in `.env.example` beschriebenen Servervariablen fehlen. Ein produktiver Versand setzt außerdem einen verifizierten Absender und die Prüfung der Resend-Datenschutz- und Auftragsverarbeitungsbedingungen voraus.
      </p>

      <h2>5. Kontakt per E-Mail und WhatsApp</h2>
      <p>
        Die Website öffnet über einen E-Mail-Link das auf Ihrem Gerät eingerichtete E-Mail-Programm. Welche Daten Sie dabei übermitteln, entscheiden Sie selbst; sie werden an den von Ihnen gewählten E-Mail-Anbieter übertragen.
      </p>
      <p>
        Der WhatsApp-Link führt zum WhatsApp-Dienst. Bei einer Kontaktaufnahme über WhatsApp gelten zusätzlich die Datenschutzinformationen des jeweiligen Anbieters. Die Website übermittelt beim bloßen Aufruf des Links keine Nachricht und erhebt über den Link selbst kein Kontaktformular.
      </p>

      <h2>6. Ihre Rechte</h2>
      <p>
        Betroffene Personen haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde.
      </p>

      <h2>7. Noch zu bestätigen</h2>
      <ul>
        <li>konkreter Hosting-Anbieter, Serverstandort und Logfile-Konfiguration</li>
        <li>Speicher- und Löschfristen für technische Serverdaten</li>
        <li>konkreter E-Mail-Dienstleister, Versandregion, Speicher- und Löschfristen sowie gegebenenfalls Auftragsverarbeitung</li>
        <li>Datenschutzkontakt und – falls gesetzlich erforderlich – Datenschutzbeauftragter</li>
        <li>konkrete Verarbeitung bei E-Mail- und WhatsApp-Kommunikation außerhalb dieser Website</li>
        <li>jede später hinzukommende Analyse, Einbettung, Schrift, Cookie- oder Drittanbieter-Funktion</li>
      </ul>

      <p className="legal-note">Diese Datenschutzerklärung beschreibt die lokale, aktuell geprüfte Fassung der Website. Vor dem Livegang muss sie an den tatsächlich ausgewählten Hoster und an die tatsächlichen Kommunikationsabläufe angepasst werden.</p>
    </LegalLayout>
  );
}
