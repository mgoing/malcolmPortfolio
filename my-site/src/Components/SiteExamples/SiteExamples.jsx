import React from 'react';
import './siteExamples.css';

/**
 * SiteExamples - small "desktop" app that shows cards for each design option.
 * openApp is a function from the parent that opens the app id (same as openApp in RetroDesktop)
 */
export default function SiteExamples({ openApp }) {
  const styles = [
    { id: 'minimalApple', title: 'Minimal Apple', desc: 'Soft, airy, typographic' },
    { id: 'glassLanding', title: 'Glassmorphism', desc: 'Frosted glass panels' },
    { id: 'cleanLanding', title: 'Clean Corporate', desc: 'Crisp, professional' },
  ];

  return (
    <div className="se-root">
      <div className="se-container">
        <header className="se-header">
          <div className="se-brand"><div className="se-logo">MG</div><div><div style={{fontWeight:700}}>Site examples</div>
          <div style={{fontSize:12,color:'#bccada'}}>Pick a design to preview</div>
          <div style={{fontSize:12,color:'#bccada'}}>This feature is not representative of my design skill and a work-in progress </div></div></div>
        </header>

        <section style={{marginTop:18}}>
          <div className="se-style-catalog">
            {styles.map(s => (
              <div key={s.id} className="se-style-card" onDoubleClick={() => openApp(s.id)} onClick={() => openApp(s.id)}>
                <div className="se-style-title">{s.title}</div>
                <div className="se-style-desc">{s.desc}</div>
                <div className="se-preview" style={{
                  marginTop:8,
                  background: s.id === 'minimalApple' ? 'linear-gradient(90deg,#ffffff,#f0f7fb)' :
                             s.id === 'glassLanding' ? 'linear-gradient(90deg,#6bbcc5,#7af3ff)' :
                             'linear-gradient(90deg,#071322,#052f45)'
                }} />
              </div> //#6bbcc5
            ))}
          </div>
        </section>

        <footer className="se-footer" style={{marginTop:18}}>Double-click or click a card to open the example as a window.</footer>
      </div>
    </div>
  );
}
