import { useState, useEffect } from "react";
import "./nav.css";

const links = [
  { id: "home",    label: "Index" },
  { id: "work",    label: "Work" },
  { id: "about",   label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ currentPage, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id) => {
    navigate(id);
    setMenuOpen(false);
  };

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        {/* Logo */}
        <button className="nav__logo" onClick={() => handleNav("home")}>
          <span className="nav__logo-mark">◈</span>
          <span className="nav__logo-text">GOING</span>
        </button>

        {/* Desktop links */}
        <ul className="nav__links">
          {links.map((link, i) => (
            <li key={link.id}>
              <button
                className={`nav__link ${currentPage === link.id ? "nav__link--active" : ""}`}
                onClick={() => handleNav(link.id)}
              >
                <span className="nav__link-num">0{i + 1}</span>
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Status pill */}
        <div className="nav__status">
          <span className="nav__status-dot" />
          <span>Available</span>
        </div>

        {/* Mobile burger */}
        <button
          className={`nav__burger ${menuOpen ? "nav__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav__mobile">
          {links.map((link, i) => (
            <button
              key={link.id}
              className={`nav__mobile-link ${currentPage === link.id ? "active" : ""}`}
              onClick={() => handleNav(link.id)}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="nav__link-num">0{i + 1}</span>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}