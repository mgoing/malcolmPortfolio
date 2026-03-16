import { useEffect, useRef } from "react";
import { PERSON, PROJECTS, SKILLS, NAV_LINKS } from "../ShowcaseContent";
import "./Style3Nature.css";

export default function Style3Nature() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const y = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("nature--in");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".nature--watch").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="nature">

      {/* Organic background blobs */}
      <div className="nature__bg" ref={parallaxRef}>
        <div className="nature__blob nature__blob--1" />
        <div className="nature__blob nature__blob--2" />
        <div className="nature__blob nature__blob--3" />
      </div>

      {/* Nav */}
      <nav className="nature__nav">
        <div className="nature__nav-logo">
          <div className="nature__nav-mark" />
          <span>{PERSON.name.split(" ")[0]}</span>
        </div>
        <ul className="nature__nav-links">
          {NAV_LINKS.map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </nav>

      {/* Hero */}
      <section className="nature__hero">
        <div className="nature__hero-inner">
          <p className="nature__eyebrow">✦ {PERSON.title}</p>
          <h1 className="nature__headline">
            {PERSON.name.split(" ").map((word, i) => (
              <span key={i} className="nature__headline-word">{word}</span>
            ))}
          </h1>
          <p className="nature__tagline">{PERSON.tagline}</p>
          <div className="nature__hero-cta">
            <a href="#" className="nature__btn">Explore Work</a>
            {PERSON.available && <span className="nature__avail">✦ Open to collaboration</span>}
          </div>
        </div>
        <div className="nature__hero-decor">
          <div className="nature__ring nature__ring--1" />
          <div className="nature__ring nature__ring--2" />
          <div className="nature__ring nature__ring--3" />
        </div>
      </section>

      {/* About strip */}
      <section className="nature__about nature--watch">
        <div className="nature__leaf-divider">❧</div>
        <div className="nature__about-inner">
          <p className="nature__about-text">{PERSON.bioLong}</p>
          <div className="nature__skills">
            {SKILLS.map(s => (
              <span key={s} className="nature__skill">
                <span className="nature__skill-dot" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — irregular organic grid */}
      <section className="nature__projects nature--watch">
        <h2 className="nature__section-title">
          <span className="nature__section-line" />
          Grown Work
          <span className="nature__section-line" />
        </h2>
        <div className="nature__project-grid">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`nature__project nature__project--${i + 1} nature--watch`}
              style={{ "--proj-color": p.color }}
            >
              <div className="nature__project-blob" />
              <div className="nature__project-content">
                <span className="nature__project-year">{p.year}</span>
                <h3 className="nature__project-title">{p.title}</h3>
                <p className="nature__project-sub">{p.subtitle}</p>
                <p className="nature__project-desc">{p.desc}</p>
                <div className="nature__project-tags">
                  {p.tags.map(t => (
                    <span key={t} className="nature__project-tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="nature__contact nature--watch">
        <div className="nature__leaf-divider">✿</div>
        <h2 className="nature__contact-head">Let's grow something together.</h2>
        <a href={`mailto:${PERSON.email}`} className="nature__contact-link">
          {PERSON.email}
        </a>
        <p className="nature__contact-loc">{PERSON.location}</p>
      </section>

    </div>
  );
}