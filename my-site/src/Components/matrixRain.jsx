import React, { useEffect, useRef } from 'react';

/**
 * MatrixRain component
 * - Mount this in your App while you want the intro to run.
 * - It will auto-hide itself after the intro and dispatch the same events
 *   your previous script did so the rest of your app can stay unchanged.
 */
export default function MatrixRain({
  introMs = 7000,      // how long before fade out starts (ms)
  frameInterval = 50,  // legacy interval equivalent (unused directly, kept for familiarity)
  fontSize = 16,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const fadeRef = useRef(null);
  const dropsRef = useRef([]);
  const columnsRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // full screen styling (can also be in CSS)
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999'; // set low or change if you want it behind some UI
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    // 2D context with alpha allowed so background can be transparent later
    const ctx = canvas.getContext('2d', { alpha: true });

    // characters used in the matrix
    const characters =
      'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // device pixel ratio aware sizing
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // set font scaled by DPR on context
      ctx.font = `${fontSize * dpr}px monospace`;

      // compute columns and reset drops
      columnsRef.current = Math.floor(canvas.width / (fontSize * (window.devicePixelRatio || 1)));
      dropsRef.current = Array.from({ length: columnsRef.current }, () => Math.random() * -20);
    }

    // initial size
    resize();
    window.addEventListener('resize', resize);

    // draw loop using requestAnimationFrame (keeps smoother)
    function draw() {
      // slight fade the previous frame with a semi-transparent rect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // set font again (in case)
      const dpr = window.devicePixelRatio || 1;
      ctx.font = `${fontSize * dpr}px monospace`;

      // draw each column drop
      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * (fontSize * (window.devicePixelRatio || 1));
        const y = drops[i] * (fontSize * (window.devicePixelRatio || 1));

        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.9 + Math.random() * 0.5;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // start draw
    rafRef.current = requestAnimationFrame(draw);

    // Fade-out logic (after introMs). Uses requestAnimationFrame for smooth opacity animation.
    let fadeStarted = false;
    let fadeStartTs = null;
    const fadeDuration = 700; // ms for fade to complete (you can tune this)
    const fadeDelay = introMs; // start after introMs




    function fadeTick(ts) {
      if (!fadeStarted) {
        fadeStarted = true;
        fadeStartTs = ts;
      }

      const preloader = document.getElementById('preloader');
if (preloader) preloader.style.display = 'none';
      const elapsed = ts - fadeStartTs;
      const progress = Math.min(1, elapsed / fadeDuration);
      const opacity = 1 - progress;
      canvas.style.opacity = String(opacity);

      if (progress >= 1) {
        // fade complete
        // stop animation loop
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }

        // final cleanup
        canvas.style.display = 'none';

        // Legacy compatibility: show mainContent if present
        const mainElThing = document.getElementById('mainContent');
        if (mainElThing) mainElThing.style.display = 'block';

        // Dispatch events (same as your previous script)
        window.__showFaultyTerminal = true;
        window.dispatchEvent(new CustomEvent('show-faulty-terminal', { detail: { visible: true } }));

        window.__navDecrypted = true;
        window.dispatchEvent(new CustomEvent('nav-decrypted', { detail: { visible: true } }));

        // Call startNavigation if defined (keeps old handoff behavior)
        if (typeof window.startNavigation === 'function') {
          try {
            window.startNavigation();
          } catch (err) {
            // swallow errors - don't break page
            console.error('startNavigation() threw an error:', err);
          }
        }

        // stop fade loop
        if (fadeRef.current) {
          cancelAnimationFrame(fadeRef.current);
          fadeRef.current = null;
        }

        return; // stop
      }

      // continue fading
      fadeRef.current = requestAnimationFrame(fadeTick);
    }

    // schedule fade after delay
    const fadeTimeout = setTimeout(() => {
      // start fade via rAF to have smoother animation frames
      fadeRef.current = requestAnimationFrame(fadeTick);
    }, fadeDelay);

    // cleanup on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      clearTimeout(fadeTimeout);
      window.removeEventListener('resize', resize);
      // reset canvas display in case of unmount before fade end
      try {
        canvas.style.display = 'none';
      } catch (err) {
        /* ignore */
      }
    };
  }, [introMs, fontSize]);

  // render the canvas element
  return <canvas id="matrixCanvas" ref={canvasRef} />;
}
