import { useState } from "react";
import Nav from "./Components/BigExamplePages/src/components/nav";
import HomePage from "./Components/BigExamplePages/src/pages/homepage";
import WorkPage from "./Components/BigExamplePages/src/pages/workpage";
import AboutPage from "./Components/BigExamplePages/src/pages/aboutpage";
import ContactPage from "./Components/BigExamplePages/src/pages/contactpage";
import "./Components/BigExamplePages/src/styles/globals.css";
import "./Components/BigExamplePages/src/styles/retro-back-button.css";


//import StyleShowcase from "./Components/BigExamplePages/src/pages/fiveStylePages/StyleShowcase";


  const path = window.location.pathname.replace(/\/$/, '') || '/';
 
  function RetroBackButton() {
    return (
      <button
        className="retro-back-btn"
        onClick={() => { window.location.href = '/'; }}
        title="Return to Desktop"
      >
        <span className="retro-back-btn__icon">▓</span>
        <span className="retro-back-btn__label">RETURN TO DESKTOP</span>
        <span className="retro-back-btn__icon">▓</span>
      </button>
    );
  }






 function PortfolioApp() {
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


  

      return (
        <div className="app">
          <Nav currentPage={page} navigate={setPage} />
          <main className="main-content">{renderPage()}</main>

          <RetroBackButton/>;
        </div>
      );
 }

    function ShowcaseApp() {
    return (
      <div className="app">
        <StyleShowcase />
        <RetroBackButton />
      </div>
    );
  }


  export default function App() {
    switch (path) {
      case '/portfolio': return <PortfolioApp />;
      case '/showcase':  return <ShowcaseApp />;
  
      // ---- Future pages go here, e.g.: ----
      // case '/experiments': return <ExperimentsApp />;
      // case '/lab':         return <LabApp />;
  
      default:
        // Fallback: redirect unknown paths back to desktop
        window.location.href = '/';
        return null;
    }
  }
