import { useEffect } from "react";
import { PERSON, PROJECTS, SKILLS, NAV_LINKS } from "../ShowcaseContent";
import "./Style4Luxury.css";

export default function Style4Luxury() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("lux--in");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".lux--watch").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lux">

      {/* Nav */}
      <nav className="lux__nav">
        <div className="lux__nav-left">
          {NAV_LINKS.slice(0, 2).map(l => (
            <a key={l} href="#" className="lux__nav-link">{l}</a>
          ))}
        </div>
        <span className="lux__logo">{PERSON.name}</span>
        <div className="lux__nav-right">
          {NAV_LINKS.slice(2).map(l => (
            <a key={l} href="#" className="lux__nav-link">{l}</a>
          ))}
        </div>
      </nav>

      {/* Hero — full bleed, tall, dramatic */}
      <section className="lux__hero">
        <div className="lux__hero-bg" />
        <div className="lux__hero-content">
          <p className="lux__hero-eyebrow">{PERSON.title} · {PERSON.location}</p>
          <h1 className="lux__hero-name">
            {PERSON.name.split(" ").map((w, i) => (
              <span key={i} className="lux__hero-name-word lux--watch" style={{ transitionDelay: `${i * 0.15}s` }}>
                {w}
              </span>
            ))}
          </h1>
          <div className="lux__hero-divider" />
          <p className="lux__hero-tagline lux--watch">{PERSON.tagline}</p>
          {PERSON.available && (
            <p className="lux__hero-avail lux--watch">— Available for engagement</p>
          )}
        </div>
        <div className="lux__hero-index">
          <span>001</span>
          <div className="lux__hero-index-line" />
        </div>
      </section>

      {/* Bio — editorial two-column */}
      <section className="lux__bio lux--watch">
        <div className="lux__bio-label">
          <span className="lux__label-num">II</span>
          <span className="lux__label-text">About</span>
        </div>
        <div className="lux__bio-text">
          <p className="lux__bio-pull">{PERSON.tagline}</p>
          <p className="lux__bio-body">{PERSON.bioLong}</p>
        </div>
        <div className="lux__bio-skills">
          {SKILLS.map((s, i) => (
            <div key={s} className="lux__bio-skill">
              <span className="lux__bio-skill-num">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects — tall editorial cards */}
      <section className="lux__works">
        <div className="lux__works-header lux--watch">
          <span className="lux__label-num">III</span>
          <h2 className="lux__works-title">Selected Work</h2>
          <div className="lux__works-rule" />
        </div>
        {PROJECTS.map((p, i) => (
          <article key={p.id} className={`lux__work lux--watch ${i % 2 === 1 ? "lux__work--alt" : ""}`}>
            <div className="lux__work-num">{String(p.id).padStart(3, "0")}</div>
            <div
              className="lux__work-visual"
              style={{ background: `linear-gradient(160deg, ${p.color}22 0%, #0a0a0a 100%)` }}
            >
              <div className="lux__work-visual-line" style={{ background: p.color }} />
            </div>
            <div className="lux__work-info">
              <p className="lux__work-meta">{p.subtitle} · {p.year}</p>
              <h3 className="lux__work-title">{p.title}</h3>
              <p className="lux__work-desc">{p.desc}</p>
              <div className="lux__work-tags">
                {p.tags.map(t => <span key={t} className="lux__work-tag">{t}</span>)}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Contact — full-bleed minimal */}
      <section className="lux__contact lux--watch">
        <div className="lux__contact-inner">
          <p className="lux__contact-label">IV · Contact</p>
          <h2 className="lux__contact-head">Begin a conversation.</h2>
          <a href={`mailto:${PERSON.email}`} className="lux__contact-link">
            {PERSON.email}
          </a>
        </div>
      </section>

    </div>
  );
}