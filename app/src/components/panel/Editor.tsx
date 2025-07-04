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
import ToolBar from "./editor-toolbar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";

const examples = Object.keys(sampleCodeSnippets);

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  badgeCount?: number;
}

interface AnalysisTabProps {
  tab: TabConfig;
  isActive: boolean;
  onClick: (tabId: string) => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({
  tab,
  isActive,
  onClick,
}) => (
  <button
    className={`py-2 px-4 text-sm font-medium relative transition-colors border-b-2 ${
      isActive
        ? "border-[var(--tokyo-blue)] text-[var(--tokyo-blue)]"
        : "border-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)]"
    }`}
    onClick={() => onClick(tab.id)}
  >
    <div className="flex items-center gap-2">
      {tab.icon}
      <span>{tab.label}</span>
      {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
        <Badge className="ml-1 text-xs bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30">
          {tab.badgeCount}
        </Badge>
      )}
    </div>
  </button>
);

const ModernEnigmaEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState("tokens");
  const [selectedExample, setSelectedExample] = useState<
    keyof typeof sampleCodeSnippets | null
  >(null);
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);

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

  const analysisTabs: TabConfig[] = [
    {
      id: "tokens",
      label: "Tokens",
      icon: <Terminal size={16} />,
      badgeCount: tokens.length,
    },
    {
      id: "ast",
      label: "AST",
      icon: <Braces size={16} />,
    },
    {
      id: "execution",
      label: "Execution",
      icon: <ChevronsRight size={16} />,
    },
    {
      id: "guide",
      label: "Guide",
      icon: <BookOpen size={16} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "tokens":
        return <TokenDisplay tokens={tokens} />;
      case "ast":
        return <ASTDisplay code={code} />;
      case "execution":
        return <ExecutionVisualizer code={code} />;
      case "guide":
        return <GuideTab />;
      default:
        return null;
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
      className="h-full w-full overflow-hidden flex flex-col bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Toolbar */}
      <ToolBar
        selectedExample={selectedExample ?? ""}
        showExamplesDropdown={showExamplesDropdown}
        setShowExamplesDropdown={setShowExamplesDropdown}
        loadExample={(example: string) =>
          loadExample(example as keyof typeof sampleCodeSnippets)
        }
        examples={examples}
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
              {/* Analysis Tabs */}
              <div className="border-b border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
                <div className="flex">
                  {analysisTabs.map((tab) => (
                    <AnalysisTab
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={setActiveTab}
                    />
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <ScrollArea className="flex-1 overflow-auto h-full max-h-full bg-[var(--tokyo-bg-dark)]/30">
                <div className="p-4">{renderTabContent()}</div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        className="border-t border-[var(--tokyo-comment)]/40 px-4 py-2 flex items-center justify-between text-xs bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--tokyo-blue)] animate-pulse"></div>
            <span className="text-[var(--tokyo-blue)] font-medium">
              Enigma v0.1.0
            </span>
          </div>
          <div className="flex items-center gap-1 text-[var(--tokyo-fg-dark)]">
            <Terminal size={12} />
            <span>Tokens: {tokens.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--tokyo-green)]">
            <div className="w-2 h-2 rounded-full bg-[var(--tokyo-green)] animate-pulse"></div>
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--tokyo-fg-dark)]">
            <Coffee size={12} />
            <span>Made with ❤️ by Utkarsh Priyadarshi</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernEnigmaEditor;
