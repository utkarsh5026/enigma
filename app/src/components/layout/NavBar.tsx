import { cn } from "@/lib/utils";
import { Code, BookOpen, Terminal } from "lucide-react";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";

interface NavBarProps {
  activeTab: "editor" | "about";
  setActiveTab: (tab: "editor" | "about") => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <div className="relative z-20">
      {/* Decorative background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#16161e]/90 via-[#1a1b26]/95 to-[#16161e]/90 backdrop-blur-md border-b border-tokyo-bg-highlight/30 z-0"></div>

      {/* Subtle gradient glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7aa2f7]/30 to-transparent"></div>

      {/* Main navbar content */}
      <div className="px-5 py-3 flex items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tokyo-red shadow-sm shadow-tokyo-red/30"></div>
          <div className="w-3 h-3 rounded-full bg-tokyo-yellow shadow-sm shadow-tokyo-yellow/30"></div>
          <div className="w-3 h-3 rounded-full bg-tokyo-green shadow-sm shadow-tokyo-green/30"></div>
        </div>

        <div className="flex items-center mx-auto">
          <div className="relative mr-3">
            <div className="absolute -inset-0.5 bg-[#7aa2f7]/20 rounded-full blur-sm"></div>
            <Terminal size={20} className="relative text-[#7aa2f7]" />
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-[#c0caf5] to-[#7aa2f7] bg-clip-text text-transparent">
            Enigma Language Explorer
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            className={cn(
              "relative p-2 rounded-md transition-all duration-200",
              activeTab === "editor"
                ? "text-tokyo-fg bg-[#292e42]/50 shadow-inner"
                : "text-tokyo-fg-dark hover:text-tokyo-fg hover:bg-[#1e2030]/50"
            )}
            onClick={() => setActiveTab("editor")}
            title="Editor"
            onMouseEnter={() => setIsHovered("editor")}
            onMouseLeave={() => setIsHovered(null)}
          >
            {/* Button highlight effect */}
            {(isHovered === "editor" || activeTab === "editor") && (
              <div className="absolute inset-0 bg-[#7aa2f7]/10 rounded-md blur"></div>
            )}

            <Code size={19} className="relative z-10" />

            {/* Indicator dot for active tab */}
            {activeTab === "editor" && (
              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#7aa2f7] rounded-full"></div>
            )}
          </button>

          <button
            className={cn(
              "relative p-2 rounded-md transition-all duration-200",
              activeTab === "about"
                ? "text-tokyo-fg bg-[#292e42]/50 shadow-inner"
                : "text-tokyo-fg-dark hover:text-tokyo-fg hover:bg-[#1e2030]/50"
            )}
            onClick={() => setActiveTab("about")}
            title="About"
            onMouseEnter={() => setIsHovered("about")}
            onMouseLeave={() => setIsHovered(null)}
          >
            {/* Button highlight effect */}
            {(isHovered === "about" || activeTab === "about") && (
              <div className="absolute inset-0 bg-[#bb9af7]/10 rounded-md blur"></div>
            )}

            <BookOpen size={19} className="relative z-10" />

            {/* Indicator dot for active tab */}
            {activeTab === "about" && (
              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#bb9af7] rounded-full"></div>
            )}
          </button>

          <a
            href="https://github.com/yourrepo/enigma"
            className="relative p-2 rounded-md text-tokyo-fg-dark hover:text-tokyo-fg hover:bg-[#1e2030]/50 transition-all duration-200"
            title="GitHub Repository"
            onMouseEnter={() => setIsHovered("github")}
            onMouseLeave={() => setIsHovered(null)}
          >
            {/* Button highlight effect */}
            {isHovered === "github" && (
              <div className="absolute inset-0 bg-[#e0af68]/10 rounded-md blur"></div>
            )}

            <FaGithub size={19} className="relative z-10" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
