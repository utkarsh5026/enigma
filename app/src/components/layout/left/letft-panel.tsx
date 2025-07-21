import React, { useRef, useState } from "react";
import { Code } from "lucide-react";
import EnigmaEditor, {
  EnigmaEditorRef,
} from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";
import { consoleStore } from "@/stores/console-stores";
import Lexer from "@/lang/lexer/lexer";
import { LanguageParser } from "@/lang/parser";
import { LanguageEvaluator } from "@/lang/exec/evaluation/evaluator";
import { ObjectValidator, Environment } from "@/lang/exec/core";
import { motion } from "framer-motion";
import MobileFloatingRunButton from "./mobile-floating-button";
import EditorHeader from "./editor-header";

interface LeftPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  setActiveTab: (tab: string) => void;
  onHighlightingReady?: (
    highlightFn: (
      line: number,
      column: number,
      endLine?: number,
      endColumn?: number
    ) => void
  ) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
  onHighlightingReady,
}) => {
  const { isMobile } = useMobile();
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  const editorRef = useRef<EnigmaEditorRef>(null);

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

  const handleHighlightingReady = (
    highlightFn: (
      line: number,
      column: number,
      endLine?: number,
      endColumn?: number
    ) => void
  ) => {
    if (onHighlightingReady) {
      onHighlightingReady(highlightFn);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!isMobile && (
        <EditorHeader
          code={code}
          isExecuting={isExecuting}
          executionSuccess={executionSuccess}
          handleRunCode={handleRunCode}
        />
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          <EnigmaEditor
            code={code}
            onCodeChange={onCodeChange}
            ref={editorRef}
            onHighlightingReady={handleHighlightingReady}
          />
        </div>

        {isMobile && (
          <MobileFloatingRunButton
            canRunCode={code.trim() !== ""}
            isExecuting={isExecuting}
            executionSuccess={executionSuccess}
            handleRunCode={handleRunCode}
          />
        )}

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
