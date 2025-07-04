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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const examples = Object.keys(sampleCodeSnippets);

const ModernEnigmaEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
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
      className="h-screen w-screen flex flex-col bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Toolbar */}
      <motion.div className="shrink-0" variants={itemVariants}>
        <ToolBar
          selectedExample={selectedExample ?? ""}
          showExamplesDropdown={showExamplesDropdown}
          setShowExamplesDropdown={setShowExamplesDropdown}
          loadExample={(example: string) =>
            loadExample(example as keyof typeof sampleCodeSnippets)
          }
          examples={examples}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div className="flex-1 min-h-0" variants={itemVariants}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <LeftPanel
              code={code}
              onCodeChange={handleCodeChange}
              setActiveTab={() => {}} // Remove this prop since we don't need it anymore
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Analysis Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <Tabs defaultValue="tokens" className="h-full flex flex-col">
                {/* Analysis Tabs */}
                <div className="shrink-0 border-b border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
                  <TabsList className="w-full justify-start bg-transparent p-0 h-auto rounded-none">
                    <TabsTrigger
                      value="tokens"
                      className="py-2 px-4 text-sm font-medium relative transition-colors border-b-2 border-transparent data-[state=active]:border-[var(--tokyo-blue)] data-[state=active]:text-[var(--tokyo-blue)] data-[state=active]:bg-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] bg-transparent rounded-none"
                    >
                      <div className="flex items-center gap-2">
                        <Terminal size={16} />
                        <span>Tokens</span>
                        {tokens.length > 0 && (
                          <Badge className="ml-1 text-xs bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30">
                            {tokens.length}
                          </Badge>
                        )}
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="ast"
                      className="py-2 px-4 text-sm font-medium relative transition-colors border-b-2 border-transparent data-[state=active]:border-[var(--tokyo-blue)] data-[state=active]:text-[var(--tokyo-blue)] data-[state=active]:bg-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] bg-transparent rounded-none"
                    >
                      <div className="flex items-center gap-2">
                        <Braces size={16} />
                        <span>AST</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="execution"
                      className="py-2 px-4 text-sm font-medium relative transition-colors border-b-2 border-transparent data-[state=active]:border-[var(--tokyo-blue)] data-[state=active]:text-[var(--tokyo-blue)] data-[state=active]:bg-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] bg-transparent rounded-none"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronsRight size={16} />
                        <span>Execution</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="guide"
                      className="py-2 px-4 text-sm font-medium relative transition-colors border-b-2 border-transparent data-[state=active]:border-[var(--tokyo-blue)] data-[state=active]:text-[var(--tokyo-blue)] data-[state=active]:bg-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] bg-transparent rounded-none"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>Guide</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <TabsContent value="tokens" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30">
                    <div className="p-4">
                      <TokenDisplay tokens={tokens} />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="ast" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30">
                    <div className="p-4">
                      <ASTDisplay code={code} />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="execution" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30">
                    <div className="p-4">
                      <ExecutionVisualizer code={code} />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="guide" className="flex-1 min-h-0 m-0">
                  <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30">
                    <div className="p-4">
                      <GuideTab />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        className="shrink-0 border-t border-[var(--tokyo-comment)]/40 px-4 py-2 flex items-center justify-between text-xs bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm"
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
