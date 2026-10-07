import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function LegalLayout({ eyebrow, title, children }: LegalLayoutProps) {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="NEUSTAND Startseite">
            <Image
              className="brand-logo"
              src="/images/logo.png"
              alt="NEUSTAND – Rückbau, Wohnungsaufbereitung, Objektservice"
              width={1942}
              height={809}
              sizes="(max-width: 680px) 132px, 156px"
              priority
            />
          </Link>
          <Link className="back-link" href="/">Zur Startseite <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main className="legal-page" id="main-content">
        <div className="container legal-content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
      <footer className="site-footer legal-footer">
        <div className="container footer-legal">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutzerklaerung">Datenschutzerklärung</Link>
          <Link href="/">NEUSTAND</Link>
        </div>
      </footer>
    </>
  );
}
