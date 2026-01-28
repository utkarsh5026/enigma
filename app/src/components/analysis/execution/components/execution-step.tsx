import React from "react";
import {
  Zap,
  Eye,
  Play,
  CheckCircle,
  Clock,
  Code2,
  MapPin,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VariablesDeclared from "./variables-declared";
import OutputVisualizer from "./output-visualizer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExecutionState } from "@/lang/exec/steps/step-info";
import { parseDescriptionWithBadges } from "./utils";
interface ExecutionStepProps {
  executionState: ExecutionState;
  isHighlightingEnabled: boolean;
  highlightedVariable: string | null;
  setHighlightedVariable: (variable: string | null) => void;
  stepCount: number;
}

const ExecutionStep: React.FC<ExecutionStepProps> = ({
  executionState,
  isHighlightingEnabled,
  highlightedVariable,
  setHighlightedVariable,
  stepCount,
}) => {
  const currentStep = executionState.currentStep;
  const stepNumber = executionState.currentStepNumber;
  const isCompleted = executionState.isComplete;

  // Get step status and appropriate styling
  const getStepStatus = () => {
    if (isCompleted)
      return { icon: CheckCircle, color: "tokyo-green", text: "Completed" };
    if (currentStep)
      return { icon: Activity, color: "tokyo-blue", text: "Executing" };
    return { icon: Clock, color: "tokyo-yellow", text: "Waiting" };
  };

  const status = getStepStatus();

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {/* Compact Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-[var(--${status.color})]/10`}>
              <status.icon
                size={14}
                className={`text-[var(--${status.color})]`}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--tokyo-fg)]">
                Step {stepNumber}/{stepCount}
              </div>
              <div className="text-xs text-[var(--tokyo-comment)]">
                {status.text}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-[var(--tokyo-blue)]">
              {Math.round((stepNumber / stepCount) * 100)}%
            </div>
          </div>
        </motion.div>

        {/* Compact Progress Bar */}
        <div className="h-1 bg-[var(--tokyo-bg-highlight)] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-[var(--tokyo-blue)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stepNumber / stepCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Current Step Information */}
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={stepNumber}
              className="bg-[var(--tokyo-bg)]/60 border border-[var(--tokyo-comment)]/20 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Compact Header with Node Info */}
              <div className="p-3 border-b border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-dark)]/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-[var(--tokyo-blue)]" />
                    <span className="font-semibold text-[var(--tokyo-fg)] text-sm">
                      {currentStep.node.constructor.name}
                    </span>
                  </div>

                  {/* Compact Location */}
                  {currentStep.lineNumber && (
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin
                        size={10}
                        className="text-[var(--tokyo-comment)]"
                      />
                      <span className="text-[var(--tokyo-cyan)] font-mono">
                        {currentStep.lineNumber}:{currentStep.columnNumber}
                      </span>
                      {isHighlightingEnabled && (
                        <Eye
                          size={10}
                          className="text-[var(--tokyo-green)] ml-1"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Node Content using toString() */}
                {currentStep.description && (
                  <div className="text-xs bg-[var(--tokyo-bg-highlight)]/50 rounded px-2 py-1 font-mono text-[var(--tokyo-fg-dark)] break-all">
                    {parseDescriptionWithBadges(currentStep.description)}
                  </div>
                )}
              </div>

              {/* Compact Content */}
              <div className="p-3 space-y-3">
                {/* Result - More Compact */}
                {currentStep.result && (
                  <motion.div
                    className="bg-[var(--tokyo-green)]/5 border border-[var(--tokyo-green)]/20 rounded p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-[var(--tokyo-green)]" />
                      <span className="text-xs font-medium text-[var(--tokyo-green)]">
                        Result
                      </span>
                    </div>
                    <div className="bg-[var(--tokyo-bg-dark)]/60 rounded p-2">
                      <code className="text-sm font-mono text-[var(--tokyo-cyan)] break-all">
                        {currentStep.result.inspect()}
                      </code>
                    </div>
                  </motion.div>
                )}

                {/* Compact Variables */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <VariablesDeclared
                    executionState={executionState}
                    highlightedVariable={highlightedVariable}
                    setHighlightedVariable={setHighlightedVariable}
                  />
                </motion.div>

                {/* Compact Output */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <OutputVisualizer executionState={executionState} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Completion State */}
        {isCompleted && (
          <motion.div
            className="text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--tokyo-green)]/10 border border-[var(--tokyo-green)]/20 rounded-full text-sm">
              <CheckCircle size={14} className="text-[var(--tokyo-green)]" />
              <span className="font-medium text-[var(--tokyo-green)]">
                Completed
              </span>
            </div>
          </motion.div>
        )}

        {/* Compact Empty State */}
        {!currentStep && !isCompleted && (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--tokyo-blue)]/10 border border-[var(--tokyo-blue)]/20 rounded-full text-sm">
              <Play size={14} className="text-[var(--tokyo-blue)]" />
              <span className="font-medium text-[var(--tokyo-blue)]">
                Ready to Execute
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ExecutionStep;
