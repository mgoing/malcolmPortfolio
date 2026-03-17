/**
 * HOME PAGE
 *
 * React Bits components used here:
 * ─────────────────────────────────────────────────────────────
 * 1. <Aurora />          → reactbits.dev/backgrounds/aurora        [ACTIVE]
 * 2. <BlurText />        → reactbits.dev/text-animations/blur-text [ACTIVE]
 * 3. <SplitText />       → reactbits.dev/text-animations/split-text[ACTIVE]
 * 4. <Magnet />          → reactbits.dev/animations/magnet         [ACTIVE]
 * 5. <AnimatedList />    → reactbits.dev/components/animated-list  [ACTIVE]
 * 6. <TiltedCard />      → reactbits.dev/components/tilted-card    [ACTIVE]
 *
 * NOT USED (requires Pro or unavailable):
 * - Marquee   → replaced with CSS ticker
 * - CountUp   → replaced with static spans
 * ─────────────────────────────────────────────────────────────
 */

import "./homepage.css";

import Aurora       from "../components/reactbits/Aurora";
import BlurText     from "../components/reactbits/BlurText";
import SplitText    from "../components/reactbits/SplitText";
import Magnet       from "../components/reactbits/Magnet";
import AnimatedList from "../components/reactbits/AnimatedList";
import TiltedCard   from "../components/reactbits/TiltedCard";

// AnimatedList expects plain strings, not objects
const services = [
  "Brand Identity & Visual Systems",
  "Motion & Interactive Design",
  "Frontend Engineering",
  "Design Systems & Tokens",
  "Creative Direction",
  "Immersive Web Experiences",
];

const stats = [
  { value: "140+", label: "Projects shipped" },
  { value: "8yr",  label: "In the craft" },
  { value: "99%",  label: "Client retention" },
  { value: "∞",    label: "Attention to detail" },
];

const tech = ["React", "TypeScript", "Three.js", "GSAP", "Framer Motion", "WebGL", "Node", "Figma", "Next.js", "Vite"];

const works = [
  { title: "Nocturn",   tag: "Brand / Motion", year: "2024", color: "#ff0080" },
  { title: "Vertex AI", tag: "Product Design",  year: "2024", color: "#00e5ff" },
  { title: "Flare OS",  tag: "Design System",   year: "2023", color: "#c8ff00" },
];

export default function HomePage({ navigate }) {
  return (
    <div className="home noise">

      {/* ══════ HERO ══════ */}
      <section className="hero">

        <Aurora
          colorStops={["#c8ff00", "#00e5ff", "#ff0080"]}
          blend={0.5}
          amplitude={1.2}
          speed={0.5}
        />

        <div className="container hero__inner">
          <div className="hero__eyebrow fade-up">
            <span className="label">◈ Design Studio — Est. 2016</span>
          </div>

          <BlurText
            text="GOING"
            animateBy="words"
            direction="top"
            delay={150}
            className="display-xl hero__headline"
          />
          <h1 className="display-xl hero__headline hero__headline--outline fade-up fade-up-2">
            STUDIO
          </h1>

          <SplitText
            text="We build interfaces that feel alive."
            className="hero__sub"
            delay={30}
          />

          <div className="hero__cta fade-up fade-up-4">
            <Magnet padding={80} disabled={false}>
              <button className="btn btn-acid" onClick={() => navigate("work")}>
                View Work <span>↗</span>
              </button>
            </Magnet>
            <Magnet padding={80} disabled={false}>
              <button className="btn btn-ghost" onClick={() => navigate("contact")}>
                Start a Project
              </button>
            </Magnet>
          </div>

          <div className="hero__scroll-hint fade-up fade-up-4">
            <div className="scroll-line" />
            <span className="label">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════ TECH TICKER (CSS — Marquee not available) ══════ */}
      <div className="ticker">
        <div className="ticker__track">
          {[...tech, ...tech].map((t, i) => (
            <span key={i} className="ticker__item">
              {t} <span className="ticker__sep">◈</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════ SERVICES ══════ */}
      <section className="section services">
        <div className="container">
          <div className="services__header">
            <span className="label">02 — Services</span>
            <h2 className="display-lg services__title">WHAT<br />WE DO</h2>
          </div>

          <div className="services__layout">
            <AnimatedList
              items={services}
              showGradients={true}
              enableArrowNavigation={true}
            />

            <div className="services__aside">
              <p className="services__blurb">
                We partner with ambitious founders and teams to craft digital
                products that sit at the intersection of art and engineering.
                No templates. No shortcuts. Just obsessive craft.
              </p>
              <button className="btn btn-ghost" onClick={() => navigate("about")}>
                Our Process →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="stats-strip">
        <div className="container stats-strip__grid">
          {stats.map((s, i) => (
            <div key={i} className="stat">
              <span className="stat__number">{s.value}</span>
              <span className="stat__label label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURED WORK ══════ */}
      <section className="section featured">
        <div className="container">
          <div className="featured__header">
            <span className="label">03 — Selected Work</span>
            <button className="btn btn-ghost featured__all" onClick={() => navigate("work")}>
              View All →
            </button>
          </div>

          <div className="featured__grid">
            {works.map((w, i) => (
              <TiltedCard key={i} captionText={w.title} tiltMaxAngle={10} scaleOnHover={1.04}>
                <div className="work-card card" style={{ "--accent": w.color }}>
                  <div
                    className="work-card__thumb"
                    style={{ background: `radial-gradient(circle at 30% 40%, ${w.color}22, transparent 60%), var(--bg-card)` }}
                  >
                    <span className="work-card__index label">0{i + 1}</span>
                  </div>
                  <div className="work-card__body">
                    <div className="work-card__meta">
                      <span className="label">{w.tag}</span>
                      <span className="label" style={{ color: "var(--text-muted)" }}>{w.year}</span>
                    </div>
                    <h3 className="work-card__title">{w.title}</h3>
                  </div>
                </div>
              </TiltedCard>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}