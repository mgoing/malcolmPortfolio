// ============================================================
// GuideOverlay.jsx  —  NEW FILE
// Renders:
//   • Cyan glowing border positioned over the target element
//   • Bouncing scroll arrow (step type === 'scroll')
//   • Fixed bottom-right HUD chip with instruction text + skip
//   • "You're all set!" completion toast
//
// Props:
//   guideStep   {number}   current step index (0-based), -1 = complete
//   onSkip      {fn}       called when user clicks Skip
//   onAdvance   {fn}       called by scroll/resize listeners internally
//                          (open-app / click / taskbar advances come from
//                           Desktop.jsx via guideStep prop change)
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GUIDE_STEPS, GUIDE_TOTAL } from './GuideSteps';

// ── Keyframe styles injected once ───────────────────────────
const STYLE_ID = 'guide-overlay-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes guide-flash {
      0%   { box-shadow: 0 0 0px 0px rgba(0,255,220,0); opacity: 0; }
      15%  { box-shadow: 0 0 32px 8px rgba(0,255,220,0.95); opacity: 1; }
      35%  { box-shadow: 0 0 18px 4px rgba(0,255,220,0.6);  opacity: 1; }
      55%  { box-shadow: 0 0 30px 7px rgba(0,255,220,0.9);  opacity: 1; }
      100% { box-shadow: 0 0 14px 3px rgba(0,255,220,0.55); opacity: 1; }
    }
    @keyframes guide-pulse {
      0%, 100% { box-shadow: 0 0 14px 3px rgba(0,255,220,0.55); }
      50%       { box-shadow: 0 0 26px 7px rgba(0,255,220,0.85); }
    }
    @keyframes guide-bounce-arrow {
      0%, 100% { transform: translateY(0);   opacity: 0.9; }
      50%       { transform: translateY(8px); opacity: 1;   }
    }
    @keyframes guide-hud-in {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes guide-done-in {
      0%   { opacity: 0; transform: translateY(20px) scale(0.9); }
      60%  { opacity: 1; transform: translateY(-4px) scale(1.03); }
      100% { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes guide-done-out {
      from { opacity: 1; }
      to   { opacity: 0; transform: translateY(-10px); }
    }

    .guide-glow-ring {
      position: fixed;
      pointer-events: none;
      border-radius: 6px;
      border: 2px solid rgba(0,255,220,0.9);
      animation: guide-flash 0.7s ease-out forwards,
                 guide-pulse 2s ease-in-out 0.7s infinite;
      z-index: 9998;
      transition: top 0.25s, left 0.25s, width 0.25s, height 0.25s;
    }

    .guide-scroll-arrow {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      animation: guide-bounce-arrow 1s ease-in-out infinite;
      font-size: 22px;
      color: rgba(0,255,220,0.95);
      text-shadow: 0 0 10px rgba(0,255,220,0.8);
      filter: drop-shadow(0 0 6px rgba(0,255,220,0.7));
    }

    .guide-hud-chip {
      position: fixed;
      bottom: 56px;
      right: 16px;
      z-index: 9999;
      background: rgba(0,14,22,0.96);
      border: 1px solid rgba(0,255,220,0.35);
      border-radius: 8px;
      padding: 10px 14px;
      max-width: 280px;
      box-shadow: 0 0 18px rgba(0,255,220,0.15), 0 4px 24px rgba(0,0,0,0.6);
      animation: guide-hud-in 0.35s ease-out forwards;
      font-family: 'Courier New', monospace;
    }

    .guide-done-toast {
      position: fixed;
      bottom: 56px;
      right: 16px;
      z-index: 9999;
      background: rgba(0,14,22,0.97);
      border: 1px solid rgba(0,255,220,0.5);
      border-radius: 8px;
      padding: 14px 18px;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 30px rgba(0,255,220,0.2), 0 4px 24px rgba(0,0,0,0.6);
    }
    .guide-done-toast.entering {
      animation: guide-done-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
    }
    .guide-done-toast.exiting {
      animation: guide-done-out 0.5s ease-in forwards;
    }
  `;
  document.head.appendChild(el);
}

// ── Utility: get bounding rect of a data-guide element ──────
function getRectByGuide(selector) {
  const el = document.querySelector(`[data-guide="${selector}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

// ── Main component ───────────────────────────────────────────
export default function GuideOverlay({ guideStep, onSkip, onAdvance }) {
  useEffect(() => { injectStyles(); }, []);

  const [ringRect, setRingRect]     = useState(null);
  const [arrowPos, setArrowPos]     = useState(null);
  const [doneState, setDoneState]   = useState('hidden'); // 'hidden' | 'entering' | 'exiting'
  const scrollListenerRef           = useRef(null);
  const resizeObserverRef           = useRef(null);
  const rafRef                      = useRef(null);

  const step = guideStep >= 0 && guideStep < GUIDE_TOTAL
    ? GUIDE_STEPS[guideStep]
    : null;

  // ── Completion toast ───────────────────────────────────────
  useEffect(() => {
    if (guideStep === GUIDE_TOTAL) {
      setDoneState('entering');
      const exitTimer = setTimeout(() => setDoneState('exiting'), 3200);
      const hideTimer = setTimeout(() => setDoneState('hidden'), 3800);
      return () => { clearTimeout(exitTimer); clearTimeout(hideTimer); };
    }
  }, [guideStep]);

  // ── Position the glow ring ─────────────────────────────────
  const updateRing = useCallback(() => {
    if (!step) { setRingRect(null); setArrowPos(null); return; }

    const rect = getRectByGuide(step.target);
    if (!rect) { setRingRect(null); return; }

    const PAD = 4;
    setRingRect({
      top:    rect.top    - PAD,
      left:   rect.left   - PAD,
      width:  rect.width  + PAD * 2,
      height: rect.height + PAD * 2,
    });

    // Scroll arrow sits at bottom-center of the window body
    if (step.type === 'scroll') {
      setArrowPos({
        left: rect.left + rect.width / 2 - 11,
        top:  rect.top  + rect.height - 36,
      });
    } else {
      setArrowPos(null);
    }
  }, [step]);

  // Reposition on every animation frame while step is active
  useEffect(() => {
    if (!step) { setRingRect(null); setArrowPos(null); return; }
    let running = true;
    function loop() {
      if (!running) return;
      updateRing();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [step, updateRing]);

  // ── Scroll listener (step type === 'scroll') ───────────────
  useEffect(() => {
    // Clean up previous listener
    if (scrollListenerRef.current) {
      const { el, fn } = scrollListenerRef.current;
      el.removeEventListener('scroll', fn);
      scrollListenerRef.current = null;
    }

    if (!step || step.type !== 'scroll') return;

    // Small delay to let the window render
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-guide="${step.target}"]`);
      if (!el) return;

      function handleScroll() {
        const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
        if (pct >= 0.5) {
          el.removeEventListener('scroll', handleScroll);
          scrollListenerRef.current = null;
          onAdvance();
        }
      }

      el.addEventListener('scroll', handleScroll, { passive: true });
      scrollListenerRef.current = { el, fn: handleScroll };
    }, 400);

    return () => {
      clearTimeout(timer);
      if (scrollListenerRef.current) {
        const { el, fn } = scrollListenerRef.current;
        el.removeEventListener('scroll', fn);
        scrollListenerRef.current = null;
      }
    };
  }, [step, onAdvance]);

  // ── Resize observer (step type === 'resize') ───────────────
  useEffect(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    if (!step || step.type !== 'resize') return;

    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-guide="${step.target}"]`);
      if (!el) return;

      let initialSize = { w: el.offsetWidth, h: el.offsetHeight };
      let hasResized  = false;

      const ro = new ResizeObserver(entries => {
        if (hasResized) return;
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (
            Math.abs(width  - initialSize.w) > 10 ||
            Math.abs(height - initialSize.h) > 10
          ) {
            hasResized = true;
            ro.disconnect();
            resizeObserverRef.current = null;
            onAdvance();
          }
        }
      });

      ro.observe(el);
      resizeObserverRef.current = ro;
    }, 400);

    return () => {
      clearTimeout(timer);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [step, onAdvance]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* Glow ring */}
      {ringRect && (
        <div
          key={step?.id}   // re-triggers flash animation on step change
          className="guide-glow-ring"
          style={{
            top:    ringRect.top,
            left:   ringRect.left,
            width:  ringRect.width,
            height: ringRect.height,
          }}
        />
      )}

      {/* Scroll arrow */}
      {arrowPos && (
        <div
          className="guide-scroll-arrow"
          style={{ top: arrowPos.top, left: arrowPos.left }}
        >
          ↓
        </div>
      )}

      {/* HUD chip */}
      {step && (
        <div key={`hud-${step.id}`} className="guide-hud-chip">
          {/* Step counter */}
          <div style={{ color: 'rgba(0,255,220,0.5)', fontSize: '10px', marginBottom: 4, letterSpacing: '0.1em' }}>
            GUIDE  {guideStep + 1} / {GUIDE_TOTAL}
          </div>

          {/* Instruction */}
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: 1.5 }}>
            {step.instruction}
          </div>

          {/* Skip */}
          <button
            onClick={onSkip}
            style={{
              marginTop: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 4,
              color: 'rgba(255,255,255,0.4)',
              fontSize: '10px',
              fontFamily: 'inherit',
              padding: '3px 8px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,80,80,0.8)';
              e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            SKIP GUIDE
          </button>
        </div>
      )}

      {/* Completion toast */}
      {doneState !== 'hidden' && (
        <div className={`guide-done-toast ${doneState}`}>
          <div style={{ color: 'rgba(0,255,220,0.9)', fontSize: '13px', fontWeight: 'bold', marginBottom: 4 }}>
            ✓ You're all set!
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: 1.5 }}>
            Explore the desktop freely.<br />Settings are saved automatically.
          </div>
        </div>
      )}
    </>
  );
}