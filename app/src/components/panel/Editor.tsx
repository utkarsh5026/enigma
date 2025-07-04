import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Braces,
  BookOpen,
  ChevronsRight,
  Coffee,
} from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import TokenDisplay from "@/components/analysis/tokens/token-display";
import ASTDisplay from "@/components/analysis/ast/AstDisplay";
import ExecutionVisualizer from "@/components/analysis/exec/ExecutionVisualizer";
import Lexer from "@/lang/lexer/lexer";
import { Token, TokenType } from "@/lang/token/token";
import {
  sampleCodeSnippets,
  getRandomSampleCode,
} from "@/components/analysis/exec/snippets";
import { GuideTab } from "@/components/guide";

import LeftPanel from "./LeftPanel";
import ToolBar from "./ToolBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";

const examples = Object.keys(sampleCodeSnippets);

const ModernEnigmaEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState("tokens");
  const [darkMode, setDarkMode] = useState(true);
  const [selectedExample, setSelectedExample] = useState<
    keyof typeof sampleCodeSnippets | null
  >(null);
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);

  // Theme colors
  const mainBg = darkMode ? "#1a1b26" : "#f7f8fa";
  const sideBg = darkMode ? "#16161e" : "#ebeef5";
  const accentColor = "#7aa2f7";
  const textColor = darkMode ? "#c0caf5" : "#24283b";
  const mutedTextColor = darkMode ? "#565f89" : "#9699a3";
  const borderColor = darkMode ? "#292e42" : "#dbe0ea";
  const highlightBg = darkMode ? "#292e42" : "#e2e8f0";

  useEffect(() => {
    // Load random example code on first render
    const randomExample = getRandomSampleCode();
    handleCodeChange(randomExample);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      if (newCode && newCode.length > 0) {
        const lexer = new Lexer(newCode);
        let token = lexer.nextToken();
        const newTokens: Token[] = [];
        while (token.type !== TokenType.EOF) {
          newTokens.push(token);
          token = lexer.nextToken();
        }
        setTokens(newTokens);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error("Error tokenizing code:", error);
    }
  };

  const loadExample = (exampleKey: keyof typeof sampleCodeSnippets) => {
    const selectedCode = sampleCodeSnippets[exampleKey];
    if (selectedCode) {
      handleCodeChange(selectedCode);
      setSelectedExample(exampleKey);
      setShowExamplesDropdown(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{ background: mainBg, color: textColor }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Toolbar */}
      <ToolBar
        borderColor={borderColor}
        accentColor={accentColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
        highlightBg={highlightBg}
        selectedExample={selectedExample ?? ""}
        showExamplesDropdown={showExamplesDropdown}
        setShowExamplesDropdown={setShowExamplesDropdown}
        loadExample={(example: string) =>
          loadExample(example as keyof typeof sampleCodeSnippets)
        }
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        examples={examples}
        sideBg={sideBg}
      />

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-hidden h-full max-h-full"
        variants={itemVariants}
      >
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <LeftPanel
              code={code}
              onCodeChange={handleCodeChange}
              setActiveTab={setActiveTab}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Analysis Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="border-b" style={{ borderColor }}>
                <div className="flex">
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === "tokens"
                        ? `border-b-2 text-[${accentColor}]`
                        : `text-[${mutedTextColor}] hover:text-[${textColor}]`
                    }`}
                    onClick={() => setActiveTab("tokens")}
                    style={{
                      borderColor:
                        activeTab === "tokens" ? accentColor : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Terminal size={16} />
                      <span>Tokens</span>
                      {tokens.length > 0 && (
                        <Badge className="ml-1 text-xs bg-[#3d59a1] text-white">
                          {tokens.length}
                        </Badge>
                      )}
                    </div>
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === "ast"
                        ? `border-b-2 text-[${accentColor}]`
                        : `text-[${mutedTextColor}] hover:text-[${textColor}]`
                    }`}
                    onClick={() => setActiveTab("ast")}
                    style={{
                      borderColor:
                        activeTab === "ast" ? accentColor : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Braces size={16} />
                      <span>AST</span>
                    </div>
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === "execution"
                        ? `border-b-2 text-[${accentColor}]`
                        : `text-[${mutedTextColor}] hover:text-[${textColor}]`
                    }`}
                    onClick={() => setActiveTab("execution")}
                    style={{
                      borderColor:
                        activeTab === "execution" ? accentColor : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronsRight size={16} />
                      <span>Execution</span>
                    </div>
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === "guide"
                        ? `border-b-2 text-[${accentColor}]`
                        : `text-[${mutedTextColor}] hover:text-[${textColor}]`
                    }`}
                    onClick={() => setActiveTab("guide")}
                    style={{
                      borderColor:
                        activeTab === "guide" ? accentColor : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>Guide</span>
                    </div>
                  </button>
                </div>
              </div>
              <ScrollArea className="flex-1 overflow-auto h-full max-h-full">
                {activeTab === "tokens" && <TokenDisplay tokens={tokens} />}
                {activeTab === "ast" && <ASTDisplay code={code} />}
                {activeTab === "execution" && (
                  <ExecutionVisualizer
                    code={code}
                    onCodeChange={handleCodeChange}
                  />
                )}
                {activeTab === "guide" && <GuideTab />}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        className="border-t px-4 py-1 flex items-center justify-between text-xs"
        style={{ borderColor, color: mutedTextColor }}
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: accentColor }}>Enigma v0.1.0</span>
          <span>Tokens: {tokens.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#9ece6a] animate-pulse"></div>
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <Coffee size={12} />
            <span>Made with ❤️ by Utkarsh Priyadarshi</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernEnigmaEditor;
