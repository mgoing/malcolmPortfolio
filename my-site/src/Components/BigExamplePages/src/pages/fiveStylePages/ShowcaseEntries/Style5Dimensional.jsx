import { useState, useEffect, useRef } from "react";
import { PERSON, PROJECTS, SKILLS, NAV_LINKS } from "../ShowcaseContent";
import "./Style5Dimensional.css";

export default function Style5Dimensional() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(null);
  const sceneRef = useRef(null);

  // Subtle parallax on hero based on mouse
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("dim--in");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".dim--watch").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const tiltStyle = {
    transform: `rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 4}deg)`,
  };

  return (
    <div className="dim">

      {/* Deep space grid background */}
      <div className="dim__bg">
        <div className="dim__grid" />
        <div className="dim__glow dim__glow--1" />
        <div className="dim__glow dim__glow--2" />
        <div className="dim__glow dim__glow--3" />
      </div>

      {/* Nav */}
      <nav className="dim__nav">
        <span className="dim__logo">{PERSON.name.split(" ")[0]}<span className="dim__logo-accent">.dev</span></span>
        <ul className="dim__nav-links">
          {NAV_LINKS.map(l => <li key={l}><a href="#" className="dim__nav-link">{l}</a></li>)}
        </ul>
        {PERSON.available && <span className="dim__nav-badge">AVAILABLE</span>}
      </nav>

      {/* Hero — 3D tilt card */}
      <section className="dim__hero" ref={sceneRef}>
        <div className="dim__scene">
          <div className="dim__hero-card" style={tiltStyle}>
            {/* Glass layers */}
            <div className="dim__hero-layer dim__hero-layer--back" />
            <div className="dim__hero-layer dim__hero-layer--mid" />
            <div className="dim__hero-content">
              <p className="dim__eyebrow">
                <span className="dim__eyebrow-line" />{PERSON.title}
              </p>
              <h1 className="dim__headline">{PERSON.name}</h1>
              <p className="dim__tagline">{PERSON.tagline}</p>
              <div className="dim__hero-actions">
                <button className="dim__btn dim__btn--primary">View Work</button>
                <button className="dim__btn dim__btn--glass">Contact</button>
              </div>
            </div>
            {/* Floating chips */}
            <div className="dim__chip dim__chip--1">React</div>
            <div className="dim__chip dim__chip--2">Motion</div>
            <div className="dim__chip dim__chip--3">3D</div>
            {/* Corner accents */}
            <div className="dim__corner dim__corner--tl" />
            <div className="dim__corner dim__corner--br" />
          </div>
        </div>
      </section>

      {/* Skills — floating pills in 3D space */}
      <section className="dim__skills dim--watch">
        <h2 className="dim__section-title">Capabilities</h2>
        <div className="dim__skills-cloud">
          {SKILLS.map((s, i) => (
            <div
              key={s}
              className="dim__skill-pill"
              style={{
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${6 + i * 0.8}s`,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Projects — stacked 3D cards */}
      <section className="dim__projects dim--watch">
        <h2 className="dim__section-title">Selected Work</h2>
        <div className="dim__project-stack">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`dim__project-card ${active === i ? "dim__project-card--active" : ""}`}
              style={{ "--proj-color": p.color, "--stack-i": i }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="dim__project-card-inner">
                {/* Front face */}
                <div className="dim__project-front">
                  <div className="dim__project-glow" />
                  <div className="dim__project-header">
                    <span className="dim__project-num">0{p.id}</span>
                    <span className="dim__project-year">{p.year}</span>
                  </div>
                  <h3 className="dim__project-title">{p.title}</h3>
                  <p className="dim__project-sub">{p.subtitle}</p>
                  <div className="dim__project-bar" />
                  <p className="dim__project-hint">Click to expand</p>
                </div>
                {/* Expanded detail */}
                {active === i && (
                  <div className="dim__project-detail">
                    <p className="dim__project-desc">{p.desc}</p>
                    <div className="dim__project-tags">
                      {p.tags.map(t => <span key={t} className="dim__project-tag">{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
              {/* Side depth illusion */}
              <div className="dim__project-side" />
              <div className="dim__project-bottom" />
            </div>
          ))}
        </div>
      </section>

      {/* About — glass panel */}
      <section className="dim__about dim--watch">
        <div className="dim__glass-panel">
          <div className="dim__glass-header">
            <span className="dim__glass-dot dim__glass-dot--red" />
            <span className="dim__glass-dot dim__glass-dot--yellow" />
            <span className="dim__glass-dot dim__glass-dot--green" />
            <span className="dim__glass-title">about.txt</span>
          </div>
          <div className="dim__glass-body">
            <p className="dim__about-text">{PERSON.bioLong}</p>
            <div className="dim__about-meta">
              <span className="dim__about-loc">📍 {PERSON.location}</span>
              <a href={`mailto:${PERSON.email}`} className="dim__about-email">{PERSON.email}</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}