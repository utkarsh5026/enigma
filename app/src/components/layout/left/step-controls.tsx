import React from "react";
import { SkipForward, SkipBack, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { ExecutionState } from "@/lang/exec/steps/step-info";

interface StepControlsProps {
  executionState: ExecutionState | null;
  onResetExecution?: () => void;
  onPrepareExecution?: () => void;
  onExecuteStep?: () => void;
  onGoBackStep?: () => void;
  isExecuting?: boolean;
}

const StepControls: React.FC<StepControlsProps> = ({
  executionState,
  onResetExecution,
  onPrepareExecution,
  onExecuteStep,
  onGoBackStep,
  isExecuting,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      className="flex items-center gap-1 overflow-hidden"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={executionState ? onResetExecution : onPrepareExecution}
            disabled={isExecuting}
            size="sm"
            variant="outline"
            className="border-[var(--tokyo-comment)]/30 px-2 py-1.5 text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]"
          >
            {executionState ? <RotateCcw size={12} /> : <Zap size={12} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {executionState ? "Reset" : "Prepare"} execution
          </p>
        </TooltipContent>
      </Tooltip>

      {onGoBackStep && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onGoBackStep}
              disabled={
                !executionState || (executionState.currentStepNumber || 0) <= 0
              }
              size="sm"
              variant="outline"
              className="border-[var(--tokyo-comment)]/30 px-2 py-1.5 text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]"
            >
              <SkipBack size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Go back one step</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onExecuteStep && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onExecuteStep}
              disabled={!executionState || executionState.isComplete}
              size="sm"
              className="bg-[var(--tokyo-green)]/80 px-2 py-1.5 text-white hover:bg-[var(--tokyo-green)]/70"
            >
              <SkipForward size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Execute next step</p>
          </TooltipContent>
        </Tooltip>
      )}
    </motion.div>
  );
};

export default StepControls;
