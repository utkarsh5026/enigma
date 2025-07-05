import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Eye } from "lucide-react";
import { ExecutionState } from "@/lang/exec/stepwise/stepwise";

interface StepInformationDisplayProps {
  executionState: ExecutionState | null;
}

const StepInformationDisplay: React.FC<StepInformationDisplayProps> = ({
  executionState,
}) => {
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
            <Clock size={14} className="text-[#7aa2f7] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium mb-1">What's happening:</div>
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

export default StepInformationDisplay;
