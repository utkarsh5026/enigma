import React, { useState } from "react";
import { FileCode, Play, Loader2, Check, Code } from "lucide-react";
import EnigmaEditor from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";
import { consoleStore } from "@/stores/console-stores";
import Lexer from "@/lang/lexer/lexer";
import { LanguageParser } from "@/lang/parser";
import { LanguageEvaluator } from "@/lang/exec/evaluation/evaluator";
import { Button } from "@/components/ui/button";
import { ObjectValidator, Environment } from "@/lang/exec/core";
import { motion } from "framer-motion";

interface LeftPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
}) => {
  const { isMobile } = useMobile();
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  const handleRunCode = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionSuccess(false);

    try {
      consoleStore.clear();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const lexer = new Lexer(code);
      const parser = new LanguageParser(lexer);
      const ast = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        parser.getErrors().forEach((error) => {
          consoleStore.addEntry(error.message, "error");
        });
        setActiveTab("output");
        return;
      }

      const evaluator = LanguageEvaluator.withSourceCode(code, true);
      const result = evaluator.evaluateProgram(ast, new Environment());

      if (!ObjectValidator.isError(result)) {
        consoleStore.addEntry("✅ Code executed successfully", "success");
        setExecutionSuccess(true);
        setTimeout(() => setExecutionSuccess(false), 2000);
      } else {
        consoleStore.addEntry(result.inspect(), "error");
      }

      setActiveTab("output");
    } catch (error) {
      consoleStore.addEntry(
        `❌ Execution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      setActiveTab("output");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!isMobile && (
        <motion.div
          className="shrink-0 border-b border-[var(--tokyo-comment)]/20 bg-gradient-to-r from-[var(--tokyo-bg)] to-[var(--tokyo-bg-dark)]/90 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* File Info */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-gradient-to-br from-[var(--tokyo-purple)]/20 to-[var(--tokyo-blue)]/20 border border-[var(--tokyo-purple)]/30"
              >
                <FileCode size={16} className="text-[var(--tokyo-purple)]" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-[var(--tokyo-fg)]">
                    main.enigma
                  </span>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleRunCode}
                disabled={isExecuting || !code.trim()}
                className={`
                  px-6 py-2 rounded-xl font-medium text-sm
                  transition-all duration-300 ease-in-out
                  cursor-pointer
                  flex items-center gap-2
                  shadow-lg hover:shadow-xl
                  border-0
                  ${
                    executionSuccess
                      ? "bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan text-white"
                      : "bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan hover:from-tokyo-green/90 hover:to-tokyo-cyan/90 text-white"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:shadow-lg
                  ${isExecuting ? "animate-pulse" : ""}
                `}
                title={
                  !code.trim()
                    ? "Enter some code to run"
                    : isExecuting
                    ? "Executing..."
                    : "Run your code"
                }
              >
                {isExecuting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Running...</span>
                  </>
                ) : executionSuccess ? (
                  <>
                    <Check
                      size={16}
                      className="animate-in zoom-in-50 duration-200"
                    />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Run Code</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {isMobile && code.length > 0 && (
        <motion.div
          className="shrink-0 px-3 py-2 bg-[var(--tokyo-bg-dark)]/50 border-b border-[var(--tokyo-comment)]/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={12} className="text-[var(--tokyo-purple)]" />
              <span className="text-xs text-[var(--tokyo-fg)] font-medium">
                main.enigma
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          <EnigmaEditor code={code} onCodeChange={onCodeChange} />
        </div>

        {/* Mobile Floating Run Button - Enhanced */}
        {isMobile && (
          <motion.div
            className="absolute bottom-4 right-4 z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--tokyo-green)] to-[var(--tokyo-cyan)] rounded-full blur-lg opacity-50 animate-pulse" />

              <Button
                onClick={handleRunCode}
                disabled={isExecuting || !code.trim()}
                className={`
                  relative w-16 h-16 rounded-full
                  bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan
                  hover:from-tokyo-green/90 hover:to-tokyo-cyan/90
                  text-white border-0
                  shadow-2xl hover:shadow-3xl
                  transition-all duration-300
                  flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isExecuting ? "animate-pulse" : ""}
                  ${!code.trim() ? "opacity-30" : ""}
                `}
                title={
                  !code.trim()
                    ? "Enter some code to run"
                    : isExecuting
                    ? "Executing..."
                    : "Run your code"
                }
              >
                {isExecuting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : executionSuccess ? (
                  <Check
                    size={24}
                    className="animate-in zoom-in-50 duration-200"
                  />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Code Empty State Overlay */}
        {!code.trim() && (
          <motion.div
            className="absolute inset-0 bg-[var(--tokyo-bg)]/80 backdrop-blur-sm flex items-center justify-center pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-sm mx-auto px-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="mb-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--tokyo-purple)]/20 to-[var(--tokyo-blue)]/20 border border-[var(--tokyo-purple)]/30 flex items-center justify-center">
                  <Code size={24} className="text-[var(--tokyo-purple)]" />
                </div>
              </motion.div>
              <h3 className="text-lg font-medium text-[var(--tokyo-fg)] mb-2">
                Start Coding
              </h3>
              <p className="text-sm text-[var(--tokyo-comment)] leading-relaxed">
                {isMobile
                  ? "Write your Enigma code and tap the run button to execute it"
                  : "Write your Enigma code in the editor above, then click Run to see the magic happen"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
