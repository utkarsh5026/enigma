import { RotateCcw, SkipForward, SkipBack, Eye, Zap } from "lucide-react";
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
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          onClick={prepareExecution}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 rounded-lg bg-[var(--tokyo-bg-highlight)] px-4 py-2 text-[var(--tokyo-fg)] transition-colors hover:bg-[var(--tokyo-comment)]",
            executionState
              ? "text-[var(--tokyo-red)]"
              : "text-[var(--tokyo-green)] hover:text-[var(--tokyo-fg)]"
          )}
        >
          {executionState ? <RotateCcw size={16} /> : <Zap size={16} />}
          {executionState ? "Reset" : "Prepare"}
        </motion.button>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg bg-[var(--tokyo-bg-highlight)] px-4 py-2 text-[var(--tokyo-fg)] transition-colors hover:bg-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleGoBackStep}
              disabled={!executionState}
            >
              <SkipBack size={16} />
              Back
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="font-cascadia-code bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)]">
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
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--tokyo-green)]/80 px-4 py-2 text-white transition-colors hover:bg-[var(--tokyo-green)]/10 hover:text-[var(--tokyo-green)] hover:shadow-[var(--tokyo-green)]/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
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
          <TooltipContent className="font-cascadia-code bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)]">
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
        <div className="rounded-lg border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)]/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-[var(--tokyo-fg-dark)]">
                Node:{" "}
                <span className="font-mono text-[var(--tokyo-fg)]">
                  {executionState.currentStep.node.whatIam().name}
                </span>
              </span>

              {executionState.currentStep.lineNumber && (
                <span className="text-[var(--tokyo-fg-dark)]">
                  Position:{" "}
                  <span className="font-mono text-[var(--tokyo-cyan)]">
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
