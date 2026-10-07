import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqItems = [
  {
    question: "Welche Arbeiten übernimmt NEUSTAND?",
    answer: "NEUSTAND unterstützt beim Rückbau und bei Demontagen, bei der Aufbereitung von Wohnungen sowie bei Räumungen und der geordneten Bereitstellung ausgebauter Materialien zur Abholung. Der konkrete Umfang wird vor Beginn abgestimmt.",
  },
  {
    question: "Welche Angaben helfen bei einer Anfrage?",
    answer: "Hilfreich sind eine kurze Beschreibung des Objekts, die gewünschten Arbeiten, der aktuelle Zustand und – wenn möglich – Angaben zu Räumen, Einbauten oder Belägen. Fotos können direkt über die Anfrage mitgesendet werden.",
  },
  {
    question: "Kann ich Fotos oder Unterlagen mitsenden?",
    answer: "Ja. Die Form akzeptiert JPG, PNG, WebP und PDF: bis zu 5 Dateien, maximal 5 MB je Datei und maximal 10 MB insgesamt.",
  },
  {
    question: "Wie werden Preis und Leistungsumfang vereinbart?",
    answer: "Nach der Anfrage werden die Details, der genaue Leistungsumfang und der Termin abgestimmt. Ein Preis oder Umfang wird nicht automatisch versprochen, sondern vor Beginn konkret vereinbart.",
  },
  {
    question: "Werden ausgebaute Materialien abtransportiert?",
    answer: "Ausgebautes Material kann sortiert und in bereitgestellten Behältern oder Containern zur Abholung bereitgestellt werden. Einen eigenen Abtransport oder eine Entsorgung verspricht die Website nicht.",
  },
];

export function Faq1() {
  return (
    <section className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Häufige Fragen.<br /><em>Direkte Antworten.</em></h2>
        </div>
        <Accordion type="single" collapsible className="faq-list neustand-accordion">
          {faqItems.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent><p>{faq.answer}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
