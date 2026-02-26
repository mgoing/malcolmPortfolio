

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import bubblePNG from '../../assets/bubblePNG2.jpg';
import faceScan from '../../assets/faceScanFT.png';
import backgroundSelector from '../../assets/backgroundSelector.jpg';
import Fo4Terminal from '../../assets/retroTerminal.jpg';
import alertSiteDetails from '../../assets/alertSiteDetails.png';




// App registry: add or reorder entries here. Keep `id` unique.
export const DEFAULT_APPS = [
{ id: 'portfolio', title: 'Web Design', icon: '📁', defaultPos: { x: 260, y: 180 }, navUrl: '/landing.html'},
{ id: 'about', title: 'About', icon: '📝', defaultPos: { x: 160, y: 80 } },
{ id: 'retroTerminal', title: 'Terminal', icon: '💻', defaultPos: { x: 260, y: 80 } },
{ id: 'projects', title: 'Projects', icon: '💾', defaultPos: { x: 360, y: 80 } },

{ id: 'bubblePop', title: 'Bubble Pop', icon: bubblePNG , defaultPos: { x: 460, y: 80 } },
{ id: 'background', title: 'Background Settings', icon: backgroundSelector, defaultPos:{x: 60, y: 80}},
{ id: 'faceTracker', title: 'FaceTracker Thesis', icon: faceScan, defaultPos: {x: 60, y: 180}},
{ id: 'foTerminal', title: 'FO Terminal', icon: Fo4Terminal, defaultPos: {x: 160, y: 180}},
{ id: 'info', title: 'Site Info', icon: alertSiteDetails, defaultPos: {x: 1000, y: 80}},  

//hidden apps not in desktop
{  id: 'minimalApple', title: 'Minimal Apple', hidden: true},
{  id: 'minimalAppleAbout', title: 'About', hidden: true},
{  id: 'minimalAppleBlog', title: 'Blog', hidden: true},
{  id: 'glassLanding', title: 'Glassmorphism', hidden: true},
{  id: 'cleanLanding', title: 'Clean Corporate', hidden: true},
{  id: 'cleanAbout', title: 'About', hidden: true},
{  id: 'cleanBlog', title: 'Blog', hidden: true},
{  id: 'glassAbout', title: 'About', hidden: true},
{  id: 'glassBlog', title: 'About', hidden: true}

];




//
// Small helper component that encapsulates the Draggable icon
// Props:
// - app: the app object from DEFAULT_APPS (or current apps state)
// - onDoubleClick(appId): called when icon double-clicked
// - onDragStop(appId, data): called when dragging stops
export function DesktopIcon({ app, onDoubleClick, onDragStop }) {
    const nodeRef = useRef(null);


// Detect whether the icon value is an image path or an emoji/string
const isImage = typeof app.icon === 'string' && (app.icon.endsWith('.png') || app.icon.endsWith('.jpg') || app.icon.endsWith('.jpeg') || app.icon.endsWith('.svg'));

function onDoubleClickIcon() {
  if (app.navUrl) {
    window.location.href = app.navUrl;
    return;
  }
  // else open as app in desktop
  onDoubleClick(app.id);
}

return (
    <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={{ x: app.pos.x, y: app.pos.y }}
        onStop={(e, data) => onDragStop(app.id, data)}
    >
    <div
    ref={nodeRef}
    onDoubleClick={() => onDoubleClick(app.id)}
    className="w-20 cursor-grab user-select-none absolute"
    aria-label={app.title}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter') onDoubleClick(app.id); }}
    >
        <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded bg-black/30 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/10 shadow-inner" style={{ textShadow: '0 0 8px rgba(0,200,200,0.15)' }}>
            {isImage ? (
            <img src={app.icon} alt={app.title} className="w-full h-full object-contain" />
            ) : (
            <span>{app.icon}</span>
        )}
    </div>
    <div className="mt-2 text-xs font-mono text-white/90 truncate" style={{ maxWidth: 80 }}>{app.title}</div>
</div>
</div>
</Draggable>
);
}