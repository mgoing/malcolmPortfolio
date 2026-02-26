

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
import BackgroundPicker from './DesktopApps/BackgroundPicker';

import RetroTerminal from './DesktopApps/RetroTerminal';



import SiteExamples from '../SiteExamples/SiteExamples';
import AboutTemplate from '../SiteExamples/AboutTemplate';
import BlogTemplate from '../SiteExamples/BlogTemplate';

import MinimalApple, {CleanLanding, GlassLanding} from '../SiteExamples/LandingPages';




const BubblePopGame = React.lazy(() => import('./DesktopApps/BubblePop'));
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
    return DEFAULT_APPS.map(a => ({ ...a, pos: a.defaultPos || { x: 120, y: 120 }, open: false, minimized: false, z: 0, launched: false }));
  });

  const [desktopBg, setDesktopBg] = useState(() => {
  try {
    const raw = localStorage.getItem(BG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { type: 'gradient', css: 'radial-gradient(ellipse at center, #3fa530 0%, #1f8641 45%, #092b14 100%)' };
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
                <SiteExamples openApp={openApp} />
              );
      case 'about':
              return (
                <div className="p-3 text-sm">
                  <h3 className="font-mono mb-2">About</h3>
                  <p> https://github.com/mgoing/ </p>
                  <p> https://www.linkedin.com/in/malcolmgoing/ </p>
                </div>
              );
      

      case 'projects':
              return (
                <div className="p-3 text-sm">Projects: Currently continuing development of my MsC Thesis, dubbed "FaceTracker", and developing a companion app for a regenerative agriculture company</div>
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
                  <div className="p-3 text-sm">Secondary Terminal - UNDER CONSTRUCTION</div>
                );

        case 'faceTracker':
                return (
                  <div className="p-3 text-sm">FaceTracker - UNDER CONSTRUCTION</div>
                );

        case 'info':
                return (
                  <div className="p-3 text-sm">Welcome! This ongoing project serves as a location to showcase projects and test React features. This site was designed to emulate a desktop experience, within your browser. This static site is fully custom built and designed by myself and hosted through Github.
                    
                  
                  </div>
                );

        case 'retroTerminal':
          return( <RetroTerminal  />
         
          );

        //BELOW--------- For site example dynamic opening. Should be restructured into seperate case loop
        case 'minimalApple':
          return <MinimalApple openApp={openApp} />;

          case 'glassLanding':
            return <GlassLanding openApp={openApp} />;

          case 'cleanLanding':
            return <CleanLanding openApp={openApp} />;  
            
            case 'minimalAppleAbout':
              return <AboutTemplate
                styleKey="minimalApple"
                themeClass="style-minimal"
                title="Minimal Apple"
                openApp={openApp}
              />;

            case 'minimalAppleBlog':
              return <BlogTemplate
                styleKey="minimalApple"
                themeClass="style-minimal"
                title="Minimal Apple"
                openApp={openApp}
              />;

            case 'glassLandingAbout':
              return <AboutTemplate
                styleKey="glassLanding"
                themeClass="style-glass"
                title="Glassmorphism"
                openApp={openApp}
              />;

            case 'glassLandingBlog':
              return <BlogTemplate
                styleKey="glassLanding"
                themeClass="style-glass"
                title="Glassmorphism"
                openApp={openApp}
              />;

            case 'cleanLandingAbout':
              return <AboutTemplate
                styleKey="cleanLanding"
                themeClass="style-clean"
                title="Clean Corporate"
                openApp={openApp}
              />;

            case 'cleanLandingBlog':
              return <BlogTemplate
                styleKey="cleanLanding"
                themeClass="style-clean"
                title="Clean Corporate"
                openApp={openApp}
              />;

                  //END SiteExamples------------------
        
       
       
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
  baseBgStyle.background = 'radial-gradient(ellipse at center, #50da3b 0%, #249e4d 60%, #0c3a1b 100%)';
  //'linear-gradient(180deg,#041022 0%, #66b45eff 50%, #5b4a6cff 100%)'; 
  //original  'radial-gradient(ellipse at center, #1f566d 0%, #0f2a3d 60%, #02060a 100%)';
}



  return (
    <div className="w-full h-screen relative select-none overflow-hidden font-sans">

      {/* Background: CRT vibe */}
      <div className="absolute inset-0" style={{ ...baseBgStyle }} />



      {/* scanlines + vignette overlay */}
      <div className="pointer-events-none absolute inset-0 " /*mix-blend-screen*/> 
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 3px)'
        }} />
        <div className="absolute inset-0" style={{
         // boxShadow: 'inset 0 125px 125px rgba(0,0,0,0.25)'
        }} />
      </div>

      {/* Desktop Content Area */}
      <div className="absolute inset-0 p-6">
        {/* Icons (moved to desktopIcons.jsx) */}
        {apps.filter(app => !app.hidden).map(app => (
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
      <div className="absolute left-0 right-0 bottom-0 z-50 p-2 bg-black/40 backdrop-blur-sm border-t border-white/5 flex items-center gap-2">
         <div className="ml-2 text-xs font-mono text-white/80"> Desktop - Under Development</div>
         <div className="flex items-center gap-2 pr-4">
             {apps.filter(a => a.launched).map(a => (
                     <button
                          key={`tb-${a.id}`}
                          onClick={() => {
                              if (!a.open) {
                             // Re-open if closed
                              openApp(a.id);
                              } else if (a.minimized) {
                             // Restore + bring to front
                                 setApps(prev =>
                                  prev.map(x => x.id === a.id
                                    ? { ...x, minimized: false, open: true, z: zCounter + 1 }    : x));
                                          setZCounter(z => z + 1);
                                            } else {
                                                // Minimize if currently open
                                              toggleMinimize(a.id);
                                        }
                                      }}
                                      className={`relative px-2 py-1 text-xs font-mono text-white/90 border rounded no-drag transition-all duration-150
                                        ${a.minimized
                                          ? 'bg-white/5 opacity-60 border-white/10'
                                          : 'bg-white/15 border-yellow-400 shadow-inner'
                                        }`}
                                      aria-pressed={a.open && !a.minimized}
                                      title={a.title}
                                    >
                                      <div className="flex items-center gap-2">
                                        {/* Icon renderer (same logic as DesktopIcon.jsx) */}
                                        <div className="w-4 h-4 flex items-center justify-center">
                                          {typeof a.icon === 'string' &&
                                          (a.icon.endsWith('.png') ||
                                            a.icon.endsWith('.jpg') ||
                                            a.icon.endsWith('.jpeg') ||
                                            a.icon.endsWith('.svg')) ? (
                                            <img
                                              src={a.icon}
                                              alt={a.title}
                                              className="w-full h-full object-contain"
                                            />
                                          ) : (
                                        <span className="text-sm">{a.icon}</span>
                                     )}
                                  </div>

                                 <span className="hidden md:inline">{a.title}</span>
                              </div>

                           {/* Active window indicator (retro strip) */}
                           {!a.minimized && a.open && (
                               <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-yellow-400" />
                           )}
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
        style={{ zIndex: zIndex || 1, resize: 'both', overflow: 'hidden' }}
       // className="absolute w-[520px] max-w-[90%] bg-[#08121b]/80 border border-white/8 rounded shadow-2xl"
       className={`absolute w-[520px] max-w-[90%] rounded shadow-2xl transition-all duration-150
          ${app.z === zIndex 
            ? 'bg-[#08121b]/90 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,255,200,0.15)]'
            : 'bg-[#08121b]/70 border border-white/10'
          }`}
      >
        <div
          className="win-drag-handle flex items-center justify-between px-3 py-2 cursor-grab bg-gradient-to-b from-[#0a1a24] to-[#03070c] border-b border-cyan-400/10 backdrop-blur-sm"
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
          <div className="bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-[2px] p-2" style={{ minHeight: "160px" }}>
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  );
}






