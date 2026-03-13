import { useState } from "react";
import Nav from "./components/BigExamplePages/src/components/nav";
import HomePage from "./Components/BigExamplePages/src/pages/homepage";
import WorkPage from "./Components/BigExamplePages/src/pages/workpage";
import AboutPage from "./Components/BigExamplePages/src/pages/aboutpage";
import ContactPage from "./Components/BigExamplePages/src/pages/contactpage";
import "./Components/BigExamplePages/src/styles/globals.css";
import "./Components/BigExamplePages/src/styles/retro-back-button.css";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage navigate={setPage} />;
      case "work":    return <WorkPage navigate={setPage} />;
      case "about":   return <AboutPage navigate={setPage} />;
      case "contact": return <ContactPage navigate={setPage} />;
      default:        return <HomePage navigate={setPage} />;
    }
  };

  function handleReturnToDesktop() {
    window.location.href = '/';
  }

  return (
    <div className="app">
      <Nav currentPage={page} navigate={setPage} />
      <main className="main-content">{renderPage()}</main>

      {/* ── Retro back button — always visible, bottom-left ── */}
      <button
        className="retro-back-btn"
        onClick={handleReturnToDesktop}
        title="Return to Desktop"
      >
        <span className="retro-back-btn__icon">▓</span>
        <span className="retro-back-btn__label">RETURN TO DESKTOP</span>
        <span className="retro-back-btn__icon">▓</span>
      </button>
    </div>
  );
}