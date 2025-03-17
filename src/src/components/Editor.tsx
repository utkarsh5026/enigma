import React, { useState } from "react";
import EnigmaEditor from "./EnigmaEditor";
import TokenDisplay from "./TokenDisplay";
import Lexer from "../lang/lexer/lexer";
import { Token, TokenType } from "../lang/token/token";
import { Terminal, Code, FileCode, Braces, Play } from "lucide-react";

const MutantEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<"tokens" | "ast" | "eval">(
    "tokens"
  );

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
    id: "tokens" | "ast" | "eval";
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

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      <div className="border-b border-[#30363d] bg-[#161b22] px-4 py-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCode size={20} className="text-[#4d9375]" />
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
              <Code size={16} className="text-[#4d9375]" />
              <span className="font-medium text-sm">main.enigma</span>
            </div>
            <div className="flex ml-auto">
              <button
                className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white"
                title="Run code"
              >
                <Play size={14} />
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
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "tokens" && <TokenDisplay tokens={tokens} />}
            {activeTab === "ast" && (
              <div className="flex items-center justify-center h-full text-[#8b949e] bg-[#0d1117] matrix-bg">
                <div className="text-center">
                  <Braces size={32} className="mx-auto mb-2 text-[#4d9375]" />
                  <p>AST analysis coming soon</p>
                </div>
              </div>
            )}
            {activeTab === "eval" && (
              <div className="flex items-center justify-center h-full text-[#8b949e] bg-[#0d1117] matrix-bg">
                <div className="text-center">
                  <Play size={32} className="mx-auto mb-2 text-[#4d9375]" />
                  <p>Execution output coming soon</p>
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
