import React, { useState } from "react";
import EnigmaEditor from "@/components/editor/EnigmaEditor";
import TokenDisplay from "@/components/analysis/tokens/TokenDisplay";
import LanguageGuide from "@/components/guide/LanguageGuide";
import ASTDisplay from "@/components/analysis/ast/AstDisplay";
import ExecutionVisualizer from "@/components/analysis/exec/ExecutionVisualizer";
import Lexer from "../lang/lexer/lexer";
import { Token, TokenType } from "../lang/token/token";
import {
  Terminal,
  Code,
  Braces,
  Play,
  BookOpen,
  FileCode,
  ChevronsRight,
} from "lucide-react";
import QuickReference from "./guide/QuickReference";

const MutantEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<
    "tokens" | "ast" | "execution" | "eval" | "guide"
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
    id: "tokens" | "ast" | "execution" | "eval" | "guide";
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
                onClick={() => setActiveTab("execution")}
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
              id="execution"
              icon={
                <ChevronsRight
                  size={14}
                  className={activeTab === "execution" ? "text-[#4d9375]" : ""}
                />
              }
              label="Execution"
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
            {activeTab === "execution" && (
              <ExecutionVisualizer
                code={code}
                onCodeChange={handleCodeChange}
              />
            )}
            {activeTab === "eval" && (
              <div className="flex items-center justify-center h-full text-[#8b949e] bg-[#0d1117] matrix-bg">
                <div className="text-center">
                  <Play size={32} className="mx-auto mb-2 text-[#4d9375]" />
                  <p>Execution output coming soon</p>
                  <button
                    className="mt-4 bg-[#4d9375] hover:bg-[#3a7057] text-white py-2 px-4 rounded-md text-sm"
                    onClick={() => setActiveTab("execution")}
                  >
                    Try the Step-by-Step Execution Visualizer
                  </button>
                </div>
              </div>
            )}
            {activeTab === "guide" && (
              <QuickReference
                setShowGuide={setShowGuide}
                handleCodeChange={handleCodeChange}
                setActiveTab={setActiveTab}
              />
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
