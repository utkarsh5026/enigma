import React, { useState } from "react";
import EnigmaEditor from "./EnigmaEditor";
import TokenDisplay from "./TokenDisplay";
import LanguageGuide from "./guide/LanguageGuide";
import ASTDisplay from "./AstDisplay";
import Lexer from "../lang/lexer/lexer";
import { Token, TokenType } from "../lang/token/token";
import { Terminal, Code, Braces, Play, BookOpen, FileCode } from "lucide-react";

const MutantEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<
    "tokens" | "ast" | "eval" | "guide"
  >("tokens");
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const handleCodeChange = (newCode: string) => {
    if (newCode && newCode.length > 0) {
      setCode(newCode);
      const lexer = new Lexer(newCode);
      let token = lexer.nextToken();
      const newTokens: Token[] = [];
      while (token.type != TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }
      setTokens(newTokens);
    } else {
      setTokens([]);
      setCode("");
    }
  };

  // VSCode-like tab interfaces
  const Tab: React.FC<{
    id: "tokens" | "ast" | "eval" | "guide";
    icon: React.ReactNode;
    label: string;
  }> = ({ id, icon, label }) => (
    <button
      className={`flex items-center gap-2 py-2 px-4 text-sm ${
        activeTab === id
          ? "text-white bg-[#0d1117] border-t-2 border-t-[#4d9375] border-b-0 border-x-0"
          : "text-[#8b949e] hover:text-white bg-[#1c2128] hover:bg-[#161b22]"
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // If showing the full guide, display only the guide
  if (showGuide) {
    return (
      <div className="flex flex-col h-full bg-[#0d1117] text-white">
        <div className="border-b border-[#30363d] bg-[#161b22] px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-[#4d9375]" />
            <span>Enigma Language Guide</span>
          </h1>
          <button
            className="bg-[#21262d] hover:bg-[#30363d] text-white py-1.5 px-3 rounded-md text-sm flex items-center gap-2"
            onClick={() => setShowGuide(false)}
          >
            <Code size={14} />
            Back to Editor
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <LanguageGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      <div className="border-b border-[#30363d] bg-[#161b22] px-4 py-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Code size={20} className="text-[#4d9375]" />
          <span>Enigma Language Explorer</span>
        </h1>
        <p className="text-[#8b949e] text-sm mt-1">
          Write code in the editor to analyze tokens, AST, and execution results
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel (editor) */}
        <div className="w-1/2 border-r border-[#30363d] flex flex-col">
          <div className="flex items-center bg-[#161b22] border-b border-[#30363d] px-3 py-2">
            <div className="flex items-center gap-2 text-[#e6edf3]">
              <FileCode size={16} className="text-[#4d9375]" />
              <span className="font-medium text-sm">main.enigma</span>
            </div>
            <div className="flex ml-auto">
              <button
                className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white"
                title="Run code"
              >
                <Play size={14} />
              </button>
              <button
                className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white ml-1"
                title="View Language Guide"
                onClick={() => setShowGuide(true)}
              >
                <BookOpen size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <EnigmaEditor code={code} onCodeChange={handleCodeChange} />
          </div>
        </div>

        {/* Right panel (analysis) */}
        <div className="w-1/2 flex flex-col">
          <div className="flex bg-[#1c2128] border-b border-[#30363d]">
            <Tab
              id="tokens"
              icon={
                <Terminal
                  size={14}
                  className={activeTab === "tokens" ? "text-[#4d9375]" : ""}
                />
              }
              label="Tokens"
            />
            <Tab
              id="ast"
              icon={
                <Braces
                  size={14}
                  className={activeTab === "ast" ? "text-[#4d9375]" : ""}
                />
              }
              label="AST"
            />
            <Tab
              id="eval"
              icon={
                <Play
                  size={14}
                  className={activeTab === "eval" ? "text-[#4d9375]" : ""}
                />
              }
              label="Output"
            />
            <Tab
              id="guide"
              icon={
                <BookOpen
                  size={14}
                  className={activeTab === "guide" ? "text-[#4d9375]" : ""}
                />
              }
              label="Guide"
            />
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "tokens" && <TokenDisplay tokens={tokens} />}
            {activeTab === "ast" && <ASTDisplay code={code} />}
            {activeTab === "eval" && (
              <div className="flex items-center justify-center h-full text-[#8b949e] bg-[#0d1117] matrix-bg">
                <div className="text-center">
                  <Play size={32} className="mx-auto mb-2 text-[#4d9375]" />
                  <p>Execution output coming soon</p>
                </div>
              </div>
            )}
            {activeTab === "guide" && (
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Language Quick Guide
                    </h2>
                    <button
                      className="bg-[#21262d] hover:bg-[#30363d] text-white py-1.5 px-3 rounded-md text-sm flex items-center gap-2"
                      onClick={() => setShowGuide(true)}
                    >
                      <BookOpen size={14} />
                      Full Guide
                    </button>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Quick Reference
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <h4 className="text-[#4d9375] font-medium mb-1">
                          Variables
                        </h4>
                        <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">
                          let x = 5;
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-[#4d9375] font-medium mb-1">
                          Functions
                        </h4>
                        <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`fn(x, y) { return x + y; }`}</pre>
                      </div>
                      <div>
                        <h4 className="text-[#4d9375] font-medium mb-1">
                          Conditionals
                        </h4>
                        <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`if (x > 5) { return true; }`}</pre>
                      </div>
                      <div>
                        <h4 className="text-[#4d9375] font-medium mb-1">
                          Loops
                        </h4>
                        <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`while (i < 10) { i = i + 1; }`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Example Code
                    </h3>
                    <pre className="bg-[#0d1117] p-3 rounded text-[#e6edf3] text-sm whitespace-pre-wrap">
                      {`// Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);`}
                    </pre>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="bg-[#4d9375] hover:bg-[#3a7057] text-white py-1 px-2 rounded text-xs"
                        onClick={() => {
                          const example = `// Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);`;
                          handleCodeChange(example);
                        }}
                      >
                        Try in Editor
                      </button>
                      <button
                        className="bg-[#21262d] hover:bg-[#30363d] text-white py-1 px-2 rounded text-xs"
                        onClick={() => setShowGuide(true)}
                      >
                        More Examples
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#161b22] border-t border-[#30363d] text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#4d9375]">Enigma</span>
          <span className="text-[#8b949e]">Tokens: {tokens.length}</span>
        </div>
        <div className="flex items-center gap-3 text-[#8b949e]">
          <span>v0.1.0</span>
          <div className="w-2 h-2 rounded-full bg-[#4d9375] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MutantEditor;
