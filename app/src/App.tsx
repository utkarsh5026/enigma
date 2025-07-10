import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MutantEditor from "./components/layout/enigma-layout";
import { LanguageGuide } from "./components/guide";
import { FloatingConsole } from "./components/console/floating-console";

const App: React.FC = () => {
  const [showFloatingConsole, setShowFloatingConsole] = useState(false);
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

      <FloatingConsole
        isVisible={showFloatingConsole}
        onToggle={() => setShowFloatingConsole(!showFloatingConsole)}
      />
    </div>
  );
};

export default App;
