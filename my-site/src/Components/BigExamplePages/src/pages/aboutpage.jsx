/**
 * ABOUT PAGE
 *
 * React Bits components used here:
 * ─────────────────────────────────────────────────────────────
 * 1. <RotatingText />     → reactbits.dev/text-animations/rotating-text
 *    Place in: Hero headline cycling descriptor
 *    Usage: <RotatingText texts={["Designers","Engineers","Storytellers","Obsessives"]} mainClassName="rotating-word" staggerDuration={0.03} />
 *
 * 2. <ScrollFloat />      → reactbits.dev/text-animations/scroll-float
 *    Place in: "Our Story" paragraph text
 *    Usage: <ScrollFloat animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=30%" scrollEnd="bottom bottom-=40%">
 *             Our story text here
 *           </ScrollFloat>
 *
 * 3. <FlowingMenu />      → reactbits.dev/components/flowing-menu
 *    Place in: Values / principles list
 *    Usage: <FlowingMenu items={[{link:'#', text:'Craft', image: imgUrl}, ...]} />
 *
 * 4. <ShinyText />        → reactbits.dev/text-animations/shiny-text
 *    Place in: "Available for work" badge
 *    Usage: <ShinyText text="✦ Currently Available for Projects" disabled={false} speed={4} className="shiny-badge" />
 *
 * 5. <Ribbons />          → reactbits.dev/backgrounds/ribbons
 *    Place in: Philosophy section background
 *    Usage: <Ribbons colors={['#c8ff00','#ff0080','#00e5ff']} baseVelocity={2} />
 *
 * 6. <ProfileCard />      → reactbits.dev/components/profile-card
 *    Place in: Team member cards
 *    Usage: <ProfileCard name="Alex Reed" title="Creative Director" handle="@alexreed" avatarUrl={...} />
 * ─────────────────────────────────────────────────────────────
 */
//https://www.pexels.com/photo/woman-wearing-white-polo-long-sleeved-shirt-1181695/
//https://www.pexels.com/photo/man-wearing-white-dress-shirt-and-black-blazer-2182970/
//https://www.pexels.com/photo/professional-black-and-white-portrait-headshot-30767565/
//https://www.pexels.com/photo/professional-headshot-of-confident-female-in-greenville-30004323/

import "./aboutPage.css";
import ProfileCard from "../components/reactbits/ProfileCard";
import Ribbons from "../components/reactbits/Ribbons";
import ShinyText from "../components/reactbits/ShinyText";
import FlowingMenu from "../components/reactbits/FlowingMenu";
import ScrollFloat from "../components/reactbits/ScrollFloat";
import RotatingText from "../components/reactbits/RotatingText";
import DivineTechyGirl from "../../../../assets/images/pexels-divinetechygirl.jpg";
import ProlificPeople from "../../../../assets/images/pexels-prolificpeople.jpg";
import Uiliamnorberg from "../../../../assets/images/pexels-uiliamnornberg.jpg";
import Professional from "../../../../assets/images/WhiteOldProfessional.jpg";

const descriptors = ["Designers", "Engineers", "Storytellers", "Obsessives"];

const process = [
  { num: "01", title: "Discover",   body: "We dig deep into your world — brand ambitions, audience, market context — to align strategy before a single pixel is touched." },
  { num: "02", title: "Define",     body: "Concept mapping, moodboards, structural wireframes. We establish the creative spine before building the body." },
  { num: "03", title: "Design",     body: "High-fidelity interfaces crafted with obsessive attention to motion, hierarchy, and feel. Systems thinking from day one." },
  { num: "04", title: "Deliver",    body: "Production-grade code handed off with documentation, QA, and a white-glove launch checklist. Zero mystery boxes." },
];

const values = [
  { text: "Craft First",    sub: "We'd rather do less and do it perfectly." },
  { text: "No Timidity",   sub: "Bold decisions beat safe mediocrity every time." },
  { text: "Systems Think", sub: "Every element belongs to a larger whole." },
  { text: "Ship It",       sub: "Beautiful is worthless if it never ships." },
];

//Team member img needed
const team = [
  { name: "Team Member 1",    title: "Creative Director",    handle: "@TeamMember1", avatarUrl: DivineTechyGirl },
  { name: "Team Member 2",   title: "Lead Engineer",        handle: "@TeamMember2", avatarUrl: Uiliamnorberg  },
  { name: "Team Member 3", title: "Motion Designer",      handle: "@TeamMember3", avatarUrl: ProlificPeople },
  { name: "Team Member 4",   title: "Brand Strategist",     handle: "@TeamMember4", avatarUrl: Professional  },
];

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero container">
        <span className="label">02 — Studio</span>
        <h1 className="display-lg about-hero__title">
          WE ARE
          {/* [RB] Replace the span block below with:
              <RotatingText
                texts={descriptors}
                mainClassName="rotating-word display-lg"
                staggerDuration={0.03}
                rotationInterval={2500}
              /> */}
          {/* <span className="rotating-word-placeholder">
            <span className="rotating-word--cycle">Designers.</span>
          </span> */}
          <RotatingText
                texts={descriptors}
                mainClassName="rotating-word display-lg"
                staggerDuration={0.03}
                rotationInterval={2500}
              />
        </h1>

        {/* [RB] Wrap this p with <ShinyText text="✦ Currently Available for Projects" speed={4} className="shiny-badge" /> */}
        {/* <div className="shiny-badge">✦ Currently Available for Projects</div> */}
        <ShinyText text="✦ Currently Available for Projects" speed={4} className="shiny-badge" />
      </section>

      {/* ── Story ── */}
      <section className="section story">
        <div className="container story__inner">
          <div className="story__left">
            <span className="label">Our Story</span>
            <div className="story__year">2016</div>
          </div>
          <div className="story__right">
            {/* [RB] Wrap each <p> in <ScrollFloat> for scroll-triggered character animation */}
            <ScrollFloat>
            <p className="story__body">
              Going was born out of frustration. Too many beautiful products were
              being shipped as generic, lifeless interfaces — and too many agencies
              were treating design as decoration rather than infrastructure.
            </p>
            </ScrollFloat>
            <ScrollFloat>
            <p className="story__body">
              We built a different kind of studio: small by design, obsessive by nature,
              and committed to the belief that craft at the intersection of engineering
              and art is the last real competitive advantage.
            </p>
            </ScrollFloat>
            <ScrollFloat>
            <p className="story__body">
              Seven years in, 140+ projects shipped, and that conviction has never
              wavered.
            </p>
            </ScrollFloat>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="section process">
        <div className="container">
          <span className="label">How We Work</span>
          <h2 className="display-lg process__title">PROCESS</h2>

          <div className="process__steps">
            {process.map((step, i) => (
              <div key={i} className="process__step" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="process__step-num label">{step.num}</div>
                <div className="process__step-line" />
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values — FlowingMenu zone ── */}
      <section className="section values">
        <div className="container values__header">
          <span className="label">What We Believe</span>
          <h2 className="heading-md values__title">Core Principles</h2>
        </div>

        {/* [RB] Replace this entire div with:
            <FlowingMenu items={values.map(v => ({ link: '#', text: v.text, image: 'placeholder.jpg' }))} />
        */}
        <FlowingMenu items={values.map(v => ({ link: '#', text: v.text, image: 'placeholder.jpg' }))} />
        {/*
        <div className="values__list">
          {values.map((v, i) => (
            <div key={i} className="value-row">
              <span className="value-row__num label">0{i + 1}</span>
              <h3 className="value-row__title">{v.text}</h3>
              <p className="value-row__sub">{v.sub}</p>
            </div>
          ))}
        </div> */}
      </section>

      {/* ── Team ── */}
      <section className="section team">
        <div className="container">
          <span className="label">The People</span>
          <h2 className="display-lg team__title">TEAM</h2>

          <div className="team__grid">
            {team.map((member, i) => (
              /* [RB] Replace with <ProfileCard name={member.name} title={member.title} handle={member.handle} avatarUrl="..." /> */
              <ProfileCard name={member.name} title={member.title} handle={member.handle} avatarUrl="..." />
              
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Quote ── */}
      <section className="philosophy">
        {/* [RB] Add <Ribbons colors={['#c8ff00','#ff0080','#00e5ff']} baseVelocity={2} /> as a background layer */}
        <div className="philosophy__bg-placeholder" />
        <div className="container philosophy__inner">
          <blockquote className="philosophy__quote">
            "The details are not the details.<br />
            They make the design."
          </blockquote>
          <cite className="philosophy__author label">— Charles Eames</cite>
        </div>
      </section>

    </div>
  );
}