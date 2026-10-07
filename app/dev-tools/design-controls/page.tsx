import { notFound } from 'next/navigation';
import './design-controls.css';
import styles from './design-controls.module.css';
import DesignControlsDemo from './DesignControlsDemo';

export default function DesignControlsPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return (
    <main id="design-tools-panel" data-theme="light" className={styles.page}>
      <DesignControlsDemo />
    </main>
  );
}
