

//TODO Interactive mouse to make cool
//TODO change background
//TODO about bio
//TODO determine the parts of the FaceTracker I can post

//TODO make more retro
//TODO add terminal
//TODO wire in the user data that is collected
//TODO add dungeon game

//TODO connect certain API data 
//inspo: https://dev.to/cbms26/how-i-built-a-retro-terminal-panel-in-react-1gjp
//TODO move taskbar app placeholds to left side and specific to each app




import React, { useEffect, useState, useRef, createRef, Suspense } from 'react';
import { DEFAULT_APPS, DesktopIcon } from './DesktopIcon';
import Draggable from 'react-draggable';
import ErrorBoundary from './ErrorBoundary';
import BackgroundPicker from './BackgroundPicker';


const BubblePopGame = React.lazy(() => import('../BubblePop'));
const STORAGE_KEY = 'retro_desktop_state_v1';
const BG_STORAGE_KEY = 'retro_desktop_bg_v1';



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

export default function RetroDesktop() {
  const [apps, setApps] = useState(() => {
    const saved = loadState();
    if (saved && saved.apps) return saved.apps;
    return DEFAULT_APPS.map(a => ({ ...a, pos: a.defaultPos, open: false, minimized: false, z: 0, launched: false }));
  });

  const [desktopBg, setDesktopBg] = useState(() => {
  try {
    const raw = localStorage.getItem(BG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { type: 'gradient', css: 'linear-gradient(180deg,#041022 0%, #00121a 50%, #06010b 100%)' };
  } catch (e) {
    return { type: 'gradient', css: 'linear-gradient(180deg,#041022 0%, #00121a 50%, #06010b 100%)' };
  }
});
useEffect(() => {
  try { localStorage.setItem(BG_STORAGE_KEY, JSON.stringify(desktopBg)); } catch (e) { /* ignore */ }
}, [desktopBg]);

  const [zCounter, setZCounter] = useState(() => {
    const saved = loadState();
    return (saved && saved.zCounter) || 10;
  });

  useEffect(() => {
    saveState({ apps, zCounter });
  }, [apps, zCounter]);

  // move icon handler — updates saved pos
  function onIconDrag(appId, data) {
    const { x, y } = data;
    setApps(prev => prev.map(a => a.id === appId ? { ...a, pos: { x, y } } : a));
  }

  function bringToFront(appId) {
    setZCounter(z => {
      const newZ = z + 1;
      setApps(prev => prev.map(p => p.id === appId ? { ...p, z: newZ } : p));
      return newZ;
    });
  }

  function openApp(appId) {
   setApps(prev => prev.map(a =>
    a.id === appId
      ? { ...a, open: true, minimized: false, z: zCounter + 1, launched: true }
      : a
    ));
    setZCounter(zCounter + 1);
  }
  
  function closeApp(appId) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, open: false, minimized: false, launched: false} : a));
  }
  function toggleMinimize(appId) {
    setApps(prev => prev.map(a => 
      a.id === appId ? { ...a, minimized: !a.minimized, open: !a.minimized || a.open  } : a));
  }

  // render app contents by id — Add New Projects
  //by "id" from DesktopIcon.jsx
  //use <Suspense> wrapper around imported program eg:(<BubblePopGame />), so it loads on icon click
  function AppContent({ id }) {
    switch (id) {
      case 'portfolio':
        return (
          <div className="p-3 text-sm">
            <h3 className="font-mono mb-2">Portfolio — UNDER CONSTRUCTION</h3>
             <p>  </p>
          </div>
        );
      case 'about':
        return (
          <div className="p-3 text-sm">
            <h3 className="font-mono mb-2">About</h3>
            <p> https://github.com/mgoing/ </p>
            <p> https://www.linkedin.com/in/malcolmgoing/ </p>
          </div>
        );
      case 'terminal':
        return (
          <div className="p-3 text-sm font-mono">Terminal - UNDER CONSTRUCTION</div>
        );
      case 'projects':
        return (
          <div className="p-3 text-sm">Projects - UNDER CONSTRUCTION</div>
        );
      case 'bubblePop':
        
       return(
          <Suspense fallback={<div className="p-3"> Loading Game...</div>}>
            <BubblePopGame />
          </Suspense>
       );

        case 'background':
        return (
          <BackgroundPicker
      current={desktopBg}
      onApply={(sel) => setDesktopBg(sel)}
      onClose={() => closeApp('background')}
    />
        );

         case 'foTerminal':
        return (
           <div className="p-3 text-sm">Terminal - UNDER CONSTRUCTION</div>
        );

        case 'faceTracker':
        return (
           <div className="p-3 text-sm">FaceTracker - UNDER CONSTRUCTION</div>
        );

        case 'info':
        return (
           <div className="p-3 text-sm">This site is fully custom built and designed by myself and hosted through Github, without any templates or scaffolding.
           It primarily utilizes React JS and Tailwind CSS, with ReactBits Backgrounds as well. 
           
           </div>
        );

       
       
      default:
        return <div className="p-3">Empty app</div>;
    }
  }

//compute base background style
 let baseBgStyle = { backgroundColor: '#61aa82ff' }; // safe default
if (desktopBg && desktopBg.type === 'gradient' && desktopBg.css) {
  baseBgStyle.backgroundImage = desktopBg.css; // linear-gradient(...)
  baseBgStyle.backgroundSize = 'cover';
  baseBgStyle.backgroundPosition = 'center';
} else if (desktopBg && desktopBg.type === 'solid' && desktopBg.color) {
  baseBgStyle.backgroundColor = desktopBg.color;
} else if (desktopBg && desktopBg.type === 'preset-image' && desktopBg.src) {
  baseBgStyle.backgroundImage = `url("${desktopBg.src}")`;
  baseBgStyle.backgroundSize = 'cover';
  baseBgStyle.backgroundPosition = 'center';
  baseBgStyle.backgroundRepeat = 'no-repeat';
} else {
  baseBgStyle.background = 'linear-gradient(180deg,#041022 0%, #66b45eff 50%, #5b4a6cff 100%)';
}



  return (
    <div className="w-full h-screen relative select-none overflow-hidden font-sans">

      {/* Background: CRT vibe */}
      <div className="absolute inset-0" style={{ ...baseBgStyle }} />

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
        {/* Icons (moved to desktopIcons.jsx) */}
        {apps.map(app => (
          <DesktopIcon
            key={app.id}
            app={app}
            onDoubleClick={(id) => openApp(id)}
            onDragStop={(id, data) => onIconDrag(id, data)}
          />
        ))}

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
    
    <ErrorBoundary onReset={() => closeApp(app.id)}> {/* ErrorBoundary contains any issues when starting/clicking on a new App/Project */}
      <AppContent id={app.id} />
    </ErrorBoundary> 
  </AppWindow>
))}

      </div>

      {/* Taskbar (bottom) */}
      <div className="absolute left-0 right-0 bottom-0 p-2 bg-black/40 backdrop-blur-sm border-t border-white/5 flex items-center gap-2">
        <div className="ml-2 text-xs font-mono text-white/80"> Desktop - Under Development</div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 pr-4">
            {apps.filter(a => a.launched).map(a => (
              <button
                key={`tb-${a.id}`}
                onClick={() => {
                  if (!a.open) {
                    // if the app was launched but closed (rare), open it again
                    openApp(a.id);
                  } else if (a.minimized) {
                    // restore and bring to front
                    setApps(prev => prev.map(x => x.id === a.id ? { ...x, minimized: false, open: true, z: zCounter + 1 } : x));
                    setZCounter(z => z + 1);
                  } else {
                    // minimize if it's open and active
                    toggleMinimize(a.id);
                  }
                }}
                className="px-2 py-1 text-xs font-mono border rounded bg-white/5 hover:bg-white/10 no-drag"
                aria-pressed={a.open && !a.minimized}
                title={a.title}
              >
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
  const nodeRef = React.useRef(null);

  if (app.minimized) return null;

  return (
    <Draggable
      handle=".win-drag-handle"
      cancel=".no-drag, button, input, textarea, a"   // <<< important: exclude interactive elements from dragging
      bounds="parent"
      nodeRef={nodeRef}
      defaultPosition={{ x: 120, y: 120 }}
      position={null}
      onStart={bringToFront}
    >
      <div
        ref={nodeRef}
        style={{ zIndex: zIndex || 1 }}
        className="absolute w-[520px] max-w-[90%] bg-[#08121b]/80 border border-white/8 rounded shadow-2xl"
      >
        <div
          className="win-drag-handle flex items-center justify-between px-3 py-2 cursor-grab bg-gradient-to-b from-black/30 to-transparent border-b border-white/5"
          role="toolbar"
        >
           <div className="flex items-center gap-2">
            {/* Make these actual buttons, mark them .no-drag so react-draggable won't intercept clicks */}
            <button
              type="button"
              className="no-drag w-3 h-3 rounded-full bg-red-500"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            />
            
            <button
              type="button"
              className="no-drag w-3 h-3 rounded-full bg-yellow-400"
              aria-label="Minimize"
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            />
            
            <button
              type="button"
              className="no-drag w-3 h-3 rounded-full bg-green-400"
              aria-label="Bring to front"
              onClick={(e) => { e.stopPropagation(); bringToFront(app.id); }}
            />
            
            <div className="ml-2 font-mono text-sm select-none">{app.title}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Keep the existing minimize/close textual buttons too; mark them no-drag */}
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="no-drag px-2 py-1 text-xs font-mono"
              aria-label="Minimize window"
              type="button"
            >
              _
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="no-drag px-2 py-1 text-xs font-mono"
              aria-label="Close window"
              type="button"
            >
            </button>
          </div>
        </div>

        <div className="p-0 text-white/95">
          <div className="bg-black/60 p-2" style={{ minHeight: "160px" }}>
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  );
}






