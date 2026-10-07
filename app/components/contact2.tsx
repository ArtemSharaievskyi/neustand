import { ContactForm } from "./contact-form";

export function Contact2() {
  return (
    <section className="contact section" id="kontakt" aria-labelledby="contact-title">
      <div className="container contact-panel contact-panel-form">
        <div className="contact-copy-column">
          <p className="eyebrow">KONTAKT</p>
          <h2 id="contact-title">Ein Objekt vor sich?<br /><em>Lassen Sie uns anfangen.</em></h2>
          <p className="contact-copy">Beschreiben Sie kurz, was ansteht. Fotos oder Unterlagen können Sie direkt anhängen.</p>
          <p className="contact-email-label">E-Mail: <a href="mailto:neustand.service@gmail.com">neustand.service@gmail.com</a></p>
          <p className="contact-email-label">WhatsApp: <a href="https://wa.me/491623352139" target="_blank" rel="noreferrer">+49 162 3352139</a></p>
        </div>
        <div className="contact-form-shell" id="anfrage-form"><ContactForm /></div>
      </div>
    </section>
  );
}
