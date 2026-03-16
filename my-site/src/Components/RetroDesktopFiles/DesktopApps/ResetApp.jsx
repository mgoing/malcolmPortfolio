/**
 * ResetApp.jsx
 * Drop into: src/Components/RetroDesktopFiles/DesktopApps/ResetApp.jsx
 *
 * In Desktop.jsx, add:
 *   import ResetApp from './DesktopApps/ResetApp';
 *   case 'reset': return <ResetApp />;
 *
 * In DesktopIcon.jsx DEFAULT_APPS, add:
 *   {
 *     id: 'reset',
 *     title: 'Reset Session',
 *     icon: '⟳',
 *     defaultPos: { x: 120, y: 300 },
 *   }
 */

import { useState } from 'react';
import './ResetApp.css';

// Every localStorage key this app manages.
// Add new keys here if you add more persistent state in future.
const KEYS = [
  { key: 'hasSeenIntro',          label: 'Intro seen flag',          desc: 'Matrix rain & login will replay on next visit' },
  { key: 'retro_desktop_state_v1', label: 'Desktop layout',           desc: 'Window positions and open app state' },
  { key: 'retro_desktop_bg_v1',    label: 'Background preference',    desc: 'Your chosen desktop background' },
];

export default function ResetApp() {
  const [phase, setPhase] = useState('idle'); // idle | confirm | wiping

  function handleConfirm() {
    setPhase('confirm');
  }

  function handleCancel() {
    setPhase('idle');
  }

  function handleWipe() {
    setPhase('wiping');
    KEYS.forEach(({ key }) => localStorage.removeItem(key));
    // Brief delay so the user sees the wiping state before reload
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  return (
    <div className="reset-app">

      {/* Header */}
      <div className="reset-app__header">
        <span className="reset-app__icon">⟳</span>
        <div>
          <p className="reset-app__title">RESET SESSION</p>
          <p className="reset-app__subtitle">Clear all stored data and replay intro</p>
        </div>
      </div>

      <div className="reset-app__divider" />

      {/* What will be cleared */}
      <div className="reset-app__section-label">WILL BE CLEARED</div>
      <ul className="reset-app__key-list">
        {KEYS.map(({ key, label, desc }) => {
          const exists = localStorage.getItem(key) !== null;
          return (
            <li key={key} className={`reset-app__key-item ${!exists ? 'reset-app__key-item--empty' : ''}`}>
              <span className="reset-app__key-icon">{exists ? '■' : '□'}</span>
              <div>
                <p className="reset-app__key-label">{label}</p>
                <p className="reset-app__key-desc">{desc}</p>
              </div>
              {!exists && <span className="reset-app__key-status">EMPTY</span>}
            </li>
          );
        })}
      </ul>

      <div className="reset-app__divider" />

      {/* Action area */}
      {phase === 'idle' && (
        <div className="reset-app__actions">
          <p className="reset-app__warning">
            ⚠ This will reload the page and replay the full intro sequence.
          </p>
          <button className="reset-app__btn reset-app__btn--danger" onClick={handleConfirm}>
            RESET ALL DATA
          </button>
        </div>
      )}

      {phase === 'confirm' && (
        <div className="reset-app__confirm">
          <p className="reset-app__confirm-text">
            Are you sure? All desktop state will be lost.
          </p>
          <div className="reset-app__confirm-btns">
            <button className="reset-app__btn reset-app__btn--danger" onClick={handleWipe}>
              YES, WIPE &amp; RELOAD
            </button>
            <button className="reset-app__btn reset-app__btn--ghost" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      {phase === 'wiping' && (
        <div className="reset-app__wiping">
          <span className="reset-app__wipe-icon">⟳</span>
          <p className="reset-app__wipe-text">WIPING... RELOADING</p>
        </div>
      )}

    </div>
  );
}