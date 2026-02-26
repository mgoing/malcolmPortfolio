// BlogTemplate.jsx
import React from 'react';
import './siteExamples.css';

export default function BlogTemplate({ styleKey, themeClass, title, openApp }) {
  const homeId = styleKey;
  const posts = [
    { id: 1, title: `${title} — design notes`, date: '2025-01-01' },
    { id: 2, title: `${title} — accessibility`, date: '2025-02-10' },
  ];
  return (
    <div className={`se-root ${themeClass}`}>
      <div className="se-container">
        <header className="se-header">
          <div className="se-brand"><div className="se-logo">MG</div><div><div style={{fontWeight:700}}>{title} — Blog</div></div></div>
          <div className="se-nav">
            <button onClick={() => openApp(homeId)}>Home</button>
            <button onClick={() => openApp(`${styleKey}About`)}>About</button>
            <button onClick={() => openApp('siteExamples')}>Examples</button>
          </div>
        </header>

        <main style={{marginTop:18}}>
          <div className="se-grid">
            {posts.map(p => (
              <div key={p.id} className="se-card">
                <div className="meta">{p.date}</div>
                <h3>{p.title}</h3>
                <p className="meta">Short excerpt to show layout.</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
