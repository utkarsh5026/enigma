import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MutantEditor from "./components/layout/enigma-layout";
import { LanguageGuide } from "./components/guide";
import EnigmaIntroModal from "./components/intro/intro-modal";

const App: React.FC = () => {
  const [showInroModal, setShowInroModal] = useState(
    localStorage.getItem("showIntroModal") !== "true"
  );

  console.log(localStorage.getItem("showIntroModal"));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
  }, []);

  const handleCloseModal = () => {
    setShowInroModal(false);
    localStorage.setItem("showIntroModal", "true");
  };

  return (
    <div className="flex h-screen w-screen flex-col font-family-mono">
      <Router>
        <Routes>
          <Route path="/guide" element={<LanguageGuide />} />
          <Route path="/" element={<MutantEditor />} />
        </Routes>
      </Router>
      <EnigmaIntroModal isOpen={showInroModal} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
