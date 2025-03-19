import { cn } from "@/lib/utils";
import { Code, BookOpen, Terminal } from "lucide-react";
import React from "react";
import { FaGithub } from "react-icons/fa";

interface NavBarProps {
  activeTab: "editor" | "about";
  setActiveTab: (tab: "editor" | "about") => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b px-4 py-2 flex items-center bg-tokyo-bg-dark border-tokyo-bg-highlight">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-tokyo-red"></div>
        <div className="w-3 h-3 rounded-full bg-tokyo-yellow"></div>
        <div className="w-3 h-3 rounded-full bg-tokyo-green"></div>
      </div>

      <div className="flex items-center mx-auto">
        <Terminal size={20} className="mr-2" />
        <span className="font-bold tracking-tight text-lg">
          Enigma Language Explorer
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className={cn(
            "hover:text-white transition-colors",
            activeTab === "editor" && "text-tokyo-fg"
          )}
          onClick={() => setActiveTab("editor")}
          title="Editor"
        >
          <Code size={18} />
        </button>
        <button
          className={cn(
            "hover:text-white transition-colors",
            activeTab === "about" && "text-tokyo-fg"
          )}
          onClick={() => setActiveTab("about")}
          title="About"
        >
          <BookOpen size={18} />
        </button>
        <a
          href="https://github.com/yourrepo/enigma"
          className={cn(
            "hover:text-white transition-colors",
            activeTab === "about" && "text-tokyo-fg"
          )}
          title="GitHub Repository"
        >
          <FaGithub size={18} />
        </a>
      </div>
    </div>
  );
};

export default NavBar;
