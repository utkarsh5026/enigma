import React, { useState, useCallback, useEffect, useRef } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import {
  StepwiseEvaluator,
  ExecutionState,
  EnvironmentSnapshot,
} from "@/lang/exec/stepwise/stepwise";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
  Terminal,
  Database,
  Braces,
  Eye,
  Clock,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedExecutionVisualizerProps {
  code: string;
}

const EnhancedExecutionVisualizer: React.FC<
  EnhancedExecutionVisualizerProps
> = ({ code }) => {
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

  // Prepare the code for execution
  const prepareExecution = useCallback(() => {
    try {
      setError(null);

      if (!code || code.trim() === "") {
        setError("No code to execute. Please enter some code in the editor.");
        return false;
      }

      const lexer = new Lexer(code);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const errors = parser.parserErrors();
      if (errors.length > 0) {
        setError(`Parser errors: ${errors.map((e) => e.message).join(", ")}`);
        return false;
      }

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
  }, [code, evaluator]);

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

  // Enhanced Environment Visualizer
  const EnhancedEnvironmentVisualizer: React.FC<{
    environment: EnvironmentSnapshot;
    depth?: number;
  }> = ({ environment, depth = 0 }) => {
    const [expanded, setExpanded] = useState(depth === 0);

    return (
      <motion.div
        className={`border rounded-md bg-[#161b22] overflow-hidden ${
          depth > 0 ? "mt-2 ml-4" : ""
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer bg-[#21262d] hover:bg-[#2c3444] transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <Database size={14} className="text-[#4d9375]" />
            <span className="text-sm font-medium">
              {environment.isBlockScope ? "Block Scope" : "Function Scope"}
            </span>
            <Badge variant="outline" className="text-xs">
              {environment.variables.length} variables
            </Badge>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-3">
                {environment.variables.length > 0 ? (
                  <div className="space-y-2">
                    {environment.variables.map((variable, idx) => (
                      <motion.div
                        key={`${variable.name}-${idx}`}
                        className={cn(
                          "flex items-center gap-2 text-sm p-2 rounded",
                          variable.isNew && highlightChanges
                            ? "bg-[#1a4c30] border border-[#4d9375]/30"
                            : "bg-[#1a1b26]"
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span
                          className={`font-medium ${
                            variable.isConstant
                              ? "text-[#ff7b72]"
                              : "text-[#79c0ff]"
                          }`}
                        >
                          {variable.isConstant ? "const" : "let"}{" "}
                          {variable.name}:
                        </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {variable.type}
                        </Badge>
                        <code className="bg-[#21262d] px-2 py-0.5 rounded text-xs break-all max-w-[200px] overflow-hidden text-ellipsis">
                          {variable.value}
                        </code>
                        {variable.isNew && (
                          <Badge className="bg-[#4d9375] text-white text-xs">
                            NEW
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#8b949e] italic text-sm text-center py-4">
                    No variables defined
                  </div>
                )}

                {environment.parentEnvironment && (
                  <EnhancedEnvironmentVisualizer
                    environment={environment.parentEnvironment}
                    depth={depth + 1}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Enhanced Output Visualizer
  const EnhancedOutputVisualizer: React.FC<{
    outputs: ExecutionState["output"];
  }> = ({ outputs }) => {
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, [outputs]);

    const getOutputIcon = (type: string) => {
      switch (type) {
        case "error":
          return <AlertCircle size={12} className="text-[#f7768e]" />;
        case "return":
          return <CheckCircle size={12} className="text-[#7aa2f7]" />;
        case "assignment":
          return <Database size={12} className="text-[#4d9375]" />;
        case "operation":
          return <Zap size={12} className="text-[#e0af68]" />;
        default:
          return <Terminal size={12} className="text-[#a9b1d6]" />;
      }
    };

    return (
      <div className="border rounded-md bg-[#161b22] p-3">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={14} className="text-[#4d9375]" />
          <h3 className="text-sm font-medium">Execution Log</h3>
          <Badge variant="outline" className="text-xs">
            {outputs.length} entries
          </Badge>
        </div>

        <div
          ref={outputRef}
          className="font-mono text-xs bg-[#0d1117] rounded-md p-3 max-h-48 overflow-auto space-y-1"
        >
          {outputs.length > 0 ? (
            <AnimatePresence>
              {outputs.map((output, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className={cn(
                    "flex items-start gap-2 px-2 py-1 rounded",
                    output.type === "error"
                      ? "bg-[#3e1723] text-[#f7768e]"
                      : output.type === "return"
                      ? "bg-[#1a2741] text-[#7aa2f7]"
                      : output.type === "assignment"
                      ? "bg-[#1a2e1f] text-[#4d9375]"
                      : output.type === "operation"
                      ? "bg-[#2e2618] text-[#e0af68]"
                      : "bg-[#1a1b26] text-[#a9b1d6]"
                  )}
                >
                  <div className="mt-0.5">{getOutputIcon(output.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs opacity-60 mb-1">
                      <span>Step {output.stepNumber}</span>
                      <span>•</span>
                      <span>
                        {new Date(output.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>{output.value}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-[#8b949e] italic text-center py-8">
              <Terminal size={24} className="mx-auto mb-2 opacity-50" />
              <p>No output yet. Execute some code to see results here.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced Step Information Display
  const StepInformationDisplay: React.FC = () => {
    if (!executionState?.currentStep) return null;

    const step = executionState.currentStep;

    return (
      <motion.div
        className="border rounded-md bg-[#161b22] p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Eye size={14} className="text-[#bb9af7]" />
          <h3 className="text-sm font-medium">Current Step</h3>
          <Badge
            className={cn(
              "text-xs",
              step.stepType === "before"
                ? "bg-[#e0af68]/20 text-[#e0af68]"
                : step.stepType === "after"
                ? "bg-[#4d9375]/20 text-[#4d9375]"
                : "bg-[#7aa2f7]/20 text-[#7aa2f7]"
            )}
          >
            {step.stepType}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Step description */}
          <div className="bg-[#0d1117] p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Clock
                size={14}
                className="text-[#7aa2f7] mt-0.5 flex-shrink-0"
              />
              <div>
                <div className="text-sm font-medium mb-1">
                  What's happening:
                </div>
                <p className="text-sm text-[#a9b1d6]">{step.description}</p>
              </div>
            </div>
          </div>

          {/* Result display */}
          {step.result && (
            <div className="bg-[#0d1117] p-3 rounded-md">
              <div className="flex items-start gap-2">
                <CheckCircle
                  size={14}
                  className="text-[#4d9375] mt-0.5 flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-medium mb-1">Result:</div>
                  <code className="text-sm bg-[#21262d] px-2 py-1 rounded text-[#7aa2f7]">
                    {step.result.inspect()}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Position information */}
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span>Line: {step.lineNumber}</span>
            <span>Column: {step.columnNumber}</span>
            <span>Depth: {step.depth}</span>
            <span>Phase: {step.executionPhase}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Progress indicator
  const ProgressIndicator: React.FC = () => {
    if (!executionState) return null;

    const progress =
      executionState.totalSteps > 0
        ? (executionState.currentStepNumber / executionState.totalSteps) * 100
        : 0;

    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#8b949e]">Progress:</span>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-xs text-[#8b949e] font-mono">
          {executionState.currentStepNumber}/{executionState.totalSteps}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#a9b1d6] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#30363d] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Braces size={20} className="text-[#bb9af7]" />
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

        <ProgressIndicator />
      </div>

      {/* Error display */}
      {error && (
        <motion.div
          className="bg-[#331c1f] border border-[#f7768e] text-[#f7768e] p-3 m-4 rounded-md"
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
      <div className="border-b border-[#30363d] p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={prepareExecution}
            className="bg-[#21262d] hover:bg-[#30363d] text-white p-2 rounded-md transition-colors"
            title="Reset and Prepare"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={executeStep}
            disabled={isRunning || executionState?.isComplete === true}
            className={cn(
              "bg-[#4d9375] hover:bg-[#3a7057] text-white p-2 rounded-md transition-colors",
              (isRunning || executionState?.isComplete === true) &&
                "opacity-50 cursor-not-allowed"
            )}
            title="Step Forward"
          >
            <StepForward size={18} />
          </button>

          <button
            onClick={goBackStep}
            disabled={
              isRunning ||
              !executionState ||
              executionState.currentStepNumber <= 1
            }
            className={cn(
              "bg-[#21262d] hover:bg-[#30363d] text-white p-2 rounded-md transition-colors",
              (isRunning ||
                !executionState ||
                executionState.currentStepNumber <= 1) &&
                "opacity-50 cursor-not-allowed"
            )}
            title="Step Back"
          >
            <StepBack size={18} />
          </button>

          {isRunning ? (
            <button
              onClick={stopAutoRun}
              className="bg-[#f7768e] hover:bg-[#d95673] text-white p-2 rounded-md transition-colors"
              title="Pause"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!executionState) {
                  if (prepareExecution()) {
                    startAutoRun();
                  }
                } else if (!executionState.isComplete) {
                  startAutoRun();
                } else {
                  prepareExecution();
                  startAutoRun();
                }
              }}
              disabled={executionState?.isComplete === true && !code}
              className={cn(
                "bg-[#4d9375] hover:bg-[#3a7057] text-white p-2 rounded-md transition-colors",
                executionState?.isComplete === true &&
                  !code &&
                  "opacity-50 cursor-not-allowed"
              )}
              title="Auto Run"
            >
              <Play size={18} />
            </button>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-[#8b949e]">Speed:</span>
            <Slider
              value={[autoRunSpeed]}
              min={200}
              max={3000}
              step={200}
              onValueChange={(values) => setAutoRunSpeed(values[0])}
              disabled={isRunning}
              className="w-32"
            />
            <span className="text-xs font-mono text-[#8b949e] w-16">
              {autoRunSpeed}ms
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <StepInformationDisplay />

            {/* Environment Variables */}
            {executionState?.currentStep && (
              <EnhancedEnvironmentVisualizer
                environment={executionState.currentStep.environment}
              />
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Execution Log */}
            {executionState && (
              <EnhancedOutputVisualizer outputs={executionState.output} />
            )}

            {/* Call Stack */}
            {executionState && executionState.callStack.length > 0 && (
              <div className="border rounded-md bg-[#161b22] p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Braces size={14} className="text-[#7aa2f7]" />
                  <h3 className="text-sm font-medium">Call Stack</h3>
                </div>

                <div className="space-y-2">
                  {executionState.callStack.map((frame, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-[#1a1b26] p-2 rounded text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="font-medium">{frame.functionName}</div>
                      <div className="text-xs text-[#8b949e]">
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
      <div className="border-t border-[#30363d] p-4">
        <div className="flex items-center justify-between text-xs text-[#8b949e]">
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

          {executionState && !executionState.isComplete && (
            <Badge variant="outline" className="text-xs">
              Step {executionState.currentStepNumber} of{" "}
              {executionState.totalSteps}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedExecutionVisualizer;
