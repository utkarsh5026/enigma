import "./App.css";
import MutantEditor from "./components/Editor";
import { Terminal, Code, Github, Coffee, BookOpen } from "lucide-react";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<"editor" | "about">("editor");

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0d1117] text-white">
      {/* Top navbar */}
      <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f97583]"></div>
          <div className="w-3 h-3 rounded-full bg-[#f2cc60]"></div>
          <div className="w-3 h-3 rounded-full bg-[#4d9375]"></div>
        </div>

        <div className="flex items-center mx-auto">
          <Terminal size={20} className="text-[#4d9375] mr-2" />
          <span className="font-bold tracking-tight text-lg">
            Enigma Language Explorer
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#8b949e]">
          <button
            className={`hover:text-white transition-colors ${
              activeTab === "editor" ? "text-white" : ""
            }`}
            onClick={() => setActiveTab("editor")}
            title="Editor"
          >
            <Code size={18} />
          </button>
          <button
            className={`hover:text-white transition-colors ${
              activeTab === "about" ? "text-white" : ""
            }`}
            onClick={() => setActiveTab("about")}
            title="About"
          >
            <BookOpen size={18} />
          </button>
          <a
            href="https://github.com/yourrepo/enigma"
            className="hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github size={18} />
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors"
            title="Buy me a coffee"
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
          <div className="h-full overflow-auto bg-[#0d1117]">
            <div className="max-w-4xl mx-auto py-10 px-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center mb-3">
                  <Terminal size={36} className="text-[#4d9375] mr-2" />
                  <h1 className="text-3xl font-bold">About Enigma Language</h1>
                </div>
                <p className="text-[#8b949e] text-lg">
                  An educational programming language with a clean syntax and
                  powerful features
                </p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Project Overview</h2>
                <p className="text-[#8b949e] mb-4">
                  Enigma is a programming language designed for educational
                  purposes, helping developers understand the inner workings of
                  language parsing, abstract syntax trees, and interpretation.
                  It features a clean, expressive syntax inspired by modern
                  programming languages.
                </p>
                <p className="text-[#8b949e]">
                  With this interactive explorer, you can write Enigma code and
                  see in real-time how it gets tokenized and parsed into an
                  abstract syntax tree (AST). This visualization helps to bridge
                  the gap between the code you write and how a computer
                  understands and processes it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Features</h2>
                  <ul className="text-[#8b949e] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4d9375] mt-1">•</span>
                      <span>Dynamic typing with variables and constants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4d9375] mt-1">•</span>
                      <span>First-class functions and closures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4d9375] mt-1">•</span>
                      <span>
                        Built-in data structures: arrays and hash maps
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4d9375] mt-1">•</span>
                      <span>Control flow with conditionals and loops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4d9375] mt-1">•</span>
                      <span>
                        Higher-order functions and functional programming
                        patterns
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Getting Started</h2>
                  <p className="text-[#8b949e] mb-3">
                    To begin exploring the Enigma language:
                  </p>
                  <ol className="text-[#8b949e] space-y-2 list-decimal pl-5 mb-4">
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
                    className="bg-[#4d9375] hover:bg-[#3a7057] text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
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
