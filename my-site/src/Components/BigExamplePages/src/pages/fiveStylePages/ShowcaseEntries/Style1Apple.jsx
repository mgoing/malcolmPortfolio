import { useEffect, useRef } from "react";
import { PERSON, PROJECTS, SKILLS, NAV_LINKS } from "../ShowcaseContent";
import "./Style1Apple.css";

export default function Style1Apple() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("apple--visible");
      }),
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = i => el => { sectionsRef.current[i] = el; };

  return (
    <div className="apple">

      {/* Nav */}
      <nav className="apple__nav">
        <span className="apple__logo">{PERSON.name.split(" ")[0]}</span>
        <ul className="apple__nav-links">
          {NAV_LINKS.map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </nav>

      {/* Hero */}
      <section className="apple__hero apple--reveal" ref={ref(0)}>
        <p className="apple__eyebrow">{PERSON.title}</p>
        <h1 className="apple__headline">{PERSON.name}</h1>
        <p className="apple__tagline">{PERSON.tagline}</p>
        <div className="apple__hero-cta">
          <a href="#" className="apple__btn apple__btn--fill">View Work</a>
          <a href="#" className="apple__btn apple__btn--outline">Get in Touch</a>
        </div>
        {PERSON.available && (
          <div className="apple__avail">
            <span className="apple__avail-dot" />
            Available for new projects
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="apple__projects apple--reveal" ref={ref(1)}>
        <h2 className="apple__section-label">Selected Work</h2>
        <div className="apple__project-list">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className="apple__project" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="apple__project-thumb" style={{ background: `linear-gradient(135deg, ${p.color}33, ${p.color}11)` }} />
              <div className="apple__project-info">
                <div className="apple__project-meta">
                  <span>{p.subtitle}</span>
                  <span>{p.year}</span>
                </div>
                <h3 className="apple__project-title">{p.title}</h3>
                <p className="apple__project-desc">{p.desc}</p>
                <div className="apple__tags">
                  {p.tags.map(t => <span key={t} className="apple__tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="apple__about apple--reveal" ref={ref(2)}>
        <div className="apple__about-inner">
          <h2 className="apple__section-label">About</h2>
          <p className="apple__about-text">{PERSON.bioLong}</p>
          <div className="apple__skills">
            {SKILLS.map(s => (
              <span key={s} className="apple__skill">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="apple__contact apple--reveal" ref={ref(3)}>
        <h2 className="apple__contact-head">Let's work together.</h2>
        <a href={`mailto:${PERSON.email}`} className="apple__contact-link">
          {PERSON.email}
        </a>
        <p className="apple__contact-loc">{PERSON.location}</p>
      </section>

    </div>
  );
}