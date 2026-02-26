// LandingPages.jsx
import React from 'react';
import LandingTemplate from './LandingTemplate';

export  function GlassLanding({ openApp }) {
  return <LandingTemplate styleKey="glassLanding" themeClass="style-glass" title="Glassmorphism" openApp={openApp} />;
}

export  function CleanLanding({ openApp }) {
  return <LandingTemplate styleKey="cleanLanding" themeClass="style-clean" title="Clean Corporate" openApp={openApp} />;
}

export default function MinimalApple({ openApp }) {
  return <LandingTemplate styleKey="minimalApple" themeClass="style-minimal" title="Minimal Apple" openApp={openApp} />;
}