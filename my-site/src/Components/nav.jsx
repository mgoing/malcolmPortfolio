//TODO Make pngs appear correctly
//TODO slow down decrypted effect 
//TODO make decrypted effect be visible with solid background over faulty terminal background
//TODO Make nav canvas slightly transparent
//TODO make nav canvas have faulty terminal border it
//TODO change decrypted text to have better style
//TODO Remove glowing mouse effect
//TODO Improve loop speed?
//TODO make door backgrounds work properly
// src/components/Nav.jsx


// src/components/Nav.jsx
import React, { useEffect, useRef, useState } from 'react';
import Background from './Background';
import LetterGlitch from './RComponents/LetterGlitch'; // adjust if path differs
import RetroDesktop from './RetroDesktopFiles/Desktop';

export default function NavWindow({
  outerScale = 0.8,
  innerScale = 0.8,
  navClickUrl = '/desktop', //This might be irrelevant now
  shadow = true,
   onSuccess,
}) {
  const outerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // terminal input state
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = outerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const cssW = Math.round(window.innerWidth * outerScale);
      const cssH = Math.round(window.innerHeight * outerScale);

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }

    let last = performance.now();
    let t = 0;
    function draw(now) {
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      // OPAQUE black fill for CRT shell (user requested NOT transparent)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);

      // faint vignette & green tint for CRT feel
      const dt = now - last;
      last = now;
      t += dt * 0.0004;
      const cx = cw * 0.5 + Math.sin(t * 0.9) * (cw * 0.01);
      const cy = ch * 0.5 + Math.cos(t * 0.7) * (ch * 0.01);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cw, ch) * 0.6);
      grad.addColorStop(0, 'rgba(0,255,140,0.02)');
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // thin edge glow / bezel
      ctx.lineWidth = Math.max(1 * dpr, 1);
      ctx.strokeStyle = 'rgba(0,255,140,0.035)';
      ctx.strokeRect(0.5 * dpr, 0.5 * dpr, cw - 1 * dpr, ch - 1 * dpr);

      // subtle horizontal scanlines overlay (drawn into the CRT bezel canvas)
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      const lineH = Math.max(2 * dpr, 2);
      for (let y = 0; y < ch; y += lineH * 6) {
        ctx.fillRect(0, y, cw, lineH);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [outerScale]);

  // sizes used for inline layout (read from viewport)
  const outerCssW = Math.round(window.innerWidth * outerScale);
  const outerCssH = Math.round(window.innerHeight * outerScale);
  const innerCssW = Math.round(outerCssW * innerScale);
  const innerCssH = Math.round(outerCssH * innerScale);

  // clicking the inner screen focuses the input (no accidental navigation)
  function onInnerClick(e) {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.focus();
  }

  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (String(inputValue || '').trim().length > 0) {
      // Preferred: if the parent passed onSuccess, call it so the SPA can render the desktop inline.
      if (typeof onSuccess === 'function') {
        onSuccess();
        return;
      }
    }
  }
  // key handler for terminal-feel input (Enter submits)
  function onInputKeyDown(e) {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
    // optional: prevent pasting newlines, etc.
  }

  return (
    <>
      {/* Faulty terminal background remains on the page */}
      <Background />

      <div
        className={`nav-window ${shadow ? 'nav-window--shadow' : ''}`}
        ref={outerRef}
        style={{
          width: `${outerCssW}px`,
          height: `${outerCssH}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        {/* CRT bezel / opaque black shell */}
        <canvas
          ref={canvasRef}
          className="nav-window__bezel"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none',
            borderRadius: 8,
          }}
        />

        {/* inner screen — holds LetterGlitch and the terminal prompt */}
        <div
          className="nav-window__inner"
          style={{
            width: `${innerCssW}px`,
            height: `${innerCssH}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            zIndex: 1010,
            overflow: 'hidden',
            pointerEvents: 'auto',
            cursor: 'text',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            background: '#000', // inner screen black
          }}
          onClick={onInnerClick}
          role="region"
          aria-label="Terminal screen"
        >
         

          {/* terminal prompt (overlayed) — southern hemisphere */}
          <div
            className="terminal-prompt"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '8%',
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'auto', // so input receives clicks
            }}
          >
            <div style={{ width: '70%', maxWidth: 520, minWidth: 220 }}>
              <div className="terminal-line" aria-hidden="true">
                <span className="prompt-symbol">&gt;</span>
                <span className="prompt-text"> Enter Password:</span>
              </div>

              {/* single-line input styled like terminal; no button */}
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                className="terminal-input"
                autoComplete="off"
                spellCheck={false}
                inputMode="text"
                aria-label="Enter password"
                type="password"
                placeholder=""
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}