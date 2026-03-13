/**
 * PortfolioLauncher.jsx
 *
 * Drop this file into: src/Components/RetroDesktopFiles/DesktopApps/PortfolioLauncher.jsx
 *
 * Then in Desktop.jsx, update case 'portfolio' in AppContent:
 *
 *   import PortfolioLauncher from './DesktopApps/PortfolioLauncher';
 *   ...
 *   case 'portfolio':
 *     return <PortfolioLauncher />;
 *
 * The existing SiteExamples content moves to a different case ID if you
 * still want it, e.g. case 'siteExamples': return <SiteExamples openApp={openApp} />;
 */

import { useState, useEffect } from 'react';
import './PortfolioLauncher.css';

// Swap this for a real screenshot once you have one.
// Drop a file at: public/assets/going-preview.png
// Or use any hosted URL.
const PREVIEW_SRC = '/assets/going-preview.png';

export default function PortfolioLauncher() {
  const [phase, setPhase] = useState('idle'); // idle | collapsing | blackout | gone

  function handleLaunch() {
    if (phase !== 'idle') return;

    // Phase 1 — screen collapses to horizontal bar
    setPhase('collapsing');

    // Phase 2 — bar fades to full black
    setTimeout(() => setPhase('blackout'), 420);

    // Phase 3 — navigate (RetroDesktop unmounts naturally)
    setTimeout(() => {
      window.location.href = '/portfolio';
    }, 750);
  }

  return (
    <>
      {/* ── CRT shutdown overlay — mounts over the ENTIRE viewport ── */}
      {phase !== 'idle' && (
        <div className={`crt-shutdown crt-shutdown--${phase}`} aria-hidden="true">
          <div className="crt-shutdown__bar" />
        </div>
      )}

      {/* ── Launcher content ── */}
      <div className="port-launcher">

        {/* Preview thumbnail */}
        <div className="port-launcher__thumb">
          <img
            src={PREVIEW_SRC}
            alt="Going Studio portfolio preview"
            className="port-launcher__img"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Scanline overlay on the thumbnail */}
          <div className="port-launcher__scanlines" aria-hidden="true" />
          <div className="port-launcher__thumb-label">GOING.STUDIO</div>
        </div>

        {/* Description */}
        <div className="port-launcher__body">
          <p className="port-launcher__title">◈ GOING STUDIO</p>
          <p className="port-launcher__desc">
            A full interactive design portfolio — motion, brand identity,
            product design &amp; frontend engineering. Built with React Bits
            animated components.
          </p>

          <div className="port-launcher__tags">
            {['React', 'Motion', 'React Bits', 'Framer'].map(t => (
              <span key={t} className="port-launcher__tag">{t}</span>
            ))}
          </div>

          {/* Launch button */}
          <button
            className={`port-launcher__btn ${phase !== 'idle' ? 'port-launcher__btn--launching' : ''}`}
            onClick={handleLaunch}
            disabled={phase !== 'idle'}
          >
            {phase === 'idle' ? (
              <>▶ LAUNCH PORTFOLIO</>
            ) : (
              <span className="port-launcher__btn-dots">LAUNCHING<span>...</span></span>
            )}
          </button>

          <p className="port-launcher__warn">
            ⚠ Navigates away from desktop
          </p>
        </div>
      </div>
    </>
  );
}