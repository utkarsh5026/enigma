import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  sampleCodeSnippets,
  getRandomSampleCode,
  categorizedExamples,
} from "@/utils/snippets";
import ToolBar from "./editor-toolbar";
import { useMobile } from "@/hooks/use-mobile";
import { DesktopLayout, MobileLayout } from "./layouts";
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
      className="flex h-screen w-screen flex-col overflow-hidden bg-tokyo-bg-dark text-tokyo-fg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {highlightingStats.isActive && (
        <div className="absolute top-14 right-4 z-50 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="rounded-lg border border-tokyo-green/30 bg-tokyo-green/90 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
              <span className="font-medium">AST ↔ Code Linking Active</span>
            </div>
            {highlightingStats.totalHighlights > 0 && (
              <div className="mt-1 text-xs text-tokyo-green/20">
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

      <motion.div className="min-h-0 flex-1">
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
    </motion.div>
  );
};

export default Enigma;
