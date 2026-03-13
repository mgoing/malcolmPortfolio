/**
 * WORK PAGE
 *
 * React Bits components used here:
 * ─────────────────────────────────────────────────────────────
 * 1. <GlitchText />       → reactbits.dev/text-animations/glitch-text
 *    Place in: Page heading
 *    Usage: <GlitchText speed={1} enableShadows={true} enableOnHover={false} className="display-lg">WORK</GlitchText>
 *
 * 2. <SpotlightCard />    → reactbits.dev/components/spotlight-card
 *    Place in: Each project card
 *    Usage: <SpotlightCard className="project-card" spotlightColor="rgba(200,255,0,0.12)">...</SpotlightCard>
 *
 * 3. <PixelTransition />  → reactbits.dev/animations/pixel-transition
 *    Place in: Wrapping project card thumbnails for hover reveal
 *    Usage: <PixelTransition firstContent={<img src={...}/>} secondContent={<ProjectDetails/>} gridSize={10} />
 *
 * 4. <Magnet />           → reactbits.dev/animations/magnet
 *    Place in: "Open Project" CTA on each card
 *    Usage: <Magnet padding={60}><button className="btn btn-acid">Open ↗</button></Magnet>
 *
 * 5. <CircularText />     → reactbits.dev/text-animations/circular-text
 *    Place in: Filter section decorative badge
 *    Usage: <CircularText text="SELECTED WORK · 2024 · " onHover="speedUp" spinDuration={12} className="circular-badge" />
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import "./WorkPage.css";
import CircularText from "../components/reactbits/CircularText";
import Magnet from "../components/reactbits/Magnet";
import PixelTransition from '../components/reactbits/PixelTransition';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import GlitchText from '../components/reactbits/GlitchText';

const filters = ["All", "Brand", "Product", "Motion", "System"];

const projects = [
  { id: 1, title: "NOCTURN",   cat: "Brand",   year: "2024", role: "Art Direction, Identity", color: "#ff0080", tags: ["Logo", "Typography", "Collateral"] },
  { id: 2, title: "VERTEX AI", cat: "Product",  year: "2024", role: "Product Design, Prototyping", color: "#00e5ff", tags: ["UI/UX", "Design System", "Motion"] },
  { id: 3, title: "FLARE OS",  cat: "System",   year: "2023", role: "Design System Architecture", color: "#c8ff00", tags: ["Tokens", "Docs", "Components"] },
  { id: 4, title: "DEEP FORM", cat: "Motion",   year: "2023", role: "Creative Direction, Motion", color: "#ffaa00", tags: ["3D", "WebGL", "GSAP"] },
  { id: 5, title: "HALCYON",   cat: "Brand",    year: "2023", role: "Brand Identity, Web", color: "#c8ff00", tags: ["Logo", "Web", "Brand"] },
  { id: 6, title: "SYNAPSE",   cat: "Product",  year: "2022", role: "UX Research, Interface Design", color: "#ff0080", tags: ["Research", "UX", "Data Viz"] },
];

export default function WorkPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter(p => p.cat === active);

  return (
    <div className="work-page">
      <div className="container">
 
        {/* ── Header ── */}
        <div className="work-page__header">
          <div>
            <span className="label">01 — Portfolio</span>
            {/* [RB] Replace <h1> with <GlitchText speed={1} enableShadows enableOnHover={false} className="display-lg work-page__title">WORK</GlitchText> */}
            <h1 className="display-lg work-page__title">WORK</h1>
          </div>
 
          <div className="work-page__header-aside">
            {/* [RB] Replace this div with <CircularText text="SELECTED WORK · 2024 · " onHover="speedUp" spinDuration={12} /> */}
            <div className="circular-badge-placeholder">
              <div className="circular-inner">
                <span className="label">VIEW ALL</span>
              </div>
            </div>
          </div>
        </div>
 
        {/* ── Filters ── */}
        <div className="work-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`work-filter ${active === f ? "work-filter--active" : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
          <span className="work-count label">{filtered.length} projects</span>
        </div>

        {/* ── Grid ── */}
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <SpotlightCard
              key={p.id}
              spotlightColor={p.color + "22"}
              className="project-card card"
              style={{ "--accent": p.color, animationDelay: `${i * 0.08}s` }}
            >
              <PixelTransition
                gridSize={8}
                firstContent={
                  <div
                    className="project-card__thumb"
                    style={{ background: `radial-gradient(circle at 25% 35%, ${p.color}30, transparent 60%), var(--bg-card)` }}
                  >
                    <span className="project-card__idx label">0{p.id}</span>
                    <div className="project-card__hover-reveal">
                      {p.tags.map(t => (
                        <span key={t} className="project-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                }
                secondContent={
                  <div className="project-card__detail-inner">
                    <span className="project-card__detail-cat label">{p.cat}</span>
                    <h3 className="project-card__detail-title">{p.title}</h3>
                    <p className="project-card__detail-role">{p.role}</p>
                  </div>
                }
              />
 
              <div className="project-card__body">
                <div className="project-card__meta">
                  <span className="label">{p.cat}</span>
                  <span className="label" style={{ color: "var(--text-muted)" }}>{p.year}</span>
                </div>
                <h2 className="project-card__title">{p.title}</h2>
                <p className="project-card__role">{p.role}</p>
 
                <div className="project-card__footer">
                  <Magnet padding={50} disabled={false}>
                    <button className="btn btn-acid project-card__cta">Open ↗</button>
                  </Magnet>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
 
      </div>
    </div>
  );
}