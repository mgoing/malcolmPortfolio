// AppWindow.jsx
/*
import React from "react";
import Draggable from "react-draggable";
import { APP_INFO } from "./DesktopAppInfo";

// ── CRT scanline style injected once ─────────────────────────────────────────
const SCANLINE_STYLE = `
  @keyframes crt-flicker {
    0%   { opacity: 1; }
    92%  { opacity: 1; }
    93%  { opacity: 0.96; }
    94%  { opacity: 1; }
    98%  { opacity: 1; }
    99%  { opacity: 0.97; }
    100% { opacity: 1; }
  }
  @keyframes win-open {
    from { transform: scaleY(0.05); opacity: 0; }
    to   { transform: scaleY(1);    opacity: 1; }
  }
  .crt-content::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0,0,0,0.18) 2px,
      rgba(0,0,0,0.18) 4px
    );
    pointer-events: none;
    z-index: 10;
  }
  .win-animate {
    animation: win-open 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top center;
  }
  .crt-active-glow {
    animation: crt-flicker 8s infinite;
  }
  .resize-hint::after {
    content: '⌟';
    position: absolute;
    bottom: 3px;
    right: 5px;
    font-size: 10px;
    color: rgba(0,255,200,0.3);
    pointer-events: none;
    line-height: 1;
  }
  .info-drawer {
    transition: width 0.2s cubic-bezier(0.22,1,0.36,1), opacity 0.15s ease;
  }
  .info-drawer.closed {
    width: 0;
    opacity: 0;
    overflow: hidden;
  }
  .info-drawer.open {
    width: 200px;
    opacity: 1;
  }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected) return;
  const el = document.createElement("style");
  el.textContent = SCANLINE_STYLE;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─────────────────────────────────────────────────────────────────────────────

function AppWindow({ app, children, bringToFront, onClose, onMinimize, zIndex }) {
  const nodeRef = React.useRef(null);
  const [infoOpen, setInfoOpen] = React.useState(false);

  React.useEffect(() => { injectStyles(); }, []);

  if (app.minimized) return null;

  const isActive = app.z === zIndex;
  const appInfo = APP_INFO[app.id];

  return (
    <Draggable
      handle=".win-drag-handle"
      cancel=".no-drag, button, input, textarea, a"
      bounds="parent"
      nodeRef={nodeRef}
      defaultPosition={{ x: 120, y: 120 }}
      position={null}
      onStart={bringToFront}
    >
      <div
        ref={nodeRef}
        className={`
          absolute rounded shadow-2xl flex flex-col win-animate resize-hint
          ${isActive
            ? "crt-active-glow border border-cyan-400/40 shadow-[0_0_30px_rgba(0,255,200,0.12),0_0_60px_rgba(0,255,200,0.06)]"
            : "border border-white/8 opacity-85"
          }
        `}
        style={{
          zIndex: zIndex || 1,
          resize: "both",
          overflow: "hidden",
          width: app.defaultWidth || "520px",
          maxWidth: "95vw",
          minWidth: "220px",
          minHeight: "160px",
          maxHeight: "90vh",
          background: isActive
            ? "rgba(4, 14, 20, 0.92)"
            : "rgba(4, 10, 16, 0.78)",
        }}
        onClick={bringToFront}
      >
        {/* ── Title Bar ───────────────────────────────────────────────────── 
        <div
          className="win-drag-handle flex items-center justify-between px-3 py-2 cursor-grab select-none shrink-0"
          style={{
            background: "linear-gradient(to bottom, rgba(10,28,38,0.95), rgba(2,8,14,0.95))",
            borderBottom: isActive
              ? "1px solid rgba(0,255,200,0.15)"
              : "1px solid rgba(255,255,255,0.06)",
          }}
          role="toolbar"
        >
          {/* Left — traffic lights + title 
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            />
            <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-yellow-400/80 hover:bg-yellow-300 transition-colors"
              aria-label="Minimize"
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            />
            <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-green-400/60 hover:bg-green-300 transition-colors"
              aria-label="Bring to front"
              onClick={(e) => { e.stopPropagation(); bringToFront(app.id); }}
            />

            {/* CRT-style title 
            <span className="ml-2 font-mono text-xs tracking-widest text-cyan-400/70 select-none">
              [{app.title}]
            </span>
          </div>

          {/* Right — info toggle + minimize + close 
          <div className="flex items-center gap-1">
            {/* Info toggle — only show if this app has info content 
            {appInfo && (
              <button
                type="button"
                className={`no-drag px-1.5 py-0.5 font-mono text-xs rounded transition-all
                  ${infoOpen
                    ? "text-cyan-300 bg-cyan-400/15 border border-cyan-400/30"
                    : "text-white/30 hover:text-cyan-400/60 border border-transparent"
                  }`}
                aria-label="Toggle info panel"
                onClick={(e) => { e.stopPropagation(); setInfoOpen(v => !v); }}
                title={infoOpen ? "Close info" : "App info"}
              >
                {infoOpen ? "[i]" : " i "}
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="no-drag px-1.5 py-0.5 text-xs font-mono text-white/30 hover:text-white/70 transition-colors"
              aria-label="Minimize"
              type="button"
            >
              _
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="no-drag px-1.5 py-0.5 text-xs font-mono text-white/30 hover:text-red-400/80 transition-colors"
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body: content + info drawer side by side ─────────────────────── 
        <div className="flex flex-1 min-h-0 relative">

          {/* Main content 
          <div
            className="crt-content flex-1 overflow-auto relative"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.65))",
            }}
          >
            {children}
          </div>

          {/* Info drawer — slides in from the right 
          {appInfo && (
            <div
              className={`info-drawer shrink-0 ${infoOpen ? "open" : "closed"}`}
              style={{
                background: "rgba(0,20,30,0.97)",
                borderLeft: "1px solid rgba(0,255,200,0.12)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div className="p-3 min-w-[200px]">
                {/* Drawer header 
                <div className="flex items-center justify-between mb-3 pb-2"
                  style={{ borderBottom: "1px solid rgba(0,255,200,0.1)" }}>
                  <span className="font-mono text-xs text-cyan-400/60 tracking-widest">
                    {appInfo.label}
                  </span>
                  <button
                    type="button"
                    className="text-white/20 hover:text-white/60 font-mono text-xs transition-colors"
                    onClick={() => setInfoOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* Content — defined per-app in appInfo.jsx 
                <div className="text-white/70">
                  {appInfo.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}

export default AppWindow;

*/


// AppWindow.jsx
import React from "react";
import Draggable from "react-draggable";
import { APP_INFO } from "./DesktopAppInfo";
import "./crt.css";

function AppWindow({ app, children, bringToFront, onClose, onMinimize, zIndex, onGuideAction }) {
  const nodeRef = React.useRef(null);
  const [infoOpen, setInfoOpen] = React.useState(false);

  if (app.minimized) return null;

  const isActive = app.z === zIndex;
  const appInfo = APP_INFO[app.id];

  return (
    <Draggable
      handle=".win-drag-handle"
      cancel=".no-drag, button, input, textarea, a"
      bounds="parent"
      nodeRef={nodeRef}
      defaultPosition={{ x: 120, y: 120 }}
      position={null}
      onStart={bringToFront}
    >
      <div
        ref={nodeRef}
        data-guide={`resize-handle-${app.id}`}
        className={`
          absolute rounded shadow-2xl flex flex-col win-animate resize-hint
          ${isActive
            ? "crt-active-glow border border-cyan-400/40 shadow-[0_0_30px_rgba(0,255,200,0.12),0_0_60px_rgba(0,255,200,0.06)]"
            : "border border-white/10 opacity-90"
          }
        `}
        style={{
          zIndex: zIndex || 1,
          resize: "both",
          overflow: "hidden", 
          width: app.defaultWidth || "520px",
          height: app.defaultHeight || "420px", 
          maxWidth: "95vw",
          minWidth: "220px",
          minHeight: "160px",
          maxHeight: "90vh",
          background: isActive ? "rgba(4,14,20,0.95)" : "rgba(4,10,16,0.82)", //rgba(4,14,20,0.95) and rgba(4,10,16,0.82)
        }}
        onClick={() => {}} //was bringToFront THIS THING CAUSED SO MUCH HARM. CAUSING RE RENDERING ON ANY CLICKS
      >
        {/* ── Title Bar ─────────────────────────────────────────────────── */}
        <div
          className="win-drag-handle flex items-center justify-between px-3 py-2 cursor-grab select-none shrink-0"
          style={{
            background: isActive
              ? "linear-gradient(to bottom, rgba(0,40,55,0.98), rgba(0,20,32,0.98))"
              : "linear-gradient(to bottom, rgba(0,25,35,0.95), rgba(0,12,20,0.95))",
            borderBottom: isActive
              ? "1px solid rgba(0,255,200,0.2)"
              : "1px solid rgba(255,255,255,0.08)",
          }}
          role="toolbar"
        >
          {/* Left — traffic lights + title */}
          <div className="flex items-center gap-2">
           {/* <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors shadow-[0_0_4px_rgba(255,80,80,0.5)]"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            />
            <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-[0_0_4px_rgba(255,200,0,0.5)]"
              aria-label="Minimize"
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            />
            <button
              type="button"
              className="no-drag w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-[0_0_4px_rgba(0,200,80,0.5)]"
              aria-label="Bring to front"
              onClick={(e) => { e.stopPropagation(); bringToFront(app.id); }}
            /> */}

            <span className="ml-2 font-mono text-xs tracking-widest text-cyan-300/80 select-none">
              [{app.title}]
            </span>
          </div>

          {/* Right — info toggle + minimize + close */}
          <div className="flex items-center gap-1">
            {appInfo && (
              <button
                type="button"
                data-guide={`btn-info-${app.id}`}
                className={`no-drag px-1.5 py-0.5 font-mono text-xs rounded transition-all
                  ${infoOpen
                    ? "text-cyan-300 bg-cyan-400/20 border border-cyan-400/40"
                    : "text-white/60 hover:text-cyan-300 border border-transparent hover:border-cyan-400/20"
                  }`}
                aria-label="Toggle info panel"
                onClick={(e) => { e.stopPropagation(); setInfoOpen(v => !v); onGuideAction?.('click', app.id); }}
                title={infoOpen ? "Close info" : "App info"}
              >
                {infoOpen ? "[i]" : "[?]"}
              </button>
            )}

            <button
            data-guide={`btn-minimize-${app.id}`}
              onClick={(e) => { e.stopPropagation(); onMinimize();  onGuideAction?.('click', app.id); }}
              className="no-drag px-1.5 py-0.5 text-xs font-mono text-white/60 hover:text-white/90 transition-colors"
              type="button"
            >_</button>

            <button
            data-guide={`btn-close-${app.id}`}
              onClick={(e) => { e.stopPropagation(); onClose(); onGuideAction?.('click', app.id); }}
              className="no-drag px-1.5 py-0.5 text-xs font-mono text-white/60 hover:text-red-400 transition-colors"
              type="button"
            >✕</button>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 relative">
          <div
          data-guide={`window-body-${app.id}`}
             className="crt-content flex-1 overflow-auto relative"
            
          >
            {children}
          </div>

          {appInfo && (
            <div
              className={`info-drawer shrink-0 ${infoOpen ? "open" : "closed"}`}
              style={{
                background: "rgba(0,18,28,0.98)", //rgba(0,18,28,0.98
                borderLeft: "1px solid rgba(0,255,200,0.15)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div className="p-3 min-w-[200px]">
                <div
                  className="flex items-center justify-between mb-3 pb-2"
                  style={{ borderBottom: "1px solid rgba(0,255,200,0.12)" }}
                >
                  <span className="font-mono text-xs text-cyan-400/70 tracking-widest">
                    {appInfo.label}
                  </span>
                  <button
                    type="button"
                    className="text-white/40 hover:text-white/80 font-mono text-xs transition-colors"
                    onClick={() => setInfoOpen(false)}
                  >✕</button>
                </div>
                <div className="text-white/70">{appInfo.content}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}

export default AppWindow;