import "./App.css";
import MutantEditor from "./components/Editor";
import {
  Terminal,
  Code,
  Github,
  Coffee,
  BookOpen,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<"editor" | "about">("editor");
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode for Tokyo Night

  // Apply dark mode class to root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const tokyoBg = "#1a1b26";
  const tokyoBgDark = "#16161e";
  const tokyoBgHighlight = "#292e42";
  const tokyoFg = "#a9b1d6";
  const tokyoFgDark = "#787c99";
  const tokyoComment = "#565f89";
  const tokyoCyan = "#7dcfff";
  const tokyoGreen = "#9ece6a";
  const tokyoOrange = "#ff9e64";
  const tokyoRed = "#f7768e";
  const tokyoYellow = "#e0af68";
  const tokyoBlue = "#7aa2f7";
  const tokyoPurple = "#9d7cd8";

  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{ backgroundColor: tokyoBg, color: tokyoFg }}
    >
      {/* Top navbar */}
      <div
        style={{
          backgroundColor: tokyoBgDark,
          borderBottomColor: tokyoBgHighlight,
        }}
        className="border-b px-4 py-2 flex items-center"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: tokyoRed }}
          ></div>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: tokyoYellow }}
          ></div>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: tokyoGreen }}
          ></div>
        </div>

        <div className="flex items-center mx-auto">
          <Terminal size={20} style={{ color: tokyoCyan }} className="mr-2" />
          <span className="font-bold tracking-tight text-lg">
            Enigma Language Explorer
          </span>
        </div>

        <div
          className="flex items-center gap-4"
          style={{ color: tokyoComment }}
        >
          <button
            className="hover:text-white transition-colors"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            style={{ color: activeTab === "editor" ? tokyoFg : tokyoComment }}
            className="hover:text-white transition-colors"
            onClick={() => setActiveTab("editor")}
            title="Editor"
          >
            <Code size={18} />
          </button>
          <button
            style={{ color: activeTab === "about" ? tokyoFg : tokyoComment }}
            className="hover:text-white transition-colors"
            onClick={() => setActiveTab("about")}
            title="About"
          >
            <BookOpen size={18} />
          </button>
          <a
            href="https://github.com/yourrepo/enigma"
            className="hover:text-white transition-colors"
            title="GitHub Repository"
            style={{ color: tokyoComment }}
          >
            <Github size={18} />
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors"
            title="Buy me a coffee"
            style={{ color: tokyoComment }}
          >
            <Coffee size={18} />
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "editor" ? (
          <MutantEditor />
        ) : (
          <div
            className="h-full overflow-auto"
            style={{ backgroundColor: tokyoBg }}
          >
            <div className="max-w-4xl mx-auto py-10 px-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center mb-3">
                  <Terminal
                    size={36}
                    style={{ color: tokyoCyan }}
                    className="mr-2"
                  />
                  <h1 className="text-3xl font-bold">About Enigma Language</h1>
                </div>
                <p style={{ color: tokyoComment }} className="text-lg">
                  An educational programming language with a clean syntax and
                  powerful features
                </p>
              </div>

              <div
                style={{
                  backgroundColor: tokyoBgDark,
                  borderColor: tokyoBgHighlight,
                }}
                className="border rounded-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold mb-4">Project Overview</h2>
                <p style={{ color: tokyoComment }} className="mb-4">
                  Enigma is a programming language designed for educational
                  purposes, helping developers understand the inner workings of
                  language parsing, abstract syntax trees, and interpretation.
                  It features a clean, expressive syntax inspired by modern
                  programming languages.
                </p>
                <p style={{ color: tokyoComment }}>
                  With this interactive explorer, you can write Enigma code and
                  see in real-time how it gets tokenized and parsed into an
                  abstract syntax tree (AST). This visualization helps to bridge
                  the gap between the code you write and how a computer
                  understands and processes it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                  style={{
                    backgroundColor: tokyoBgDark,
                    borderColor: tokyoBgHighlight,
                  }}
                  className="border rounded-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 bg-tokyo-bg-dark">
                    Features
                  </h2>
                  <ul style={{ color: tokyoComment }} className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span style={{ color: tokyoCyan }} className="mt-1">
                        •
                      </span>
                      <span>Dynamic typing with variables and constants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: tokyoCyan }} className="mt-1">
                        •
                      </span>
                      <span>First-class functions and closures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: tokyoCyan }} className="mt-1">
                        •
                      </span>
                      <span>
                        Built-in data structures: arrays and hash maps
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: tokyoCyan }} className="mt-1">
                        •
                      </span>
                      <span>Control flow with conditionals and loops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: tokyoCyan }} className="mt-1">
                        •
                      </span>
                      <span>
                        Higher-order functions and functional programming
                        patterns
                      </span>
                    </li>
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: tokyoBgDark,
                    borderColor: tokyoBgHighlight,
                  }}
                  className="border rounded-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Getting Started</h2>
                  <p style={{ color: tokyoComment }} className="mb-3">
                    To begin exploring the Enigma language:
                  </p>
                  <ol
                    style={{ color: tokyoComment }}
                    className="space-y-2 list-decimal pl-5 mb-4"
                  >
                    <li>Navigate to the Editor tab in the top navigation</li>
                    <li>Write Enigma code in the left panel</li>
                    <li>
                      View the tokens and AST representation in the right panel
                    </li>
                    <li>
                      Check the Guide tab for syntax reference and examples
                    </li>
                  </ol>
                  <button
                    style={{ backgroundColor: tokyoCyan, color: tokyoBgDark }}
                    className="hover:bg-blue-500 py-2 px-4 rounded-md transition-colors text-sm font-medium"
                    onClick={() => setActiveTab("editor")}
                  >
                    Open Editor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
