/**
 * CONTACT PAGE
 *
 * React Bits components used here:
 * ─────────────────────────────────────────────────────────────
 * 1. <DecryptedText />    → reactbits.dev/text-animations/decrypted-text
 *    Place in: Page heading
 *    Usage: <DecryptedText text="LET'S TALK" animateOn="view" speed={80} maxIterations={15} className="display-lg" />
 *
 * 2. <StarBorder />       → reactbits.dev/components/star-border
 *    Place in: Submit button wrapper
 *    Usage: <StarBorder as="button" type="submit" color="#c8ff00" speed="4s" className="star-submit">
 *               Send Message →
 *            </StarBorder>
 *
 * 3. <FadeContent />      → reactbits.dev/animations/fade-content
 *    Place in: Wrapping each form section for entrance animation
 *    Usage: <FadeContent blur={true} duration={0.8} delay={0.2}>...</FadeContent>
 *
 * 4. <VariableProximity /> → reactbits.dev/text-animations/variable-proximity
 *    Place in: "GOING" large decorative text in sidebar
 *    Usage: <VariableProximity label="GOING" fromFontVariationSettings="'wght' 100" toFontVariationSettings="'wght' 900" radius={200} containerRef={sideRef} />
 *
 * 5. <Noise />            → reactbits.dev/backgrounds/noise (or <DotGrid />)
 *    Place in: Contact sidebar background
 *    Usage: <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternAlpha={25} />
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef } from "react";
import "./contactpage.css";
import DecryptedText from "../components/reactbits/DecryptedText";
import StarBorder from "../components/reactbits/StarBorder";
import FadeContent from "../components/reactbits/FadeContent";
import VariableProximity from "../components/reactbits/VariableProximity";
import Noise from "../components/reactbits/Noise";

const socials = [
  { label: "Twitter/X",  handle: "@goingstudio", href: "#" },
  { label: "Dribbble",   handle: "goingstudio",  href: "#" },
  { label: "LinkedIn",   handle: "Going Studio", href: "#" },
  { label: "GitHub",     handle: "going-dev",    href: "#" },
];

const services = [
  "Brand Identity",
  "Product Design",
  "Motion & 3D",
  "Frontend Dev",
  "Design System",
  "Creative Direction",
];

export default function ContactPage() {
  const sideRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [sent, setSent] = useState(false);

  const toggleService = (s) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="container contact-page__inner">

        {/* ── Sidebar ── */}
        <aside className="contact-side" ref={sideRef}>
          {/* [RB] Add <Noise patternAlpha={25} /> as background */}
          <Noise patternAlpha={25} />
          <div className="contact-side__noise-bg" />

          <div className="contact-side__content">
            <span className="label">03 — Contact</span>

            {/* [RB] Replace with <VariableProximity label="GOING" fromFontVariationSettings="'wght' 100" toFontVariationSettings="'wght' 900" radius={200} containerRef={sideRef} className="contact-side__giant" /> */}
           {/* <div className="contact-side__giant">GOING</div> */}
           <VariableProximity label="GOING" fromFontVariationSettings="'wght' 100" toFontVariationSettings="'wght' 900" radius={200} containerRef={sideRef} className="contact-side__giant" />

            <div className="contact-side__info">
              <p className="contact-side__tagline">
                Got a project in mind?<br />
                We'd love to hear it.
              </p>
              <a href="mailto:hello@going.studio" className="contact-side__email">
                hello@going.studio
              </a>
            </div>

            <div className="contact-side__socials">
              {socials.map(s => (
                <a key={s.label} href={s.href} className="social-row">
                  <span className="social-row__label label">{s.label}</span>
                  <span className="social-row__handle">{s.handle}</span>
                  <span className="social-row__arrow">↗</span>
                </a>
              ))}
            </div>

            <div className="contact-side__availability">
              <div className="avail-dot" />
              <span className="label">Currently taking on Q3 projects</span>
            </div>
          </div>
        </aside>

        {/* ── Form ── */}
        <div className="contact-form-wrap">
          {/* [RB] Wrap heading in <FadeContent blur duration={0.8}> */}
          <div className="contact-form__header">
            {/* [RB] Replace h1 with <DecryptedText text="LET'S TALK" animateOn="view" speed={80} maxIterations={15} className="display-lg contact-form__title" /> */}
          {/*  <h1 className="display-lg contact-form__title">LET'S<br />TALK</h1> */}
          <DecryptedText text="LET'S TALK" animateOn="view" speed={80} maxIterations={15} className="display-lg contact-form__title" />
          </div>

          {sent ? (
            <div className="contact-success">
              <div className="contact-success__icon">◈</div>
              <h2 className="heading-md">Message received.</h2>
              <p>We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>

              {/* Name + Email row */}
              {/* [RB] Wrap in <FadeContent blur delay={0.1}> */}
              <FadeContent blur delay={0.1}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label label" htmlFor="name">Your Name</label>
                  <input
                    id="name" name="name" type="text" required
                    className="form-input" placeholder="Alex Doe"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label label" htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email" required
                    className="form-input" placeholder="alex@company.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
              </div>
              </FadeContent>

              {/* Service selector */}
              {/* [RB] Wrap in <FadeContent blur delay={0.2}> */}
              <FadeContent blur delay={0.2}>
              <div className="form-field">
                <label className="form-label label">Services Needed</label>
                <div className="service-chips">
                  {services.map(s => (
                    <button
                      key={s} type="button"
                      className={`service-chip ${selected.includes(s) ? "service-chip--active" : ""}`}
                      onClick={() => toggleService(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              </FadeContent>

              {/* Budget */}
              {/* [RB] Wrap in <FadeContent blur delay={0.3}> */}
              <FadeContent blur delay={0.3}>
              <div className="form-field">
                <label className="form-label label" htmlFor="budget">Estimated Budget</label>
                <select id="budget" name="budget" className="form-input form-select" value={form.budget} onChange={handleChange}>
                  <option value="">Select range</option>
                  <option value="10-25k">$10k – $25k</option>
                  <option value="25-50k">$25k – $50k</option>
                  <option value="50-100k">$50k – $100k</option>
                  <option value="100k+">$100k+</option>
                </select>
              </div>
              </FadeContent>

              {/* Message */}
              {/* [RB] Wrap in <FadeContent blur delay={0.4}> */}
              <FadeContent blur delay={0.4}>
              <div className="form-field">
                <label className="form-label label" htmlFor="message">Project Brief</label>
                <textarea
                  id="message" name="message" rows={5} required
                  className="form-input form-textarea"
                  placeholder="Tell us about your project, timeline, and goals..."
                  value={form.message} onChange={handleChange}
                />
              </div>
              </FadeContent>

              {/* Submit */}
              <div className="form-submit">
                {/*
                  [RB] Replace button with:
                  <StarBorder as="button" type="submit" color="#c8ff00" speed="4s" className="star-submit">
                    Send Message →
                  </StarBorder>
                
                <button type="submit" className="btn btn-acid form-submit-btn">
                  Send Message →
                </button>*/}
                <StarBorder as="button" type="submit" color="#c8ff00" speed="4s" className="star-submit">
                    Send Message →
                  </StarBorder>
                <span className="form-note label">
                  We respond within 24 hours.
                </span>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}