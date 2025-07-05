import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StepwiseEvaluator,
  ExecutionState,
} from "@/lang/exec/stepwise/stepwise";
import { Braces, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Program } from "@/lang/ast";
import { ErrorMessage } from "@/lang/parser/parser";
import Evaluator from "@/lang/exec/evaluation/eval";
import { Environment } from "@/lang/exec/objects";
import EnvironmentVisualizer from "./environment-visualizer";
import StepInformationDisplay from "./step-information-display";
import ExecutionControls from "./execution-controls";
import OutputVisualizer from "./output-visualizer";

interface ExecutionVisualizerProps {
  program: Program | null;
  parserErrors: ErrorMessage[];
}

const ExecutionVisualizer: React.FC<ExecutionVisualizerProps> = ({
  program,
  parserErrors,
}) => {
  const [evaluator] = useState<StepwiseEvaluator>(new StepwiseEvaluator());
  const [executionState, setExecutionState] = useState<ExecutionState | null>(
    null
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoRunSpeed, setAutoRunSpeed] = useState<number>(1000);
  const [error, setError] = useState<string | null>(null);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);
  const [showDetailedSteps, setShowDetailedSteps] = useState<boolean>(true);
  const [highlightChanges, setHighlightChanges] = useState<boolean>(true);

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
  }, [program, parserErrors, evaluator]);

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
  }, [evaluator]);

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
  }, [evaluator]);

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

  // Stop auto-running execution
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

  return (
    <div className="w-full h-full bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--tokyo-bg-highlight)] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Braces size={20} className="text-[var(--tokyo-purple)]" />
            <h2 className="text-lg font-bold">Step-by-Step Execution</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={showDetailedSteps}
                onChange={(e) => setShowDetailedSteps(e.target.checked)}
                className="rounded"
              />
              <span>Detailed Steps</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={highlightChanges}
                onChange={(e) => setHighlightChanges(e.target.checked)}
                className="rounded"
              />
              <span>Highlight Changes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <motion.div
          className="bg-[var(--tokyo-red)]/10 border border-[var(--tokyo-red)] text-[var(--tokyo-red)] p-3 m-4 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      {/* Controls section */}
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
        program={program}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <StepInformationDisplay executionState={executionState} />

            {/* Environment Variables */}
            {executionState?.currentStep && (
              <EnvironmentVisualizer
                environment={executionState.currentStep.environment}
              />
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Execution Log */}
            {executionState && (
              <OutputVisualizer outputs={executionState.output} />
            )}

            {/* Call Stack */}
            {executionState && executionState.callStack.length > 0 && (
              <div className="border rounded-md bg-[var(--tokyo-bg-dark)] p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Braces size={14} className="text-[var(--tokyo-blue)]" />
                  <h3 className="text-sm font-medium">Call Stack</h3>
                </div>

                <div className="space-y-2">
                  {executionState.callStack.map((frame, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-[var(--tokyo-bg)] p-2 rounded text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="font-medium">{frame.functionName}</div>
                      <div className="text-xs text-[var(--tokyo-comment)]">
                        Args: ({frame.args.join(", ")})
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div className="border-t border-[var(--tokyo-bg-highlight)] p-4">
        <div className="flex items-center justify-between text-xs text-[var(--tokyo-comment)]">
          <div className="flex items-center gap-4">
            <span>
              {executionState?.isComplete
                ? "✅ Execution complete"
                : executionState?.currentStep
                ? "🔄 Execution in progress..."
                : "⏳ Ready to execute"}
            </span>

            {executionState?.currentStep && (
              <span>
                Current: {executionState.currentStep.node.constructor.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionVisualizer;
