import { cn } from "@/lib/utils";
import { RotateCcw, StepForward, StepBack, Pause, Play } from "lucide-react";
import { ExecutionState } from "@/lang/exec/stepwise/stepwise";
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
  return (
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
            disabled={executionState?.isComplete === true && !program}
            className={cn(
              "bg-[#4d9375] hover:bg-[#3a7057] text-white p-2 rounded-md transition-colors",
              executionState?.isComplete === true &&
                !program &&
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
  );
};

export default ExecutionControls;
