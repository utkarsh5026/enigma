import { RotateCcw, SkipForward, SkipBack, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { ExecutionState } from "@/lang/exec/steps/step-info";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ExecutionControlsProps {
  prepareExecution: () => boolean;
  executeStep: () => void;
  goBackStep: () => void;
  executionState: ExecutionState | null;
  isHighlightingEnabled?: boolean;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  prepareExecution,
  executeStep,
  goBackStep,
  executionState,
  isHighlightingEnabled = false,
}) => {
  const handleGoBackStep = () => {
    goBackStep();

    // Visual feedback for highlighting
    if (isHighlightingEnabled) {
      console.log("Going back with highlighting enabled");
    }
  };

  const hasValidPosition =
    executionState?.currentStep?.lineNumber &&
    executionState?.currentStep?.columnNumber;

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <motion.button
          onClick={prepareExecution}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "bg-[var(--tokyo-bg-highlight)] hover:bg-[var(--tokyo-comment)] text-[var(--tokyo-fg)] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
            executionState
              ? "text-[var(--tokyo-red)]"
              : "text-[var(--tokyo-green)] hover:text-[var(--tokyo-fg)]"
          )}
        >
          <RotateCcw size={16} />
          {executionState ? "Reset" : "Prepare"}
        </motion.button>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--tokyo-bg-highlight)] hover:bg-[var(--tokyo-comment)] text-[var(--tokyo-fg)] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:text-[var(--tokyo-fg)]"
              onClick={handleGoBackStep}
              disabled={!executionState}
            >
              <SkipBack size={16} />
              Back
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] font-cascadia-code">
            <p className="text-xs text-[var(--tokyo-fg)]">
              Go back one execution step
              {isHighlightingEnabled && " (with code highlighting)"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--tokyo-green)]/80 hover:bg-[var(--tokyo-green)]/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer hover:text-[var(--tokyo-green)] hover:shadow-sm hover:shadow-[var(--tokyo-green)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={executeStep}
              disabled={!executionState || executionState.isComplete}
            >
              <SkipForward size={16} />
              Step
              {isHighlightingEnabled && hasValidPosition && (
                <Eye size={12} className="ml-1" />
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] font-cascadia-code">
            <p className="text-xs text-tokyo-green">
              Execute next step
              {isHighlightingEnabled &&
                hasValidPosition &&
                " and highlight code"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {executionState?.currentStep && (
        <div className="bg-[var(--tokyo-bg-highlight)]/30 rounded-lg p-3 border border-[var(--tokyo-comment)]/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-[var(--tokyo-fg-dark)]">
                Node:{" "}
                <span className="text-[var(--tokyo-fg)] font-mono">
                  {executionState.currentStep.node.whatIam().name}
                </span>
              </span>

              {executionState.currentStep.lineNumber && (
                <span className="text-[var(--tokyo-fg-dark)]">
                  Position:{" "}
                  <span className="text-[var(--tokyo-cyan)] font-mono">
                    {executionState.currentStep.node.position().line}:
                    {executionState.currentStep.node.position().column}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionControls;
