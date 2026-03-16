/**
 * TerminalIntro.jsx
 *
 * Drop into: src/Components/TerminalIntro.jsx
 *
 * Props:
 *   onSuccess: () => void   — called when user submits any password
 *
 * In App.jsx replace MatrixRain + NavWindow + DecryptedEffect with:
 *   <TerminalIntro onSuccess={handleAuthSuccess} />
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import './TerminalIntro.css';

// ─── ASCII banner (printed instantly as a block before typewriter starts) ───
const ASCII_BANNER = `
  ██████╗  ██████╗ ██╗███╗   ██╗ ██████╗
 ██╔════╝ ██╔═══██╗██║████╗  ██║██╔════╝
 ██║  ███╗██║   ██║██║██╔██╗ ██║██║  ███╗
 ██║   ██║██║   ██║██║██║╚██╗██║██║   ██║
 ╚██████╔╝╚██████╔╝██║██║ ╚████║╚██████╔╝
  ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
  SYSTEMS  //  Malcolm Going  //  v2.1.0
`.trimStart();

// ─── Boot sequence lines ─────────────────────────────────────────────────────
// Each entry: { text, tag, delay (ms after prev line finishes), speed (ms/char) }
const BOOT_LINES = [
  { text: 'BIOS v2.1.0 — GOING SYSTEMS INC.',          tag: null,     delay: 120,  speed: 22  },
  { text: 'Initializing hardware interfaces...',        tag: '[ OK ]', delay: 180,  speed: 18  },
  { text: 'Loading kernel modules...',                  tag: '[ OK ]', delay: 160,  speed: 18  },
  { text: 'Mounting filesystem...',                     tag: '[ OK ]', delay: 140,  speed: 18  },
  { text: 'Starting network services...',               tag: '[ OK ]', delay: 200,  speed: 18  },
  { text: 'Verifying user permissions...',              tag: '[ OK ]', delay: 160,  speed: 18  },
];

const SYSTEM_READY_LINE = '-- SYSTEM READY --';

const WARNING_LINES = [
  '┌─────────────────────────────────────────┐',
  '│  ⚠  CLASSIFIED ACCESS ONLY              │',
  '│  Unauthorized access is prohibited.     │',
  '│  All activity is logged and monitored.  │',
  '└─────────────────────────────────────────┘',
];

const IDLE_HINT = '[WARN] No input detected. Try any password.';
const IDLE_TIMEOUT_MS = 7000;

// How long each typed char stays visible before becoming '*'
const CHAR_FLASH_MS = 120;

// ─── Phases ──────────────────────────────────────────────────────────────────
// banner → booting → ready → warning → prompt → granted → crt
const PHASE = {
  BANNER:   'banner',
  BOOTING:  'booting',
  READY:    'ready',
  WARNING:  'warning',
  PROMPT:   'prompt',
  GRANTED:  'granted',
  CRT:      'crt',
};

export default function TerminalIntro({ onSuccess }) {
  const [phase, setPhase]           = useState(PHASE.BANNER);
  const [bootIndex, setBootIndex]   = useState(0);   // which BOOT_LINE we're on
  const [lineText, setLineText]     = useState('');   // current line being typed
  const [doneLines, setDoneLines]   = useState([]);   // fully typed lines
  const [showReady, setShowReady]   = useState(false);
  const [warningIdx, setWarningIdx] = useState(0);    // which warning line next
  const [password, setPassword]     = useState([]);   // array of {char, masked}
  const [idleHint, setIdleHint]     = useState(false);
  const [grantedText, setGrantedText] = useState('');

   const onSuccessRef  = useRef(onSuccess);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
  const [visible, setVisible] = useState(true);

  const inputRef   = useRef(null);
  const idleTimer  = useRef(null);
  const glitchRef  = useRef(null);

  // ── Focus input whenever prompt is active ──
  useEffect(() => {
    if (phase === PHASE.PROMPT) {
      inputRef.current?.focus();
      startIdleTimer();
    }
    return () => clearIdleTimer();
  }, [phase]);

  // ── Random glitch flicker ──
  useEffect(() => {
    const scheduleGlitch = () => {
      const next = 3000 + Math.random() * 7000;
      glitchRef.current = setTimeout(() => {
        const el = document.getElementById('terminal-glitch-overlay');
        if (el) {
          el.classList.add('terminal__glitch--active');
          setTimeout(() => el.classList.remove('terminal__glitch--active'), 80 + Math.random() * 120);
        }
        scheduleGlitch();
      }, next);
    };
    scheduleGlitch();
    return () => clearTimeout(glitchRef.current);
  }, []);

  // ─── Phase: BANNER ───────────────────────────────────────────────────────
  // Banner appears instantly (pre-formatted), then moves to BOOTING
  useEffect(() => {
    if (phase !== PHASE.BANNER) return;
    const t = setTimeout(() => setPhase(PHASE.BOOTING), 600);
    return () => clearTimeout(t);
  }, [phase]);

  // ─── Phase: BOOTING ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.BOOTING) return;
    if (bootIndex >= BOOT_LINES.length) {
      setPhase(PHASE.READY);
      return;
    }

    const line = BOOT_LINES[bootIndex];
    let charIdx = 0;
    setLineText('');

    const startTyping = () => {
      const interval = setInterval(() => {
        charIdx++;
        setLineText(line.text.slice(0, charIdx));
        if (charIdx >= line.text.length) {
          clearInterval(interval);
          // Commit finished line with optional tag
          setDoneLines(prev => [...prev, { text: line.text, tag: line.tag }]);
          setLineText('');
          setTimeout(() => setBootIndex(i => i + 1), line.delay);
        }
      }, line.speed);
      return interval;
    };

    const delayTimer = setTimeout(() => {
      const iv = startTyping();
      return () => clearInterval(iv);
    }, line.delay);

    return () => clearTimeout(delayTimer);
  }, [phase, bootIndex]);

  // ─── Phase: READY ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.READY) return;
    const t = setTimeout(() => {
      setShowReady(true);
      setTimeout(() => setPhase(PHASE.WARNING), 900);
    }, 300);
    return () => clearTimeout(t);
  }, [phase]);

  // ─── Phase: WARNING ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.WARNING) return;
    if (warningIdx >= WARNING_LINES.length) {
      setTimeout(() => setPhase(PHASE.PROMPT), 400);
      return;
    }
    const t = setTimeout(() => setWarningIdx(i => i + 1), 90);
    return () => clearTimeout(t);
  }, [phase, warningIdx]);

  // ─── Idle timer ───────────────────────────────────────────────────────────
  function startIdleTimer() {
    clearIdleTimer();
    idleTimer.current = setTimeout(() => setIdleHint(true), IDLE_TIMEOUT_MS);
  }
  function clearIdleTimer() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }
  function resetIdleTimer() {
    setIdleHint(false);
    startIdleTimer();
  }

  // ─── Password input ───────────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (phase !== PHASE.PROMPT) return;
    resetIdleTimer();

    if (e.key === 'Enter') {
      if (password.length === 0) return; // require at least one char
      handleSubmit();
      return;
    }
    if (e.key === 'Backspace') {
      setPassword(prev => prev.slice(0, -1));
      return;
    }
    // Ignore non-printable keys
    if (e.key.length !== 1) return;

    const char = e.key;
    const idx = password.length;

    // Add char as visible briefly, then mask
    setPassword(prev => [...prev, { char, masked: false }]);
    setTimeout(() => {
      setPassword(prev =>
        prev.map((c, i) => i === idx ? { ...c, masked: true } : c)
      );
    }, CHAR_FLASH_MS);
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  function handleSubmit() {
    clearIdleTimer();
    setPhase(PHASE.GRANTED);

    // Type out ACCESS GRANTED
    const msg = 'ACCESS GRANTED — WELCOME, MALCOLM.';
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setGrantedText(msg.slice(0, i));
      if (i >= msg.length) {
        clearInterval(iv);
        // Short pause then CRT power-on
        setTimeout(() => setPhase(PHASE.CRT), 700);
      }
    }, 28);
  }

  // ─── CRT power-on → call onSuccess ───────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.CRT) return;
    // CRT animation is ~900ms, then hand off
    const t = setTimeout(() =>{ onSuccess();
    setVisible(false);    
    }, 950);
    return () => clearTimeout(t);
  }, [phase]); //removed , onSuccess

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!visible) return null;
  return (
    <div
      className={`terminal ${phase === PHASE.CRT ? 'terminal--crt-on' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* CRT effects */}
      <div className="terminal__scanlines" />
      <div className="terminal__vignette" />
      <div className="terminal__curvature" />
      <div id="terminal-glitch-overlay" className="terminal__glitch" />

      {/* Screen content */}
      <div className="terminal__screen">

        {/* ASCII banner */}
        {(phase !== PHASE.BANNER) && (
          <pre className="terminal__banner">{ASCII_BANNER}</pre>
        )}
        {phase === PHASE.BANNER && (
          <pre className="terminal__banner terminal__banner--typing">{ASCII_BANNER}</pre>
        )}

        {/* Completed boot lines */}
        {doneLines.map((line, i) => (
          <div key={i} className="terminal__line">
            <span className="terminal__line-text">{line.text}</span>
            {line.tag && <span className="terminal__tag">{line.tag}</span>}
          </div>
        ))}

        {/* Currently typing boot line */}
        {phase === PHASE.BOOTING && lineText && (
          <div className="terminal__line">
            <span className="terminal__line-text">{lineText}</span>
            <span className="terminal__cursor" />
          </div>
        )}

        {/* SYSTEM READY */}
        {showReady && (
          <div className="terminal__line terminal__line--ready">
            {SYSTEM_READY_LINE}
          </div>
        )}

        {/* Warning block */}
        {warningIdx > 0 && WARNING_LINES.slice(0, warningIdx).map((l, i) => (
          <div key={i} className="terminal__line terminal__line--warn">{l}</div>
        ))}

        {/* Password prompt */}
        {(phase === PHASE.PROMPT || phase === PHASE.GRANTED) && (
          <div className="terminal__prompt-wrap">
            <div className="terminal__line terminal__line--prompt-label">
              ENTER PASSWORD:
            </div>
            <div className="terminal__line terminal__line--input">
              <span className="terminal__prompt-sym">{'> '}</span>
              <span className="terminal__password">
                {password.map((c, i) => (
                  <span
                    key={i}
                    className={`terminal__char ${!c.masked ? 'terminal__char--visible' : ''}`}
                  >
                    {c.masked ? '*' : c.char}
                  </span>
                ))}
              </span>
              {phase === PHASE.PROMPT && (
                <span className="terminal__cursor terminal__cursor--input" />
              )}
            </div>

            {/* Idle hint */}
            {idleHint && (
              <div className="terminal__line terminal__line--hint">{IDLE_HINT}</div>
            )}
          </div>
        )}

        {/* ACCESS GRANTED */}
        {phase === PHASE.GRANTED && grantedText && (
          <div className="terminal__line terminal__line--granted">
            {grantedText}
            <span className="terminal__cursor" />
          </div>
        )}

        {/* Hidden input to capture keyboard on mobile too */}
        <input
          ref={inputRef}
          className="terminal__hidden-input"
          onKeyDown={handleKeyDown}
          readOnly
          aria-hidden="true"
        />
      </div>

      {/* CRT power-on overlay */}
      {phase === PHASE.CRT && <div className="terminal__crt-expand" />}
    </div>
  );
}