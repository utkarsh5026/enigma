import React, { useState, useCallback, useEffect, useRef } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import {
  StepwiseEvaluator,
  ExecutionState,
  EnvironmentSnapshot,
} from "@/lang/exec/stepwise";
import ExecutionEducationalInfo from "./ExecutinEducationVisualizer";
// import HighlightedAstViewer from "./HighLightedAstViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
  Terminal,
  Code,
  Database,
  Layers,
  Braces,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutionVisualizerProps {
  code: string;
  onCodeChange?: (code: string) => void;
}

const ExecutionVisualizer: React.FC<ExecutionVisualizerProps> = ({
  code,
  onCodeChange,
}) => {
  const [evaluator] = useState<StepwiseEvaluator>(new StepwiseEvaluator());
  const [executionState, setExecutionState] = useState<ExecutionState | null>(
    null
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoRunSpeed, setAutoRunSpeed] = useState<number>(500); // ms per step
  const [error, setError] = useState<string | null>(null);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);

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

      evaluator.prepare(program, code);
      setExecutionState(new ExecutionState());

      // Add initial console output to help users understand what's happening
      const initialState = new ExecutionState();
      initialState.output.push({
        value: "Execution started. Use the controls to step through the code.",
        type: "log",
        timestamp: Date.now(),
      });
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

  // Environment Visualizer Component
  const EnvironmentVisualizer: React.FC<{
    environment: EnvironmentSnapshot;
    depth?: number;
  }> = ({ environment, depth = 0 }) => {
    const [expanded, setExpanded] = useState(depth === 0); // Only expand the topmost environment by default

    return (
      <div
        className={`border rounded-md bg-[#161b22] overflow-hidden ${
          depth > 0 ? "mt-2" : ""
        }`}
      >
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer bg-[#21262d]"
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
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {expanded && (
          <div className="p-3">
            {environment.variables.length > 0 ? (
              <div className="space-y-2">
                {environment.variables.map((variable, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span
                      className={`font-medium ${
                        variable.isConstant
                          ? "text-[#ff7b72]"
                          : "text-[#79c0ff]"
                      }`}
                    >
                      {variable.isConstant ? "const" : "let"} {variable.name}:
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {variable.type}
                    </Badge>
                    <code className="bg-[#21262d] px-2 py-0.5 rounded text-xs break-all max-w-[200px] overflow-hidden text-ellipsis">
                      {variable.value}
                    </code>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#8b949e] italic text-sm">
                No variables defined
              </div>
            )}

            {environment.parentEnvironment && (
              <EnvironmentVisualizer
                environment={environment.parentEnvironment}
                depth={depth + 1}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  // Call Stack Visualizer Component
  const CallStackVisualizer: React.FC<{
    callStack: ExecutionState["callStack"];
  }> = ({ callStack }) => {
    return (
      <div className="border rounded-md bg-[#161b22] p-3">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={14} className="text-[#4d9375]" />
          <h3 className="text-sm font-medium">Call Stack</h3>
        </div>

        {callStack.length > 0 ? (
          <div className="space-y-2">
            {callStack
              .slice()
              .reverse()
              .map((frame, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-[#21262d] rounded-md text-sm"
                  style={{ marginLeft: `${idx * 12}px` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{frame.functionName}</span>
                    <Badge variant="outline" className="text-xs">
                      line {frame.startLine}
                    </Badge>
                  </div>
                  <div className="mt-1 font-mono text-xs text-[#8b949e]">
                    ({frame.args.join(", ")})
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-[#8b949e] italic text-sm">
            No active function calls
          </div>
        )}
      </div>
    );
  };

  // Output Visualizer Component
  const OutputVisualizer: React.FC<{
    outputs: ExecutionState["output"];
  }> = ({ outputs }) => {
    const outputRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new output is added
    useEffect(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, [outputs]);

    return (
      <div className="border rounded-md bg-[#161b22] p-3">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={14} className="text-[#4d9375]" />
          <h3 className="text-sm font-medium">Console Output</h3>
        </div>

        <div
          ref={outputRef}
          className="font-mono text-xs bg-[#0d1117] rounded-md p-3 max-h-32 overflow-auto"
        >
          {outputs.length > 0 ? (
            <div className="space-y-1">
              {outputs.map((output, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "px-1 py-0.5",
                    output.type === "error"
                      ? "text-[#f7768e]"
                      : output.type === "return"
                      ? "text-[#7aa2f7]"
                      : "text-[#a9b1d6]"
                  )}
                >
                  {output.type === "log" && "> "}
                  {output.type === "error" && "! "}
                  {output.type === "return" && "← "}
                  {output.value}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#8b949e] italic">No output yet</div>
          )}
        </div>
      </div>
    );
  };

  // Error Display Component
  const ErrorDisplay: React.FC<{
    error: string;
  }> = ({ error }) => {
    return (
      <div className="bg-[#331c1f] border border-[#f7768e] text-[#f7768e] p-3 rounded-md mb-4">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 mt-0.5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full shadow-lg border-0 bg-[#0d1117] flex flex-col">
      <CardContent className="space-y-4 flex-grow overflow-auto">
        {/* Code sample selector */}

        {/* Error display */}
        {error && <ErrorDisplay error={error} />}

        {/* Controls section */}
        <div className="flex items-center gap-2 p-3 bg-[#161b22] rounded-md">
          <button
            onClick={prepareExecution}
            className="bg-[#21262d] hover:bg-[#30363d] text-white p-2 rounded-md"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={executeStep}
            disabled={isRunning || executionState?.isComplete === true}
            className={`bg-[#4d9375] hover:bg-[#3a7057] text-white p-2 rounded-md ${
              isRunning || executionState?.isComplete === true
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            title="Step forward"
          >
            <StepForward size={18} />
          </button>

          <button
            onClick={goBackStep}
            disabled={
              isRunning ||
              !executionState ||
              executionState.currentStep === null
            }
            className={`bg-[#21262d] hover:bg-[#30363d] text-white p-2 rounded-md ${
              isRunning ||
              !executionState ||
              executionState.currentStep === null
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            title="Step back"
          >
            <StepBack size={18} />
          </button>

          {isRunning ? (
            <button
              onClick={stopAutoRun}
              className="bg-[#f7768e] hover:bg-[#d95673] text-white p-2 rounded-md"
              title="Pause"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!executionState) {
                  if (prepareExecution()) {
                    executeStep();
                    startAutoRun();
                  }
                } else if (!executionState.isComplete) {
                  startAutoRun();
                } else {
                  prepareExecution();
                  executeStep();
                  startAutoRun();
                }
              }}
              disabled={executionState?.isComplete === true && !code}
              className={`bg-[#4d9375] hover:bg-[#3a7057] text-white p-2 rounded-md ${
                executionState?.isComplete === true && !code
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title="Run"
            >
              <Play size={18} />
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#8b949e]">Speed:</span>
            <Slider
              value={[autoRunSpeed]}
              min={100}
              max={2000}
              step={100}
              onValueChange={(values) => setAutoRunSpeed(values[0])}
              disabled={isRunning}
              className="w-32"
            />
            <span className="text-xs font-mono text-[#8b949e] w-12">
              {autoRunSpeed}ms
            </span>
          </div>
        </div>

        {/* Execution description */}
        {executionState?.currentStep && (
          <div className="border rounded-md bg-[#161b22] p-3">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-[#4d9375]"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8 1a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 110-2 1 1 0 010 2zm7-1a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium">Current Execution Step</h3>
            </div>
            <p className="text-sm bg-[#0d1117] p-3 rounded-md">
              {executionState.currentStep.description}

              {executionState.currentStep.result && (
                <span className="block mt-2 pt-2 border-t border-[#30363d]">
                  <span className="text-xs text-[#8b949e]">Result: </span>
                  <code className="font-mono text-[#7aa2f7]">
                    {executionState.currentStep.result.inspect()}
                  </code>
                </span>
              )}
            </p>

            {/* Educational information about the current node type */}
            <div className="mt-3">
              <ExecutionEducationalInfo
                nodeType={executionState.currentStep.node.constructor.name}
              />
            </div>
          </div>
        )}

        {/* AST, Environment, and Call Stack visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* AST Viewer */}
            <div className="border rounded-md bg-[#161b22] p-3">
              <div className="flex items-center gap-2 mb-3">
                <Braces size={14} className="text-[#4d9375]" />
                <h3 className="text-sm font-medium">Abstract Syntax Tree</h3>
              </div>
              {/* <HighlightedAstViewer
                code={code}
                highlightedNodePath={executionState?.currentStep?.nodePath}
              /> */}
            </div>

            {/* Call Stack */}
            {executionState && (
              <CallStackVisualizer callStack={executionState.callStack} />
            )}
          </div>

          <div className="space-y-4">
            {/* Environment Variables */}
            {executionState?.currentStep && (
              <EnvironmentVisualizer
                environment={executionState.currentStep.environment}
              />
            )}
          </div>
        </div>

        {/* Output visualization */}
        {executionState && <OutputVisualizer outputs={executionState.output} />}

        {/* Execution status */}
        <div className="text-xs text-[#8b949e] flex justify-between items-center">
          <div>
            {executionState?.isComplete
              ? "Execution complete"
              : executionState?.currentStep
              ? "Execution in progress..."
              : "Ready to execute"}
          </div>

          {executionState?.currentStep && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                executionState.isComplete
                  ? "bg-[#4d9375] text-white"
                  : "bg-[#21262d]"
              )}
            >
              Step {executionState.steps?.length || 0}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Export a slimmer version without a card wrapper for embedding
export const ExecutionVisualizerCore: React.FC<ExecutionVisualizerProps> = (
  props
) => {
  return (
    <div className="h-full flex flex-col">
      <ExecutionVisualizer {...props} />
    </div>
  );
};

export default ExecutionVisualizer;
