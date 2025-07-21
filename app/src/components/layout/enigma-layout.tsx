import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  sampleCodeSnippets,
  getRandomSampleCode,
  categorizedExamples,
} from "@/utils/snippets";
import ToolBar from "./editor-toolbar";
import StatusBar from "./status-bar";
import { useMobile } from "@/hooks/use-mobile";
import { DesktopLayout, MobileLayout } from "./responsive-layouts";
import { useTokens } from "@/hooks/use-tokens";

const Enigma: React.FC = () => {
  const [code, setCode] = useState("");
  const {
    tokens,
    isTokenizing,
    error,
    hasTokens,
    tokenize,
    clearTokens,
    isCodeChanged,
  } = useTokens();
  const [selectedExample, setSelectedExample] = useState<
    keyof typeof sampleCodeSnippets | null
  >(null);
  const { isMobile } = useMobile();
  const [highlightingStats, setHighlightingStats] = useState({
    isActive: false,
    totalHighlights: 0,
    lastHighlightTime: null as Date | null,
  });

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
      clearTokens(); // Clear tokens when loading new example

      setHighlightingStats({
        isActive: false,
        totalHighlights: 0,
        lastHighlightTime: null,
      });
    }
  };

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

  const tokenProps = {
    tokens,
    isTokenizing,
    error,
    hasTokens,
    isCodeChanged,
    onTokenize: tokenize,
    onClearTokens: clearTokens,
  };

  return (
    <motion.div
      className="h-screen w-screen flex flex-col bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {highlightingStats.isActive && (
        <div className="absolute top-14 right-4 z-50 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="bg-tokyo-green/90 text-white rounded-lg px-3 py-2 text-xs shadow-lg backdrop-blur-sm border border-tokyo-green/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">AST ↔ Code Linking Active</span>
            </div>
            {highlightingStats.totalHighlights > 0 && (
              <div className="text-tokyo-green/20 text-xs mt-1">
                {highlightingStats.totalHighlights} highlights used
              </div>
            )}
          </motion.div>
        </div>
      )}

      <ToolBar
        selectedExample={selectedExample ?? ""}
        loadExample={(example: string) =>
          loadExample(example as keyof typeof sampleCodeSnippets)
        }
        categorizedExamples={categorizedExamples}
      />

      <motion.div className="flex-1 min-h-0">
        {isMobile ? (
          <MobileLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokenProps={tokenProps}
          />
        ) : (
          <DesktopLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokenProps={tokenProps}
          />
        )}
      </motion.div>

      <StatusBar tokens={tokens.length} />
    </motion.div>
  );
};

export default Enigma;
