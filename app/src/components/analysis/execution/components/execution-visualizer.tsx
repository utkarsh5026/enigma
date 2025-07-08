import React, { useState, useCallback, useEffect, useRef } from "react";
import { StepwiseEvaluator, ExecutionState } from "@/lang/exec/stepwise";
import {
  AlertCircle,
  Terminal,
  RotateCcw,
  Zap,
  Activity,
  Eye,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Program } from "@/lang/ast";
import { ErrorMessage } from "@/lang/parser/parser";
import Evaluator from "@/lang/exec/evaluation/eval";
import { Environment } from "@/lang/exec/objects";
import ExecutionControls from "./execution-controls";
import VariablesDeclared from "./variables-declared";
import OutputVisualizer from "./output-visualizer";
import { parseDescriptionWithBadges } from "./utils";

interface ExecutionVisualizerProps {
  program: Program | null;
  parserErrors: ErrorMessage[];
}

const evaluator = new StepwiseEvaluator();

const ExecutionVisualizer: React.FC<ExecutionVisualizerProps> = ({
  program,
  parserErrors,
}) => {
  const [executionState, setExecutionState] = useState<ExecutionState | null>(
    null
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoRunSpeed, setAutoRunSpeed] = useState<number>(1000);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlightedVariable, setHighlightedVariable] = useState<string | null>(
    null
  );

  const prepareExecution = useCallback(() => {
    try {
      setError(null);

      if (!program) {
        setError("No code to execute. Please enter some code in the editor.");
        return false;
      }

      const errors = parserErrors;
      if (errors.length > 0) {
        setError(`Parser errors: ${errors.map((e) => e.message).join(", ")}`);
        return false;
      }

      console.log(new Evaluator().evaluate(program, new Environment()));

      evaluator.prepare(program);

      // Get initial state
      const initialState = evaluator.nextStep();
      setExecutionState(initialState);

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Error preparing execution: ${message}`);
      return false;
    }
  }, [program, parserErrors]);

  // Execute a single step
  const executeStep = useCallback(() => {
    try {
      const newState = evaluator.nextStep();
      setExecutionState({ ...newState });

      if (newState.isComplete) {
        setIsRunning(false);
        return false;
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Execution error: ${message}`);
      setIsRunning(false);
      return false;
    }
  }, []);

  // Go back one step
  const goBackStep = useCallback(() => {
    try {
      const prevState = evaluator.previousStep();
      if (prevState) {
        setExecutionState({ ...prevState });
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Error going back: ${message}`);
      return false;
    }
  }, []);

  // Start auto-running execution
  const startAutoRun = useCallback(() => {
    if (autoRunRef.current) clearInterval(autoRunRef.current);
    setIsRunning(true);

    autoRunRef.current = setInterval(() => {
      const hasMoreSteps = executeStep();
      if (!hasMoreSteps && autoRunRef.current) {
        clearInterval(autoRunRef.current);
        autoRunRef.current = null;
        setIsRunning(false);
      }
    }, autoRunSpeed);
  }, [executeStep, autoRunSpeed]);

  const stopAutoRun = useCallback(() => {
    if (autoRunRef.current) {
      clearInterval(autoRunRef.current);
      autoRunRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoRunRef.current) clearInterval(autoRunRef.current);
    };
  }, []);

  const getStepTypeInfo = (stepType: string) => {
    switch (stepType) {
      case "before":
        return {
          label: "About to Execute",
          icon: <Eye size={16} style={{ color: "var(--tokyo-yellow)" }} />,
          color: "text-[var(--tokyo-yellow)]",
          bgColor: "bg-[var(--tokyo-yellow)]/10",
          borderColor: "border-[var(--tokyo-yellow)]/20",
        };
      case "after":
        return {
          label: "Just Completed",
          icon: (
            <CheckCircle size={16} style={{ color: "var(--tokyo-green)" }} />
          ),
          color: "text-[var(--tokyo-green)]",
          bgColor: "bg-[var(--tokyo-green)]/10",
          borderColor: "border-[var(--tokyo-green)]/20",
        };
      default:
        return {
          label: "Processing",
          icon: <Activity size={16} style={{ color: "var(--tokyo-blue)" }} />,
          color: "text-[var(--tokyo-blue)]",
          bgColor: "bg-[var(--tokyo-blue)]/10",
          borderColor: "border-[var(--tokyo-blue)]/20",
        };
    }
  };

  const stepInfo = executionState?.currentStep
    ? getStepTypeInfo(executionState.currentStep.stepType)
    : null;

  return (
    <div className="w-full h-screen bg-[var(--tokyo-bg-dark)] text-[var(--tokyo-fg)] flex flex-col">
      {/* Header Controls */}
      <div className="shrink-0 border-b border-[var(--tokyo-comment)]/30 bg-[var(--tokyo-bg)]/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <div className="absolute inset-0 bg-[var(--tokyo-blue)]/20 rounded-lg blur-sm" />
                <div className="relative bg-[var(--tokyo-blue)] p-2 rounded-lg">
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

            <div className="flex items-center gap-2">
              {executionState && (
                <>
                  <span className="text-sm text-[var(--tokyo-fg-dark)]">
                    Step
                  </span>
                  <span className="bg-[var(--tokyo-bg-highlight)] px-3 py-1 rounded text-sm font-mono">
                    {executionState.currentStepNumber}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-4 bg-[var(--tokyo-red)]/10 border border-[var(--tokyo-red)]/30 rounded-lg p-4"
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
                  <h3 className="font-medium text-[var(--tokyo-red)] mb-1">
                    Execution Error
                  </h3>
                  <p className="text-sm text-[var(--tokyo-fg-dark)]">{error}</p>
                </div>
                <motion.button
                  onClick={() => setError(null)}
                  className="ml-auto text-[var(--tokyo-red)] hover:text-[var(--tokyo-red)]/80 transition-colors"
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
            executeStep={executeStep}
            goBackStep={goBackStep}
            isRunning={isRunning}
            executionState={executionState}
            stopAutoRun={stopAutoRun}
            startAutoRun={startAutoRun}
            autoRunSpeed={autoRunSpeed}
            setAutoRunSpeed={setAutoRunSpeed}
          />
        </div>
      </div>

      {/* Main Content */}
      {!error && executionState && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Step Card */}
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
                    {stepInfo && (
                      <motion.div
                        className={`p-2 rounded-lg ${stepInfo.bgColor} border ${stepInfo.borderColor}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {stepInfo.icon}
                      </motion.div>
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-semibold text-[var(--tokyo-fg)]">
                          {executionState.currentStep?.node.constructor.name ||
                            "Ready to Execute"}
                        </h2>
                        {stepInfo && (
                          <span
                            className={`text-sm px-2 py-1 rounded ${stepInfo.bgColor} ${stepInfo.color}`}
                          >
                            {stepInfo.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--tokyo-fg-dark)]">
                        {executionState.currentStep?.description
                          ? parseDescriptionWithBadges(
                              executionState.currentStep.description
                            )
                          : "Click Step or Run to begin execution"}
                      </p>
                    </div>
                  </div>

                  {executionState.currentStep && (
                    <div className="text-right">
                      <div className="text-sm text-[var(--tokyo-fg-dark)]">
                        Line {executionState.currentStep.lineNumber}
                      </div>
                      <div className="text-xs text-[var(--tokyo-comment)]">
                        Col {executionState.currentStep.columnNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Content */}
              {executionState.currentStep && (
                <div className="p-6 space-y-6">
                  {/* Result Display */}
                  {executionState.currentStep.result && (
                    <motion.div
                      className="bg-[var(--tokyo-bg-highlight)]/50 rounded-lg p-4 border border-[var(--tokyo-green)]/20"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Zap
                          size={16}
                          style={{ color: "var(--tokyo-green)" }}
                        />
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

            {/* Progress Indicator */}
            <motion.div
              className="bg-[var(--tokyo-bg)]/30 rounded-lg p-4 border border-[var(--tokyo-comment)]/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--tokyo-fg-dark)]">
                  {executionState.isComplete
                    ? "✅ Execution Complete"
                    : "🔄 Execution in Progress"}
                </span>
                <span className="text-[var(--tokyo-comment)]">
                  Step {executionState.currentStepNumber}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-[var(--tokyo-bg-highlight)] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: "var(--tokyo-blue)" }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(executionState.currentStepNumber / 10) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Error State - No Execution */}
      {error && !executionState && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertCircle
              size={48}
              style={{ color: "var(--tokyo-red)" }}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-[var(--tokyo-fg)] mb-2">
              Cannot Execute Code
            </h2>
            <p className="text-[var(--tokyo-fg-dark)] mb-6">
              Fix the error above and click Reset to try again.
            </p>
            <motion.button
              onClick={prepareExecution}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--tokyo-blue)] hover:bg-[var(--tokyo-blue)]/80 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
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
