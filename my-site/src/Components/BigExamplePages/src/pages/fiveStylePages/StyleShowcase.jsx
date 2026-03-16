import { useState } from "react";
import Style1Apple      from "./ShowcaseEntries/Style1Apple";
import Style2Local      from "./ShowcaseEntries/Style2Local";
import Style3Nature     from "./ShowcaseEntries/Style3Nature";
import Style4Luxury     from "./ShowcaseEntries/Style4Luxury";
import Style5Dimensional from "./ShowcaseEntries/Style5Dimensional";
import "./StyleShowcase.css";

const STYLES = [
  { id: 0, label: "Apple Minimal",  shortLabel: "01",  emoji: "◯", component: Style1Apple },
  { id: 1, label: "Local & Simple", shortLabel: "02",  emoji: "◫", component: Style2Local },
  { id: 2, label: "Nature",         shortLabel: "03",  emoji: "❧", component: Style3Nature },
  { id: 3, label: "Luxury",         shortLabel: "04",  emoji: "◈", component: Style4Luxury },
  { id: 4, label: "Dimensional",    shortLabel: "05",  emoji: "⬡", component: Style5Dimensional },
];

export default function StyleShowcase() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const ActiveStyle = STYLES[active].component;

  function switchStyle(id) {
    if (id === active) { setOpen(false); return; }
    setTransitioning(true);
    setTimeout(() => {
      setActive(id);
      setTransitioning(false);
      setOpen(false);
      window.scrollTo({ top: 0 });
    }, 300);
  }

  return (
    <div className="showcase">

      {/* Page content — crossfades on switch */}
      <div className={`showcase__page ${transitioning ? "showcase__page--out" : "showcase__page--in"}`}>
        <ActiveStyle />
      </div>

      {/* ── Floating switcher ── */}
      <div className={`switcher ${open ? "switcher--open" : ""}`}>

        {/* Expanded menu */}
        {open && (
          <div className="switcher__menu">
            <div className="switcher__menu-label">Choose a style</div>
            {STYLES.map(s => (
              <button
                key={s.id}
                className={`switcher__option ${active === s.id ? "switcher__option--active" : ""}`}
                onClick={() => switchStyle(s.id)}
              >
                <span className="switcher__option-num">{s.shortLabel}</span>
                <span className="switcher__option-emoji">{s.emoji}</span>
                <span className="switcher__option-label">{s.label}</span>
                {active === s.id && <span className="switcher__option-check">✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Toggle pill */}
        <button
          className="switcher__pill"
          onClick={() => setOpen(o => !o)}
          title="Switch style"
        >
          <span className="switcher__pill-dots">
            {STYLES.map((_, i) => (
              <span
                key={i}
                className={`switcher__dot ${i === active ? "switcher__dot--active" : ""}`}
              />
            ))}
          </span>
          <span className="switcher__pill-label">
            {open ? "✕ Close" : `Style ${STYLES[active].shortLabel} — ${STYLES[active].label}`}
          </span>
          {!open && <span className="switcher__pill-arrow">↑</span>}
        </button>

      </div>
    </div>
  );
}