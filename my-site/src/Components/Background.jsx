// src/components/Background.jsx
import React, { useEffect, useState } from 'react';
import FaultyTerminal from './FaultyTerminal.jsx'; // <- your local file (FaultyTerminal.jsx)

export default function Background() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showHandler = (e) => {
      // Accept either a boolean in detail.visible or no detail (treat as "show")
      const dv = e?.detail?.visible;
      setVisible(typeof dv === 'boolean' ? dv : true);
    };
    const hideHandler = (e) => {
      const dv = e?.detail?.visible;
      setVisible(typeof dv === 'boolean' ? dv : false);
    };

    window.addEventListener('show-faulty-terminal', showHandler);
    window.addEventListener('hide-faulty-terminal', hideHandler);

    // If the script set this before React mounted, honour it:
    if (window.__showFaultyTerminal) setVisible(true);

    return () => {
      window.removeEventListener('show-faulty-terminal', showHandler);
      window.removeEventListener('hide-faulty-terminal', hideHandler);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="faultyTerminal"
      className="faulty-terminal-container"
      style={{ display: 'block', position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/* Render your local FaultyTerminal component here.
          If it expects props, pass them in (e.g. <FaultyTerminal foo={bar} />). */}
      <FaultyTerminal
      scale={1.5}
    gridMul={[2, 1]}
    digitSize={1.2}
    timeScale={1}
    pause={false}
    scanlineIntensity={1}
    glitchAmount={1}
    flickerAmount={1}
    noiseAmp={1}
    chromaticAberration={0}
    dither={0}
    curvature={0}
    tint="#ffffff"
    mouseReact={false}
    mouseStrength={0.5}
    pageLoadAnimation={false}
    brightness={1} />
    </div>
  );
}
