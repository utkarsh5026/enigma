import "./App.css";
import MutantEditor from "./components/Editor";
import { Terminal, Code, FileCode, Github, Coffee } from "lucide-react";

function App() {
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
          <a
            href="https://github.com/yourrepo/enigma"
            className="hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Coffee size={18} />
          </a>
        </div>
      </div>

      {/* File tabs */}
      <div className="flex bg-[#21262d] border-b border-[#30363d]">
        <div className="flex">
          <div className="flex items-center py-2 px-4 bg-[#0d1117] border-t-2 border-t-[#4d9375] border-r border-r-[#30363d]">
            <FileCode size={16} className="text-[#4d9375] mr-2" />
            <span className="text-white text-sm font-medium">main.enigma</span>
            <button className="ml-3 text-[#8b949e] hover:text-white">
              <span className="text-xs">×</span>
            </button>
          </div>

          <button className="flex items-center py-2 px-4 text-[#8b949e] hover:text-white hover:bg-[#161b22]">
            <Code size={16} className="mr-2" />
            <span className="text-sm">utils.enigma</span>
            <button className="ml-3 text-[#8b949e] hover:text-white">
              <span className="text-xs">×</span>
            </button>
          </button>
        </div>

        <button className="ml-auto px-4 text-[#8b949e] hover:text-white">
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <MutantEditor />
      </div>
    </div>
  );
}

export default App;
