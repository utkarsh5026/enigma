import React, { useState, useEffect } from "react";
import { AlertCircle, Terminal, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import ExecutionControls from "./execution-controls";
import { useExecutionControls } from "../hooks/use-execution";
import ExecutionStep from "./execution-step";

interface ExecutionVisualizerProps {
  code: string;
  onHighlightCode?: (
    line: number,
    column: number,
    endLine?: number,
    endColumn?: number
  ) => void;
}

const ExecutionVisualizer: React.FC<ExecutionVisualizerProps> = ({
  code,
  onHighlightCode,
}) => {
  const {
    executionState,
    error,
    prepareExecution,
    executeStep,
    goBackStep,
    setError,
    stepCount,
  } = useExecutionControls(code);

  const [highlightedVariable, setHighlightedVariable] = useState<string | null>(
    null
  );
  const [isHighlightingEnabled] = useState(!!onHighlightCode);

  useEffect(() => {
    if (!onHighlightCode || !executionState?.currentStep) return;

    const { start, end } = executionState.currentStep.node.nodeRange();
    onHighlightCode(start.line, start.column, end.line, end.column);
  }, [executionState?.currentStep, onHighlightCode]);

  const handleExecuteStep = () => {
    const result = executeStep();
    if (result && isHighlightingEnabled) {
      console.log("Step executed with highlighting");
    }
    return result;
  };

  const handleGoBackStep = () => {
    const result = goBackStep();
    if (result && isHighlightingEnabled) {
      console.log("Went back step with highlighting");
    }
    return result;
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[var(--tokyo-bg-dark)] text-[var(--tokyo-fg)]">
      {/* Header Controls */}
      <div className="shrink-0 border-b border-[var(--tokyo-comment)]/30 bg-[var(--tokyo-bg)]/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <div className="absolute inset-0 rounded-lg bg-[var(--tokyo-blue)]/20 blur-sm" />
                <div className="relative rounded-lg bg-[var(--tokyo-blue)] p-2">
                  <Terminal size={20} className="text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-[var(--tokyo-fg)]">
                  Code Execution
                </h1>
                <p className="text-sm text-[var(--tokyo-fg-dark)]">
                  Step-by-step program execution
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-4 rounded-lg border border-[var(--tokyo-red)]/30 bg-[var(--tokyo-red)]/10 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  style={{ color: "var(--tokyo-red)" }}
                  className="mt-0.5 flex-shrink-0"
                />
                <div>
                  <h3 className="mb-1 font-medium text-[var(--tokyo-red)]">
                    Execution Error
                  </h3>
                  <p className="text-sm text-[var(--tokyo-fg-dark)]">{error}</p>
                </div>
                <motion.button
                  onClick={() => setError(null)}
                  className="ml-auto text-[var(--tokyo-red)] transition-colors hover:text-[var(--tokyo-red)]/80"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
            </motion.div>
          )}

          <ExecutionControls
            prepareExecution={prepareExecution}
            executeStep={handleExecuteStep}
            goBackStep={handleGoBackStep}
            executionState={executionState}
          />
        </div>
      </div>

      {/* Main Content */}
      {!error && executionState && (
        <ExecutionStep
          executionState={executionState}
          isHighlightingEnabled={isHighlightingEnabled}
          highlightedVariable={highlightedVariable}
          setHighlightedVariable={setHighlightedVariable}
          stepCount={stepCount}
        />
      )}

      {/* Error State - No Execution */}
      {error && !executionState && (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md text-center">
            <AlertCircle
              size={48}
              style={{ color: "var(--tokyo-red)" }}
              className="mx-auto mb-4"
            />
            <h2 className="mb-2 text-xl font-semibold text-[var(--tokyo-fg)]">
              Cannot Execute Code
            </h2>
            <p className="mb-6 text-[var(--tokyo-fg-dark)]">
              Fix the error above and click Reset to try again.
            </p>
            <motion.button
              onClick={prepareExecution}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mx-auto flex items-center gap-2 rounded-lg bg-[var(--tokyo-blue)] px-6 py-3 text-white transition-colors hover:bg-[var(--tokyo-blue)]/80"
            >
              <RotateCcw size={16} />
              Try Again
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionVisualizer;
