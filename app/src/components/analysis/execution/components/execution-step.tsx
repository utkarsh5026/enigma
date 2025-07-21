import React from "react";
import { Zap, Eye } from "lucide-react";
import { motion } from "framer-motion";
import VariablesDeclared from "./variables-declared";
import OutputVisualizer from "./output-visualizer";
import type { ExecutionState } from "@/lang/exec/steps/step-info";

interface ExecutionStepProps {
  executionState: ExecutionState;
  isHighlightingEnabled: boolean;
  highlightedVariable: string | null;
  setHighlightedVariable: (variable: string | null) => void;
}

const ExecutionStep: React.FC<ExecutionStepProps> = ({
  executionState,
  isHighlightingEnabled,
  highlightedVariable,
  setHighlightedVariable,
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          layout
          className="bg-[var(--tokyo-bg)]/50 border border-[var(--tokyo-comment)]/30 rounded-xl overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Step Header */}
          <div className="p-6 border-b border-[var(--tokyo-comment)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold text-[var(--tokyo-fg)]">
                      {executionState.currentStep?.node.constructor.name ||
                        "Ready to Execute"}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {executionState.currentStep && (
            <div className="p-6 space-y-6">
              {/* Code Location Indicator */}
              {executionState.currentStep.lineNumber &&
                isHighlightingEnabled && (
                  <motion.div
                    className="bg-[var(--tokyo-blue)]/10 border border-[var(--tokyo-blue)]/30 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Eye size={16} style={{ color: "var(--tokyo-blue)" }} />
                      <span className="text-sm font-medium text-[var(--tokyo-blue)]">
                        Code Location
                      </span>
                    </div>
                    <div className="text-sm text-[var(--tokyo-fg-dark)]">
                      Currently executing at{" "}
                      <code className="bg-[var(--tokyo-bg-highlight)] px-2 py-1 rounded font-mono text-[var(--tokyo-cyan)]">
                        Line {executionState.currentStep.lineNumber}, Column{" "}
                        {executionState.currentStep.columnNumber}
                      </code>
                    </div>
                    <div className="text-xs text-[var(--tokyo-comment)] mt-1">
                      The corresponding code is highlighted in the editor
                    </div>
                  </motion.div>
                )}

              {/* Result Display */}
              {executionState.currentStep.result && (
                <motion.div
                  className="bg-[var(--tokyo-bg-highlight)]/50 rounded-lg p-4 border border-[var(--tokyo-green)]/20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={16} style={{ color: "var(--tokyo-green)" }} />
                    <span className="text-sm font-medium text-[var(--tokyo-green)]">
                      Result
                    </span>
                  </div>
                  <code className="text-lg font-mono text-[var(--tokyo-cyan)]">
                    {executionState.currentStep.result.inspect()}
                  </code>
                </motion.div>
              )}

              {/* Variables Section */}
              <VariablesDeclared
                executionState={executionState}
                highlightedVariable={highlightedVariable}
                setHighlightedVariable={setHighlightedVariable}
              />

              <OutputVisualizer executionState={executionState} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutionStep;
