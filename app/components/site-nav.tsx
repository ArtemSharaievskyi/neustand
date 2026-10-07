"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="NEUSTAND Startseite" onClick={closeMenu}>
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

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? "Navigation schließen" : "Navigation öffnen"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <nav
          className={`primary-nav${isOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Hauptnavigation"
        >
          <Link href="/#leistungen" onClick={closeMenu}>Leistungen</Link>
          <Link href="/#ablauf" onClick={closeMenu}>Ablauf</Link>
          <Link href="/#faq" onClick={closeMenu}>Häufige Fragen</Link>
          <Link href="/#kontakt" onClick={closeMenu}>Kontakt</Link>
          <Link className="nav-cta" href="/#anfrage-form" onClick={closeMenu}>
            Anfrage senden <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
