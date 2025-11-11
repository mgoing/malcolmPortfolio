

//TODO Interactive mouse to make cool
//TODO change background
//TODO about bio
//TODO determine the parts of the FaceTracker I can post

//TODO make more retro
//TODO add terminal
//TODO wire in the user data that is collected
//TODO add dungeon game
//TODO add bubble pop
//TODO connect certain API data 
//inspo: https://dev.to/cbms26/how-i-built-a-retro-terminal-panel-in-react-1gjp



import React, { useEffect, useState, useRef, createRef } from 'react';
import Draggable from 'react-draggable';

// ---------- Configuration / sample apps ----------
const DEFAULT_APPS = [
  { id: 'portfolio', title: 'Portfolio', icon: '📁', defaultPos: { x: 60, y: 80 } },
  { id: 'about', title: 'About', icon: '📝', defaultPos: { x: 160, y: 80 } },
  { id: 'terminal', title: 'Terminal', icon: '▶', defaultPos: { x: 260, y: 80 } },
  { id: 'projects', title: 'Projects', icon: '💾', defaultPos: { x: 360, y: 80 } },
];

const STORAGE_KEY = 'retro_desktop_state_v1';

// ---------- Helpers ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load desktop state', e);
    return null;
  }
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save desktop state', e);
  }
}

// ---------- Main Component ----------
export default function RetroDesktop() {
  const [apps, setApps] = useState(() => {
    const saved = loadState();
    if (saved && saved.apps) return saved.apps;
    // initial apps with positions and closed by default
    return DEFAULT_APPS.map((a, i) => ({ ...a, pos: a.defaultPos, open: false, minimized: false, z: 0 }));
  });
  const iconRefs = useRef({});

  const [zCounter, setZCounter] = useState(() => {
    const saved = loadState();
    return (saved && saved.zCounter) || 10;
  });

  // Focus management
  function bringToFront(appId) {
    setZCounter((z) => {
      const newZ = z + 1;
      setApps((prev) => prev.map(p => p.id === appId ? { ...p, z: newZ } : p));
      return newZ;
    });
  }

  useEffect(() => {
    saveState({ apps, zCounter });
  }, [apps, zCounter]);

  function onIconDrag(appId, data) {
    const { x, y } = data;
    setApps(prev => prev.map(a => a.id === appId ? { ...a, pos: { x, y } } : a));
  }

  function openApp(appId) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, open: true, minimized: false, z: zCounter + 1 } : a));
    setZCounter(zCounter + 1);
  }
  function closeApp(appId) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, open: false, minimized: false } : a));
  }
  function toggleMinimize(appId) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, minimized: !a.minimized } : a));
  }

  // Small helper to render app content - replace with your real components
  function AppContent({ id }) {
    switch (id) {
      case 'portfolio':
        return (
          <div className="p-3 text-sm">
            <h3 className="font-mono mb-2">Portfolio — UNDER CONSTRUCTION</h3>
            <ul className="list-disc pl-5">
              <li>Face-tracker project (C++)</li>
              <li>Interactive player (React + Vite)</li>
              <li>Small demos and experiments</li>
            </ul>
          </div>
        );
      case 'about':
        return (
          <div className="p-3 text-sm">
            <h3 className="font-mono mb-2">About</h3>
            <p className="leading-tight">UNDER CONSTRUCTION! </p>
          </div>
        );
      case 'terminal':
        return (
          <div className="p-3 text-sm font-mono">
            <p>&gt; Loading terminal… (replace with your terminal component)</p>
            <p className="mt-2 italic">UNDER CONSTRUCTION! </p>
          </div>
        );
      case 'projects':
        return (
          <div className="p-3 text-sm">
            <h3 className="font-mono mb-2">Projects - UNDER CONSTRUCTION</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border rounded">Project A</div>
              <div className="p-2 border rounded">Project B</div>
            </div>
          </div>
        );
      default:
        return <div className="p-3">Empty app</div>;
    }
  }

  return (
    <div className="w-full h-screen relative select-none overflow-hidden font-sans">
      {/* Background: CRT vibe */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg,#041022 0%, #00121a 50%, #06010b 100%)'
      }} />

      {/* scanlines + vignette overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)'
        }} />
        <div className="absolute inset-0" style={{
          boxShadow: 'inset 0 200px 200px rgba(0,0,0,0.6)'
        }} />
      </div>

      {/* Desktop Content Area */}
      <div className="absolute inset-0 p-6">
        {/* Icons */}
       {apps.map(app => {
  // ensure a stable ref exists for each icon
  if (!iconRefs.current[app.id]) iconRefs.current[app.id] = createRef();

  return (
    <Draggable
      key={`icon-${app.id}`}
      bounds="parent"
      nodeRef={iconRefs.current[app.id]}          // <-- IMPORTANT: pass nodeRef
      position={{ x: app.pos.x, y: app.pos.y }}
      onStop={(e, data) => onIconDrag(app.id, data)}
    >
      {/* attach the same ref to the DOM element */}
      <div
        ref={iconRefs.current[app.id]}
        onDoubleClick={() => openApp(app.id)}
        className="w-20 cursor-grab user-select-none absolute"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded bg-black/30 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/10 shadow-inner" style={{ textShadow: '0 0 8px rgba(0,200,200,0.15)' }}>{app.icon}</div>
          <div className="mt-2 text-xs font-mono text-white/90 truncate">{app.title}</div>
        </div>
      </div>
    </Draggable>
  );
})}

        {/* Open windows */}
        {apps.filter(a => a.open).map(app => (
          <AppWindow
            key={`window-${app.id}`}
            app={app}
            bringToFront={() => bringToFront(app.id)}
            onClose={() => closeApp(app.id)}
            onMinimize={() => toggleMinimize(app.id)}
            zIndex={app.z}
          >
            <AppContent id={app.id} />
          </AppWindow>
        ))}

      </div>

      {/* Taskbar (bottom) */}
      <div className="absolute left-0 right-0 bottom-0 p-2 bg-black/40 backdrop-blur-sm border-t border-white/5 flex items-center gap-2">
        <div className="ml-2 text-xs font-mono text-white/80"> Desktop</div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 pr-4">
          {apps.map(a => (
            <button key={`tb-${a.id}`} onClick={() => {
              if (!a.open) openApp(a.id);
              else toggleMinimize(a.id);
            }} className="px-2 py-1 text-xs font-mono border rounded bg-white/5 hover:bg-white/10">
              {a.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Window Component ----------
function AppWindow({ app, children, bringToFront, onClose, onMinimize, zIndex }) {
  const nodeRef = useRef(null);

  // if minimized, don't render content to keep layout clean (but keep in taskbar)
  if (app.minimized) return null;

  return (
    <Draggable
      handle=".win-drag-handle"
      bounds="parent"
      nodeRef={nodeRef}
      defaultPosition={{ x: 120, y: 120 }}
      position={null}
      onStart={bringToFront}
    >
      <div ref={nodeRef} style={{ zIndex: zIndex || 1 }} className="absolute w-[520px] max-w-[90%] bg-[#08121b]/80 border border-white/8 rounded shadow-2xl">
        <div className="win-drag-handle flex items-center justify-between px-3 py-2 cursor-grab bg-gradient-to-b from-black/30 to-transparent border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <div className="ml-2 font-mono text-sm">{app.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onMinimize} className="px-2 py-1 text-xs font-mono">_</button>
            <button onClick={onClose} className="px-2 py-1 text-xs font-mono">×</button>
          </div>
        </div>
        <div className="p-0 text-white/95">
          <div className="bg-black/60 p-2" style={{ minHeight: '160px' }}>
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
