import { useState } from "react";
import Nav from "./components/Nav";
import HomePage from "./pages/homepage";
import WorkPage from "./pages/workpage";
import AboutPage from "./pages/aboutpage";
import ContactPage from "./pages/contactpage";
import "./styles/globals.css";

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

  return (
    <div className="app">
      <Nav currentPage={page} navigate={setPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}