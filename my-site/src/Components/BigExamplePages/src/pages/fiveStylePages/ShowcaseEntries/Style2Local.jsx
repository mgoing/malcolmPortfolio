import { PERSON, PROJECTS, SKILLS, NAV_LINKS } from "../ShowcaseContent";
import "./Style2Local.css";

export default function Style2Local() {
  return (
    <div className="local">

      {/* Masthead */}
      <header className="local__masthead">
        <div className="local__masthead-top">
          <span className="local__date">Est. Your Year · {PERSON.location}</span>
          <span className="local__edition">Vol. I — Portfolio Edition</span>
        </div>
        <div className="local__masthead-rule" />
        <h1 className="local__masthead-title">{PERSON.name}</h1>
        <p className="local__masthead-sub">{PERSON.title}</p>
        <div className="local__masthead-rule" />
        <nav className="local__nav">
          {NAV_LINKS.map((l, i) => (
            <span key={l}>
              <a href="#" className="local__nav-link">{l}</a>
              {i < NAV_LINKS.length - 1 && <span className="local__nav-sep"> · </span>}
            </span>
          ))}
        </nav>
        <div className="local__masthead-rule local__masthead-rule--thick" />
      </header>

      {/* Main grid */}
      <main className="local__main">

        {/* Lead story — tagline + bio */}
        <section className="local__lead">
          <div className="local__lead-kicker">About This Person</div>
          <h2 className="local__lead-head">{PERSON.tagline}</h2>
          <div className="local__lead-rule" />
          <p className="local__lead-body">{PERSON.bioLong}</p>
          {PERSON.available && (
            <div className="local__avail">
              ● Currently accepting new commissions
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="local__sidebar">
          <div className="local__sidebar-box">
            <div className="local__sidebar-label">Specialities</div>
            <ul className="local__sidebar-list">
              {SKILLS.map(s => (
                <li key={s} className="local__sidebar-item">— {s}</li>
              ))}
            </ul>
          </div>
          <div className="local__sidebar-box">
            <div className="local__sidebar-label">Get In Touch</div>
            <p className="local__sidebar-contact">{PERSON.email}</p>
            <p className="local__sidebar-contact">{PERSON.location}</p>
          </div>
        </aside>

        {/* Projects — newspaper columns */}
        <section className="local__works">
          <div className="local__works-header">
            <div className="local__works-rule" />
            <span className="local__works-label">Recent Work</span>
            <div className="local__works-rule" />
          </div>
          <div className="local__works-grid">
            {PROJECTS.map((p, i) => (
              <article key={p.id} className={`local__work ${i === 0 ? "local__work--feature" : ""}`}>
                <div className="local__work-thumb" style={{ background: `${p.color}30`, borderLeft: `3px solid ${p.color}` }}>
                  <span className="local__work-num">{String(p.id).padStart(2,'0')}</span>
                </div>
                <div className="local__work-kicker">{p.subtitle} · {p.year}</div>
                <h3 className="local__work-title">{p.title}</h3>
                <p className="local__work-body">{p.desc}</p>
                <div className="local__work-tags">
                  {p.tags.map(t => <span key={t} className="local__work-tag">{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="local__footer">
        <div className="local__footer-rule" />
        <div className="local__footer-inner">
          <span>{PERSON.name} · {PERSON.location}</span>
          <span>{PERSON.email}</span>
        </div>
      </footer>

    </div>
  );
}