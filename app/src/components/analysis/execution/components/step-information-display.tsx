import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Eye,
  Code,
  MapPin,
  Layers,
  PlayCircle,
  PauseCircle,
  Target,
  Info,
} from "lucide-react";
import type { ExecutionState } from "@/lang/exec/stepwise/";

interface StepInformationDisplayProps {
  executionState: ExecutionState | null;
}

const StepInformationDisplay: React.FC<StepInformationDisplayProps> = ({
  executionState,
}) => {
  if (!executionState?.currentStep) {
    return (
      <motion.div
        className="border rounded-md bg-[#161b22] p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <PauseCircle size={32} className="text-[#8b949e] mx-auto mb-2" />
        <h3 className="text-sm font-medium text-[#8b949e] mb-1">
          Ready to Execute
        </h3>
        <p className="text-xs text-[#8b949e]">
          Click "Step Forward" or "Auto Run" to begin stepping through your code
        </p>
      </motion.div>
    );
  }

  const step = executionState.currentStep;
  const progress = executionState.currentStepNumber;
  const isComplete = executionState.isComplete;

  const getStepTypeInfo = (stepType: string) => {
    switch (stepType) {
      case "before":
        return {
          label: "Preparing to Execute",
          description: "About to execute this code element",
          icon: <Target size={14} className="text-[#e0af68]" />,
          color: "bg-[#e0af68]/20 text-[#e0af68]",
        };
      case "after":
        return {
          label: "Just Executed",
          description: "Finished executing this code element",
          icon: <CheckCircle size={14} className="text-[#4d9375]" />,
          color: "bg-[#4d9375]/20 text-[#4d9375]",
        };
      default:
        return {
          label: "Processing",
          description: "Currently processing this step",
          icon: <PlayCircle size={14} className="text-[#7aa2f7]" />,
          color: "bg-[#7aa2f7]/20 text-[#7aa2f7]",
        };
    }
  };

  const stepInfo = getStepTypeInfo(step.stepType);

  return (
    <motion.div
      className="border rounded-md bg-[#161b22] p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#bb9af7]" />
          <h3 className="text-sm font-medium">Execution Step {progress}</h3>
          {isComplete && (
            <Badge className="bg-[#4d9375]/20 text-[#4d9375] text-xs">
              Complete
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {stepInfo.icon}
          <Badge className={cn("text-xs", stepInfo.color)}>
            {stepInfo.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current operation explanation */}
        <div className="bg-[#0d1117] p-4 rounded-md border-l-2 border-l-[#bb9af7]">
          <div className="flex items-start gap-3">
            <Code size={16} className="text-[#bb9af7] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-[#bb9af7]">
                  Currently Executing:
                </span>
                <code className="text-xs bg-[#21262d] px-2 py-1 rounded text-[#7aa2f7]">
                  {step.node.constructor.name}
                </code>
              </div>
              <p className="text-sm text-[#a9b1d6] leading-relaxed">
                {step.description}
              </p>
              <div className="mt-2 text-xs text-[#8b949e] italic">
                {stepInfo.description}
              </div>
            </div>
          </div>
        </div>

        {/* Execution context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#0d1117] p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-[#e0af68]" />
              <span className="text-sm font-medium">Source Location</span>
            </div>
            <div className="space-y-1 text-xs text-[#a9b1d6]">
              <div className="flex justify-between">
                <span>Line:</span>
                <span className="font-mono text-[#7aa2f7]">
                  {step.lineNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Column:</span>
                <span className="font-mono text-[#7aa2f7]">
                  {step.columnNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-[#f7768e]" />
              <span className="text-sm font-medium">Execution Context</span>
            </div>
            <div className="space-y-1 text-xs text-[#a9b1d6]">
              <div className="flex justify-between">
                <span>Depth:</span>
                <span className="font-mono text-[#7aa2f7]">{step.depth}</span>
              </div>
              <div className="flex justify-between">
                <span>Phase:</span>
                <span className="font-mono text-[#7aa2f7]">
                  {step.executionPhase}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Result display with enhanced formatting */}
        {step.result && (
          <div className="bg-[#0d1117] p-4 rounded-md border-l-2 border-l-[#4d9375]">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={16}
                className="text-[#4d9375] mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#4d9375]">
                    Step Result:
                  </span>
                  <Badge className="bg-[#4d9375]/20 text-[#4d9375] text-xs">
                    {typeof step.result.inspect()}
                  </Badge>
                </div>
                <code className="block text-sm bg-[#21262d] px-3 py-2 rounded text-[#7aa2f7] font-mono">
                  {step.result.inspect()}
                </code>
                <div className="mt-2 text-xs text-[#8b949e] italic">
                  This value will be used in subsequent operations
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step guidance */}
        <div className="bg-[#1a1f2e] p-3 rounded-md border border-[#30363d]">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-[#7aa2f7] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#8b949e]">
              <span className="font-medium text-[#7aa2f7]">Next: </span>
              {isComplete
                ? "Execution is complete. You can reset to run again or examine the final state."
                : "Click 'Step Forward' to continue, or 'Auto Run' to execute all remaining steps automatically."}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepInformationDisplay;
