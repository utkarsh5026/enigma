import { cn } from "@/lib/utils";
import {
  RotateCcw,
  StepForward,
  StepBack,
  Pause,
  Play,
  Zap,
  Clock,
  Info,
  CheckCircle2,
} from "lucide-react";
import { ExecutionState } from "@/lang/exec/stepwise";
import { Slider } from "@/components/ui/slider";
import { Program } from "@/lang/ast/ast";

interface ExecutionControlsProps {
  prepareExecution: () => boolean;
  executeStep: () => void;
  goBackStep: () => void;
  isRunning: boolean;
  executionState: ExecutionState | null;
  stopAutoRun: () => void;
  startAutoRun: () => void;
  autoRunSpeed: number;
  setAutoRunSpeed: (speed: number) => void;
  program: Program | null;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  prepareExecution,
  executeStep,
  goBackStep,
  isRunning,
  executionState,
  stopAutoRun,
  startAutoRun,
  autoRunSpeed,
  setAutoRunSpeed,
  program,
}) => {
  const getExecutionStatus = () => {
    if (!executionState) {
      return {
        message: "Ready to Begin",
        description:
          "Click reset to prepare your code for step-by-step execution",
        color: "text-[var(--tokyo-comment)]",
        icon: <Clock size={16} className="text-[var(--tokyo-comment)]" />,
      };
    }

    if (executionState.isComplete) {
      return {
        message: "Execution Complete",
        description: `Finished in ${executionState.currentStepNumber} steps`,
        color: "text-[var(--tokyo-green)]",
        icon: <CheckCircle2 size={16} className="text-[var(--tokyo-green)]" />,
      };
    }

    if (isRunning) {
      return {
        message: "Auto-Running",
        description: `Step ${executionState.currentStepNumber} - executing automatically`,
        color: "text-[var(--tokyo-blue)]",
        icon: (
          <Zap size={16} className="text-[var(--tokyo-blue)] animate-pulse" />
        ),
      };
    }

    return {
      message: "Paused",
      description: `Step ${executionState.currentStepNumber} - ready for next step`,
      color: "text-[var(--tokyo-yellow)]",
      icon: <Pause size={16} className="text-[var(--tokyo-yellow)]" />,
    };
  };

  const status = getExecutionStatus();

  return (
    <div className="border-b border-[var(--tokyo-bg-highlight)] bg-[var(--tokyo-bg-dark)]">
      {/* Status bar */}
      <div className="px-4 py-3 border-b border-[var(--tokyo-bg-highlight)]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status.icon}
            <div>
              <div className={cn("text-sm font-medium", status.color)}>
                {status.message}
              </div>
              <div className="text-xs text-[var(--tokyo-comment)]">
                {status.description}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          {executionState && (
            <div className="text-xs text-[var(--tokyo-comment)] bg-[var(--tokyo-bg)] px-3 py-1 rounded-full">
              Step {executionState.currentStepNumber}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Reset button */}
          <div className="group relative">
            <button
              onClick={prepareExecution}
              className="bg-[var(--tokyo-bg)] hover:bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] p-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
              title="Reset and prepare execution"
            >
              <RotateCcw size={18} />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-[var(--tokyo-comment)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Reset & Prepare
            </div>
          </div>

          {/* Step forward */}
          <div className="group relative">
            <button
              onClick={executeStep}
              disabled={isRunning || executionState?.isComplete === true}
              className={cn(
                "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]/80 text-white p-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md",
                (isRunning || executionState?.isComplete === true) &&
                  "opacity-50 cursor-not-allowed hover:bg-[var(--tokyo-green)]"
              )}
              title="Execute one step forward"
            >
              <StepForward size={18} />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-[var(--tokyo-comment)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Step Forward
            </div>
          </div>

          {/* Step backward */}
          <div className="group relative">
            <button
              onClick={goBackStep}
              disabled={
                isRunning ||
                !executionState ||
                executionState.currentStepNumber <= 1
              }
              className={cn(
                "bg-[var(--tokyo-bg)] hover:bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] p-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md",
                (isRunning ||
                  !executionState ||
                  executionState.currentStepNumber <= 1) &&
                  "opacity-50 cursor-not-allowed"
              )}
              title="Go back one step"
            >
              <StepBack size={18} />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-[var(--tokyo-comment)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Step Back
            </div>
          </div>

          {/* Auto run / Pause toggle */}
          <div className="group relative">
            {isRunning ? (
              <button
                onClick={stopAutoRun}
                className="bg-[var(--tokyo-red)] hover:bg-[var(--tokyo-red)]/80 text-white p-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                title="Pause automatic execution"
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
                disabled={executionState?.isComplete === true && !program}
                className={cn(
                  "bg-[var(--tokyo-blue)] hover:bg-[var(--tokyo-blue)]/80 text-white p-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md",
                  executionState?.isComplete === true &&
                    !program &&
                    "opacity-50 cursor-not-allowed"
                )}
                title="Run all steps automatically"
              >
                <Play size={18} />
              </button>
            )}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-[var(--tokyo-comment)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isRunning ? "Pause Auto-Run" : "Auto-Run All"}
            </div>
          </div>

          {/* Speed control */}
          <div className="ml-auto flex items-center gap-4 bg-[var(--tokyo-bg)] rounded-md p-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[var(--tokyo-comment)]" />
              <span className="text-sm text-[var(--tokyo-comment)] font-medium">
                Execution Speed:
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--tokyo-comment)]">Slow</span>
              <Slider
                value={[autoRunSpeed]}
                min={200}
                max={3000}
                step={200}
                onValueChange={(values) => setAutoRunSpeed(values[0])}
                disabled={isRunning}
                className="w-32"
              />
              <span className="text-xs text-[var(--tokyo-comment)]">Fast</span>
            </div>

            <div className="text-xs font-mono text-[var(--tokyo-comment)] bg-[var(--tokyo-bg-dark)] px-2 py-1 rounded min-w-[60px] text-center">
              {autoRunSpeed}ms
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="bg-[var(--tokyo-bg)]/50 rounded-md p-3 border border-[var(--tokyo-bg-highlight)]">
          <div className="flex items-start gap-2">
            <Info
              size={14}
              className="text-[var(--tokyo-blue)] mt-0.5 flex-shrink-0"
            />
            <div className="text-xs text-[var(--tokyo-comment)] leading-relaxed">
              <span className="font-medium text-[var(--tokyo-blue)]">
                How to use:{" "}
              </span>
              Start by clicking{" "}
              <span className="font-mono bg-[var(--tokyo-bg-dark)] px-1 rounded">
                Reset
              </span>{" "}
              to prepare your code. Then use{" "}
              <span className="font-mono bg-[var(--tokyo-bg-dark)] px-1 rounded">
                Step Forward
              </span>{" "}
              to execute one operation at a time, or{" "}
              <span className="font-mono bg-[var(--tokyo-bg-dark)] px-1 rounded">
                Auto-Run
              </span>{" "}
              to execute all steps automatically. You can go back to previous
              steps and adjust the auto-run speed as needed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionControls;
