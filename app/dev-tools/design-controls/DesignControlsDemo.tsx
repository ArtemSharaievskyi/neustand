'use client';

import { useState } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import { motion } from 'motion/react';
import 'dialkit/styles.css';
import styles from './design-controls.module.css';

export default function DesignControlsDemo() {
  const [rangeValue, setRangeValue] = useState(48);
  const [showDetails, setShowDetails] = useState(false);
  const values = useDialKit('NEUSTAND preview', {
    radius: [22, 4, 48, 1],
    accent: '#ef5b25',
    lift: [0, -16, 16, 1],
    duration: [0.25, 0.05, 1, 0.05],
  });

  return (
    <div className={styles.shell}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Development only</p>
        <h1>Design controls</h1>
        <p>DialKit values drive this card and its Motion transition.</p>
      </header>

      <motion.article
        className={styles.preview}
        animate={{
          borderRadius: values.radius,
          backgroundColor: values.accent,
          transform: `translateY(${values.lift}px)`,
        }}
        transition={{ duration: values.duration, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.previewLabel}>Live preview</span>
        <strong>NEUSTAND</strong>
        <span>Move the DialKit controls to tune this surface.</span>
      </motion.article>

      <section className={styles.controls} aria-label="daisyUI component smoke check">
        <label className={styles.rangeLabel} htmlFor="daisy-range">
          Sample range <output>{rangeValue}</output>
        </label>
        <input
          id="daisy-range"
          type="range"
          min="0"
          max="100"
          value={rangeValue}
          onChange={(event) => setRangeValue(Number(event.currentTarget.value))}
          className="tw:d-range tw:d-range-primary"
        />
        <button
          type="button"
          className="tw:d-btn tw:d-btn-primary"
          onClick={() => setShowDetails((current) => !current)}
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
        {showDetails ? <p className={styles.details}>The daisyUI button and range are scoped to this development panel.</p> : null}
      </section>

      <DialRoot position="top-right" theme="dark" />
    </div>
  );
}
