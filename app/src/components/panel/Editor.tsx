import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  sampleCodeSnippets,
  getRandomSampleCode,
} from "@/components/analysis/exec/snippets";

import LeftPanel from "./letft-panel";
import ToolBar from "./editor-toolbar";
import StatusBar from "./status-bar";
import { useMobile } from "@/hooks/use-mobile";
import { useProgram } from "@/hooks/use-program";
import AnalysisContent from "./ananlysis-panel";

const examples = Object.keys(sampleCodeSnippets);

const ModernEnigmaEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const { tokens, program, parserErrors } = useProgram(code);
  const [selectedExample, setSelectedExample] = useState<
    keyof typeof sampleCodeSnippets | null
  >(null);
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile } = useMobile();

  useEffect(() => {
    const randomExample = getRandomSampleCode();
    handleCodeChange(randomExample);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
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

  // Analysis tabs content component

  return (
    <motion.div
      className="h-screen w-screen flex flex-col bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)] overflow-hidden"
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
      <motion.div className="flex-1 min-h-0">
        {isMobile ? (
          // Mobile Layout
          <div className="h-full flex flex-col">
            {/* Editor takes full height on mobile */}
            <div className="flex-1">
              <LeftPanel
                code={code}
                onCodeChange={handleCodeChange}
                setActiveTab={() => {}}
              />
            </div>

            {/* Mobile Analyze Button */}
            <div className="shrink-0 p-4 border-t border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/50">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    className="w-full bg-[var(--tokyo-blue)] hover:bg-[var(--tokyo-blue)]/90 text-white"
                    size="lg"
                  >
                    <BarChart3 size={20} className="mr-2" />
                    Analyze Code
                    {tokens.length > 0 && (
                      <Badge className="ml-2 bg-white/20 text-white">
                        {tokens.length}
                      </Badge>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Code Analysis</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 min-h-0">
                    <AnalysisContent
                      tokens={tokens}
                      program={program}
                      parserErrors={parserErrors}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        ) : (
          // Desktop Layout (unchanged)
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <LeftPanel
                code={code}
                onCodeChange={handleCodeChange}
                setActiveTab={() => {}}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Analysis Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <AnalysisContent
                  tokens={tokens}
                  program={program}
                  parserErrors={parserErrors}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </motion.div>

      <StatusBar tokens={tokens.length} />
    </motion.div>
  );
};

export default ModernEnigmaEditor;
