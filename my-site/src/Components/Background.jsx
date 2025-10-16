// src/components/Background.jsx
import React, { useEffect, useState } from 'react';
import FaultyTerminal from './FaultyTerminal.jsx'; 

export default function Background() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Handler when the matrix script dispatches an event
    const showHandler = (e) => {
      // your matrixRain currently just fires 'show-faulty-terminal' with no detail,
      // so treat any event as "show". If you later send detail.visible, we accept that too.
      const detailVisible = e?.detail?.visible;
      if (typeof detailVisible === 'boolean') {
        setVisible(Boolean(detailVisible));
      } else {
        setVisible(true);
      }
    };

    const hideHandler = (e) => {
      const detailVisible = e?.detail?.visible;
      if (typeof detailVisible === 'boolean') {
        setVisible(Boolean(detailVisible));
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('show-faulty-terminal', showHandler);
    window.addEventListener('hide-faulty-terminal', hideHandler);

    // If the matrix script set a global flag before React mounted, respect it:
    // (Optional: matrixRain.js can set window.__showFaultyTerminal = true before dispatching)
    if (window.__showFaultyTerminal) setVisible(true);

    return () => {
      window.removeEventListener('show-faulty-terminal', showHandler);
      window.removeEventListener('hide-faulty-terminal', hideHandler);
    };
  }, []);

  // If not visible, render nothing (keeps DOM clean and respects CSS display:none)
  if (!visible) return null;

  // Render the container; CSS class handles layout and z-index.
  // Inline style ensures display is block while mounted.
  return (
   <div style={{ width: '100%', height: '600px', position: 'relative', display: 'block', zindex: '10', ariahidden: 'true' }}>
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
    brightness={1}
  />
</div>
  );
}
