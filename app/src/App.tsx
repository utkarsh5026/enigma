import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MutantEditor from "./components/layout/enigma-layout";
import { LanguageGuide } from "./components/guide";

const App: React.FC = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col font-family-mono">
      <Router>
        <Routes>
          <Route path="/guide" element={<LanguageGuide />} />
          <Route path="/" element={<MutantEditor />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
