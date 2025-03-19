import { useEffect } from "react";
import MutantEditor from "./components/panel/Editor";

const App: React.FC = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col font-family-mono bg-tokyo-bg">
      <MutantEditor />
    </div>
  );
};

export default App;
