// AboutTemplate.jsx
import React from 'react';
import './siteExamples.css';

export default function AboutTemplate({ styleKey, themeClass='',title,openApp }) {
  const homeId = styleKey;
  return (
    <div className={`se-root ${themeClass}`}>
      <div className="se-container">
        <header className="se-header">
          <div className="se-brand"><div className="se-logo">MG</div><div><div style={{fontWeight:700}}>{title} — About</div></div></div>
          <div className="se-nav">
            <button onClick={() => openApp(homeId)}>Home</button>
            <button onClick={() => openApp(`${styleKey}Blog`)}>Blog</button>
            <button onClick={() => openApp('siteExamples')}>Examples</button>
          </div>
        </header>

        <main style={{marginTop:18}}>
          <div className="se-card">
            <h2>About — {title}</h2>
            <p className="meta">Short about text and design rationale for the style.</p>
            <p style={{color:'#9fb3c8'}}>This is an example about page showing how content can be structured in the same visual language as the landing.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
