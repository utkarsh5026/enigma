import { motion } from "framer-motion";
import type { ExecutionState } from "@/lang/exec/steps/step-info";

interface DebugComponentProps {
  executionState: ExecutionState;
}
export const DebugComponent: React.FC<DebugComponentProps> = ({
  executionState,
}) => {
  if (executionState.currentStep === null) return null;

  const node = executionState.currentStep.node;
  const { start } = node.nodeRange();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[var(--tokyo-green)]/10 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm border border-[var(--tokyo-green)]/30 max-w-[calc(100%-1rem)] sm:max-w-sm z-10"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold">
            {executionState.currentStep.node?.constructor?.name || "Unknown"}
          </span>
        </div>
        {executionState.currentStep.result && (
          <div className="text-[var(--tokyo-green)]/70 text-xs">
            Result: {executionState.currentStep.result.inspect()}
          </div>
        )}
        {
          <div className="text-[var(--tokyo-green)]/70 text-xs">
            Line {start.line}, Col {start.column}
          </div>
        }
      </div>
    </motion.div>
  );
};
