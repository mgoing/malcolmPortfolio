// * PortfolioLauncher.jsx
 

import { useState, useEffect } from 'react';
import './PortfolioLauncher.css';

// Swap this for a real screenshot once you have one.
// Drop a file at: public/assets/going-preview.png
// Or use any hosted URL.

const DESTINATIONS = [
  {
    key:      'portfolio',
    label:    '◈ GOING STUDIO',
    desc:     'A full interactive design portfolio — motion, brand identity, product design & frontend engineering. Built with React Bits animated components.',
    tags:     ['React', 'Motion', 'React Bits', 'Framer'],
    preview:  '/assets/axiom-preview.png',     // drop screenshot here
    href:     '/portfolio',
    btnLabel: '▶ LAUNCH PORTFOLIO',
  },
  {
    key:      'showcase',
    label:    '⬡ STYLE SHOWCASE',
    desc:     'Five radically different design styles applied to the same content — Apple Minimal, Newspaper, Nature, Luxury Editorial, and 3D Dimensional.',
    tags:     ['Design Systems', 'CSS', 'Typography', 'Motion'],
    preview:  '/assets/showcase-preview.png',  // drop screenshot here
    href:     '/showcase',
    btnLabel: '▶ LAUNCH SHOWCASE',
  },
  // ── Add future destinations here, e.g.: ──
  // {
  //   key:      'lab',
  //   label:    '⚗ EXPERIMENTS LAB',
  //   desc:     'Experimental UI components and interactions.',
  //   tags:     ['WebGL', 'Three.js'],
  //   preview:  '/assets/lab-preview.png',
  //   href:     '/lab',
  //   btnLabel: '▶ LAUNCH LAB',
  // },
];



export default function PortfolioLauncher() {
  const [phase, setPhase] = useState('idle'); // idle | collapsing | blackout | gone
  const [target, SetTarget] = useState(null); //href to nav to html

  function handleLaunch(href) {
    if (phase !== 'idle') return;

    // Phase 1 — screen collapses to horizontal bar
    SetTarget(href);
    setPhase('collapsing');

    // Phase 2 — bar fades to full black
    setTimeout(() => setPhase('blackout'), 420);

    // Phase 3 — navigate (RetroDesktop unmounts naturally)
    setTimeout(() => {

      setPhase('idle');
      SetTarget(null);
      window.location.href = href;}, 750);
      
    }

  const launching = phase !== "idle"; 

  return (
    <>
      {/* ── CRT shutdown overlay — mounts over the AppWindow ── */}
      {launching && (
        <div className={`crt-shutdown crt-shutdown--${phase}`} aria-hidden="true">
          <div className="crt-shutdown__bar" />
        </div>
      )}

      {/* ── Launcher content ── */}
      <div className="port-launcher">
        {DESTINATIONS.map(dest =>(
          <div key={dest.key} className = "port-launcher__entry">

            {/* Preview thumbnail */}
            <div className="port-launcher__thumb">
              <img
                src={dest.preview}
                alt={`${dest.label} preview`}
                className="port-launcher__img"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              {/* Scanline overlay on the thumbnail */}
              <div className="port-launcher__scanlines" aria-hidden="true" />
              <div className="port-launcher__thumb-label">{dest.label}</div>
            </div>






            {/* Description */}
            <div className="port-launcher__body">
              <p className="port-launcher__title">{dest.label}</p>
              <p className="port-launcher__desc">
                {dest.desc}
              </p>

              <div className="port-launcher__tags">
                  {dest.tags.map( t => (
                   
                  <span key={t} className="port-launcher__tag">{t}</span>
                ))}
              </div>

              {/* Launch button */}
              <button
                className={`port-launcher__btn ${launching && target === dest.href ? 'port-launcher__btn--launching' : ''}`}
                onClick={() => handleLaunch(dest.href)}
                disabled={launching}
              >


                {launching && target ===dest.href ? 
                  <span className="port-launcher__btn-dots">LAUNCHING<span>...</span></span>
                
                : dest.btnLabel
              }
              </button>
              </div>
              </div>
            ))}
              <p className="port-launcher__warn">
                ⚠ Navigates away from desktop
              </p>
            </div>
      
    </>
  );
}