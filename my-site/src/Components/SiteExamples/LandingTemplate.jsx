import React from 'react';
import './siteExamples.css';

/**
 * LandingTemplate - small, parameterized landing page component
 * props:
 *   styleKey: prefix used for app ids (e.g. 'minimalApple')
 *   themeClass: one of 'style-minimal' | 'style-glass' | 'style-clean'
 *   title: display title
 *   openApp: function(appId) - will be provided by RetroDesktop
 *   openOther: function(appId) - optional
 */
export default function LandingTemplate({ styleKey, themeClass = '', title, openApp }) {
  const aboutId = `${styleKey}About`;
  const blogId = `${styleKey}Blog`;

  const otherStyles = [
    { id: 'glassLanding', label: 'Glassmorphism' },
    { id: 'cleanLanding', label: 'Clean Corporate' },
    // note: minimalAppleLanding is the current
  ];

  return (
    <div className={`se-root ${themeClass}`}>
      <div className="se-container">
        <header className="se-header">
          <div className="se-brand">
            <div className="se-logo">MG</div>
            <div>
              <div style={{fontWeight:700}}>{title}</div>
              <div style={{fontSize:12, color:'#9fb3c8'}}>Design example — {title}</div>
            </div>
          </div>
          <nav className="se-nav">
            <button onClick={() => openApp(`${styleKey}`)} className="primary">Home</button>
            <button onClick={() => openApp(aboutId)}>About</button>
            <button onClick={() => openApp(blogId)}>Blog</button>
            <button onClick={() => openApp('siteExamples')}>Examples</button>
          </nav>
        </header>

        <section className="se-hero" style={{marginTop:18}}>
          <div className="left">
            <h1>{title} — example landing</h1>
            <p>Small, focused landing that demonstrates the {title} aesthetic. Use the nav to open About or Blog within the same style.</p>
            <div className="se-grid">
              <div className="se-card"><h4>Clear hierarchy</h4><p className="meta">Readable headings and straightforward layout.</p></div>
              <div className="se-card"><h4>Reusable components</h4><p className="meta">Buttons, cards, and previews you can reuse across the site.</p></div>
              <div className="se-card"><h4>Quick to adapt</h4><p className="meta">Minimal CSS footprint — designed for experiments.</p></div>
            </div>
          </div>

          <div style={{width:320}}>
            <div className="se-card" style={{padding:18}}>
              <h3 style={{marginTop:0}}>Preview</h3>
              <div className="se-preview" style={{
                display:'grid', placeItems:'center',
                background: themeClass.includes('minimal') ? 'linear-gradient(90deg,#ffffff,#f0f7fb)' :
                            themeClass.includes('glass') ? 'linear-gradient(90deg,#6bbcc5,#7af3ff)' :
                            'linear-gradient(90deg,#071322,#052f45)'
              }}>
                <div style={{padding:12,borderRadius:8, fontWeight:700}}>{title} hero</div>
              </div>

              <div style={{marginTop:12, display:'flex', gap:10}}>
                <button className="se-nav" onClick={() => openApp(aboutId)}>Open About</button>
                <button className="se-nav" onClick={() => openApp(blogId)}>Open Blog</button>
              </div>
            </div>
          </div>
        </section>

        <section style={{marginTop:18}}>
          <h4>Other Styles</h4>
          <div className="se-style-catalog" style={{marginTop:8}}>
            <div className="se-style-card" onClick={() => openApp('minimalApple')}>
              <div className="se-style-title">Minimal Apple</div>
              <div className="se-style-desc">Soft, airy, focus on typography.</div>
            </div>
            <div className="se-style-card" onClick={() => openApp('glassLanding')}>
              <div className="se-style-title">Glassmorphism</div>
              <div className="se-style-desc">Frosted panels and subtle blur.</div>
            </div>
            <div className="se-style-card" onClick={() => openApp('cleanLanding')}>
              <div className="se-style-title">Clean Corporate</div>
              <div className="se-style-desc">Bold headers, strong grid, corporate feel.</div>
            </div>
          </div>
        </section>

        <footer className="se-footer">© {new Date().getFullYear()} example pages — open from desktop</footer>
      </div>
    </div>
  );
}
