

//Citation links to be added

// appInfo.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Per-app info drawer content, keyed by app.id.
// Content is JSX — use any elements below. The drawer is 200px wide, dark bg,
// independently scrollable. All Tailwind utility classes are available.
//
// ── Styling reference ────────────────────────────────────────────────────────
//
// SECTION HEADER     <p className="text-cyan-400 font-mono text-xs tracking-widest mb-2">// label</p>
// BODY TEXT          <p className="text-white/70 text-xs leading-relaxed">...</p>
// DIM / SECONDARY    <p className="text-white/30 text-xs">...</p>
// INLINE CODE        <code className="text-green-400 font-mono text-xs bg-white/5 px-1 rounded">cmd</code>
// WARNING / NOTE     <p className="text-yellow-400/80 text-xs">⚠ note</p>
// DIVIDER            <hr className="border-cyan-400/10 my-2" />
// KEY-VALUE GRID     <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
//                      <span className="text-yellow-400/80">key</span><span className="text-white/60">value</span>
//                    </div>
// BADGE / TAG        <span className="bg-cyan-400/10 text-cyan-300 text-xs font-mono px-1.5 py-0.5 rounded border border-cyan-400/20">tag</span>
// BULLET LIST        <ul className="text-white/60 text-xs space-y-1 pl-2">
//                      <li>• item</li>
//                    </ul>
// LINK               <a href="..." target="_blank" className="text-cyan-400 text-xs underline hover:text-cyan-300">link</a>
// BLOCK / CARD       <div className="bg-white/5 rounded p-2 border border-white/10 text-xs text-white/60">...</div>
// ─────────────────────────────────────────────────────────────────────────────

export const APP_INFO = {

  //https://www.flaticon.com/authors/dooder
  info: {
    label: "// about this site",
    content: (
      <div className="space-y-3">
        <p className="text-cyan-400 font-mono text-xs tracking-widest">// readme</p>
        <p className="text-white/70 text-xs leading-relaxed">
          An ongoing project serving as a portfolio and React feature testbed.
          Designed to emulate a desktop experience inside the browser.
        </p>
        <hr className="border-cyan-400/10" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <span className="text-white/40">stack</span>
          <span className="text-white/70">React + Tailwind</span>
          <span className="text-white/40">hosting</span>
          <span className="text-white/70">GitHub Pages</span>
          <span className="text-white/40">type</span>
          <span className="text-white/70">Static site</span>
        </div>
        <div>
       <a href="https://www.flaticon.com/authors/dooder" target="_blank" rel="noreferrer"
          className="block text-cyan-400  underline hover:text-cyan-300 transition-colors">
          Desktop Icon Source
        </a>
         <span className="text-white/40 text-xs">Hover to view link</span>
         </div>
      </div>
    ),
  },

  about: {
    label: "// contact",
    content: (
      <div className="space-y-2">
        <p className="text-cyan-400 font-mono text-xs tracking-widest mb-2">// links</p>
        <a href="https://github.com/mgoing/" target="_blank" rel="noreferrer"
          className="block text-cyan-400 text-xs underline hover:text-cyan-300 transition-colors">
          github.com/mgoing
        </a>
        <a href="https://www.linkedin.com/in/malcolmgoing/" target="_blank" rel="noreferrer"
          className="block text-cyan-400 text-xs underline hover:text-cyan-300 transition-colors">
          linkedin/malcolmgoing
        </a>
      </div>
    ),
  },

  // Desktop Icon: https://www.flaticon.com/authors/afitrose
  projects: {
    label: "// active projects",
    content: (
      <div className="space-y-3">
        <div className="bg-white/5 rounded p-2 border border-white/10">
          <p className="text-cyan-300 text-xs font-mono mb-1">FaceTracker</p>
          <p className="text-white/50 text-xs leading-relaxed">MsC Thesis project. Currently in active development.</p>
        </div>
        <div className="bg-white/5 rounded p-2 border border-white/10">
          <p className="text-cyan-300 text-xs font-mono mb-1">AgriCompanion</p>
          <p className="text-white/50 text-xs leading-relaxed">Companion app for a regenerative agriculture company.</p>
        </div>
        <div className="bg-white/5 rounded p-2 border border-white/10">
         <a href="https://www.flaticon.com/authors/afitrose" target="_blank" className="text-cyan-400 text-xs underline hover:text-cyan-300">Desktop Icon Source</a>
         </div>
      </div>
    ),
  },

  retroTerminal: {
    label: "// terminal help",
    content: (
      <div className="space-y-3">
        <p className="text-cyan-400 font-mono text-xs tracking-widest">// commands</p>
        <ul className="text-white/60 text-xs space-y-1.5">
          <li><code className="text-green-400 font-mono bg-white/5 px-1 rounded">help</code> — list commands</li>
          <li><code className="text-green-400 font-mono bg-white/5 px-1 rounded">clear</code> — clear screen</li>
          <li><code className="text-green-400 font-mono bg-white/5 px-1 rounded">ls</code> — list directory</li>
          <li><code className="text-green-400 font-mono bg-white/5 px-1 rounded">cat [file]</code> — read file</li>
        </ul>
      </div>
    ),
  },

  //Dungeon game desktop icon - https://www.flaticon.com/authors/xnimrodx
  dungeonGame: {
    label: "// controls",
    content: (
      <div className="space-y-3">
        <p className="text-cyan-400 font-mono text-xs tracking-widest">// keyboard</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <span className="text-yellow-400/80 font-mono">W / ↑</span><span className="text-white/60">Move forward</span>
          <span className="text-yellow-400/80 font-mono">S / ↓</span><span className="text-white/60">Move backward</span>
          <span className="text-yellow-400/80 font-mono">A / ←</span><span className="text-white/60">Rotate left</span>
          <span className="text-yellow-400/80 font-mono">D / →</span><span className="text-white/60">Rotate right</span>
          <span className="text-yellow-400/80 font-mono">R</span><span className="text-white/60">New dungeon</span>
        </div>
        <hr className="border-cyan-400/10" />
        <p className="text-white/30 text-xs">Click canvas first to capture keyboard focus.</p>
        <p className="text-white/30 text-xs">Minimap colors: red = brick, blue = stone, green = metal.</p>
      </div>
    ),
  },

//Desktop Icon and bubble: https://www.freepik.com/premium-vector/single-bubble-with-pixel-art-style_18791387.htm

  bubblePop: {
    label: "// how to play",
    content: (
      <div className="space-y-2">
        <p className="text-cyan-400 font-mono text-xs tracking-widest mb-2">// rules</p>
        <p className="text-white/60 text-xs leading-relaxed">Click bubbles before they reach the top. Larger bubbles are worth more points.</p>
        <p className="text-yellow-400/80 text-xs mt-2">⚠ Click the canvas to start.</p>
      </div>
    ),
  },

/*
pngs for background options
https://wallpaperaccess.com/terminal
https://www.rawpixel.com/image/16311232/png-background-retro-neon-grid
https://www.vecteezy.com/vector-art/20562054-background-of-neon-grid-for-retro-futuristic-design
*/
//desktop icon: https://www.freepik.com/premium-vector/pixel-art-illustration-monitor-pixelated-monitor-computer-monitor-laptop-pixelated-game_95470877.htm

  background: {
    label: "// bg picker",
    content: (
      <div className="space-y-2">
        <p className="text-white/60 text-xs leading-relaxed">Choose a gradient, solid color, or preset image. Selection is saved between sessions.</p>
      </div>
    ),
  },

  //https://www.vecteezy.com/vector-art/29817514-pixel-art-illustration-computer-pixelated-old-computer-old-classic-computer-icon-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro
  foTerminal: {
    label: '// fallout terminal',
    content:(
      <div className="space-y-2">
        <p className="text-white/60 text-xs leading-relaxed">Interact with the iconic terminal from Fallout! Coming soon</p>
      </div>
    ),

  },

  //https://www.vecteezy.com/vector-art/30335001-pixel-art-illustration-folder-icon-pixelated-folder-folder-office-icon-landmark-icon-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro
  portfolio: {
    label: '//web design portfolio',
      content:(

        <div className="space-y-3">
        
        <div>
       <a href="https://www.vecteezy.com/vector-art/30335001-pixel-art-illustration-folder-icon-pixelated-folder-folder-office-icon-landmark-icon-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro" target="_blank" rel="noreferrer"
          className="block text-cyan-400  underline hover:text-cyan-300 transition-colors">
          Desktop Icon Source
        </a>
         <span className="text-white/40 text-xs">Hover to view link</span>
         </div>
      </div>
      ),

  },

  
  faceTracker: {
      label: '// MsC Thesis',
      content:(
         <div className="space-y-3">
        
        <div>
       <a href="https://www.flaticon.com/authors/adury5711" target="_blank" rel="noreferrer"
          className="block text-cyan-400  underline hover:text-cyan-300 transition-colors">
          Desktop Icon Source
        </a>
         <span className="text-white/40 text-xs">Hover to view link</span>
         </div>
      </div>


      ),



  }

};

/*
https://static.vecteezy.com/system/resources/previews/030/335/001/large_2x/pixel-art-illustration-folder-icon-pixelated-folder-folder-office-icon-landmark-icon-pixelated-for-the-pixel-art-game-and-icon-for-website-and-video-game-old-school-retro-vector.jpg
*/