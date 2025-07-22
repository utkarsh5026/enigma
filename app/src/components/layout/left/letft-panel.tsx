import React, { useRef, useCallback } from "react";
import { Code } from "lucide-react";
import EnigmaEditor, {
  EnigmaEditorRef,
} from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import MobileFloatingRunButton from "./mobile-floating-button";
import EditorHeader from "./editor-header";
import { useCodeExecution } from "@/components/analysis/execution/hooks/use-code-execution";
import { useDebug } from "@/components/analysis/execution/hooks/use-debug";
import { editor } from "monaco-editor";
import type { HightLightFn } from "@/components/editor/hooks/use-editor-highlighting";

interface LeftPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  setActiveTab: (tab: string) => void;
  onHighlightingReady?: (highlightFn: HightLightFn) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
  onHighlightingReady,
}) => {
  const { isMobile } = useMobile();

  const editorRef = useRef<EnigmaEditorRef>(null);

  const {
    isStepMode,
    setIsStepMode,
    prepareExecution,
    executeStep,
    goBackStep,
    resetExecution,
    executionError,
    getStepLocationInfo,
    clearAllOverlays,
    clearExecutionHighlight,
    setDirectOverlayEditor,
    setupScrollListener,
    executionState,
  } = useDebug(code);

  const { isExecuting, executionSuccess, handleRunCode } = useCodeExecution({
    code,
    setActiveTab,
    beforeExecution: () => {
      clearAllOverlays();
      clearExecutionHighlight();
    },
  });

  const handleHighlightingReady = useCallback(
    (highlightFn: HightLightFn) => {
      if (onHighlightingReady) {
        onHighlightingReady(highlightFn);
      }
    },
    [onHighlightingReady]
  );

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      setDirectOverlayEditor(editor);

      setTimeout(() => {
        setupScrollListener();
      }, 100);
    },
    [setDirectOverlayEditor, setupScrollListener]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!isMobile && (
        <EditorHeader
          code={code}
          isExecuting={isExecuting}
          executionSuccess={executionSuccess}
          handleRunCode={handleRunCode}
          executionState={executionState}
          onPrepareExecution={prepareExecution}
          onExecuteStep={executeStep}
          onGoBackStep={goBackStep}
          onResetExecution={resetExecution}
          isStepMode={isStepMode}
          onToggleStepMode={() => setIsStepMode(!isStepMode)}
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
            onEditorMount={handleEditorMount}
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

        <AnimatePresence>
          {isStepMode && executionState?.currentStep && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[var(--tokyo-green)]/10 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm border border-[var(--tokyo-green)]/30 max-w-[calc(100%-1rem)] sm:max-w-sm z-10"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold">
                    {executionState.currentStep.node?.constructor?.name ||
                      "Unknown"}
                  </span>
                </div>
                {executionState.currentStep.result && (
                  <div className="text-[var(--tokyo-green)]/70 text-xs">
                    Result: {executionState.currentStep.result.inspect()}
                  </div>
                )}
                {getStepLocationInfo() && (
                  <div className="text-[var(--tokyo-green)]/70 text-xs">
                    Line {getStepLocationInfo()?.lineNumber}, Col{" "}
                    {getStepLocationInfo()?.columnNumber}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Execution Error Indicator */}
        <AnimatePresence>
          {executionError && isStepMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 right-4 bg-[var(--tokyo-red)]/90 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm border border-[var(--tokyo-red)]/30 max-w-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="truncate">{executionError}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  : "Write Enigma code, then use Debug mode for step-by-step execution with live value overlays and highlighting"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
