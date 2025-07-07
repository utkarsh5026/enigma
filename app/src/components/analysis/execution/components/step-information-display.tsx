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
        className="border rounded-lg bg-[var(--tokyo-bg-dark)] p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <PauseCircle
          size={40}
          className="text-[var(--tokyo-comment)] mx-auto mb-4 opacity-60"
        />
        <h3 className="text-base font-semibold text-[var(--tokyo-comment)] mb-2">
          Ready to Execute
        </h3>
        <p className="text-sm text-[var(--tokyo-comment)] leading-relaxed max-w-xs mx-auto">
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
          icon: <Target size={16} className="text-[var(--tokyo-yellow)]" />,
          color: "bg-[var(--tokyo-yellow)]/20 text-[var(--tokyo-yellow)]",
          borderColor: "border-[var(--tokyo-yellow)]",
        };
      case "after":
        return {
          label: "Just Executed",
          description: "Finished executing this code element",
          icon: <CheckCircle size={16} className="text-[var(--tokyo-green)]" />,
          color: "bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)]",
          borderColor: "border-[var(--tokyo-green)]",
        };
      default:
        return {
          label: "Processing",
          description: "Currently processing this step",
          icon: <PlayCircle size={16} className="text-[var(--tokyo-blue)]" />,
          color: "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)]",
          borderColor: "border-[var(--tokyo-blue)]",
        };
    }
  };

  const stepInfo = getStepTypeInfo(step.stepType);

  return (
    <motion.div
      className="border rounded-lg bg-[var(--tokyo-bg-dark)] p-6 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye size={18} className="text-[var(--tokyo-purple)]" />
          <h3 className="text-lg font-semibold text-[var(--tokyo-fg)]">
            Execution Step {progress}
          </h3>
          {isComplete && (
            <Badge className="bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] text-sm">
              Complete
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {stepInfo.icon}
          <Badge className={cn("text-sm", stepInfo.color)}>
            {stepInfo.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current operation explanation */}
        <div
          className={cn(
            "bg-[var(--tokyo-bg)] p-5 rounded-lg border-l-4",
            stepInfo.borderColor
          )}
        >
          <div className="flex items-start gap-4">
            <Code
              size={18}
              className="text-[var(--tokyo-purple)] mt-1 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-base font-semibold text-[var(--tokyo-purple)]">
                  Currently Executing:
                </span>
                <code className="text-sm bg-[var(--tokyo-bg-dark)] px-3 py-1 rounded text-[var(--tokyo-blue)]">
                  {step.node.constructor.name}
                </code>
              </div>
              <p className="text-sm text-[var(--tokyo-fg)] leading-relaxed mb-3">
                {step.description}
              </p>
              <div className="text-sm text-[var(--tokyo-comment)] italic">
                {stepInfo.description}
              </div>
            </div>
          </div>
        </div>

        {/* Execution context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--tokyo-bg)] p-4 rounded-lg border border-[var(--tokyo-bg-highlight)]">
            <div className="flex items-center gap-3 mb-3">
              <MapPin size={16} className="text-[var(--tokyo-orange)]" />
              <span className="text-sm font-semibold text-[var(--tokyo-fg)]">
                Source Location
              </span>
            </div>
            <div className="space-y-2 text-sm text-[var(--tokyo-fg)]">
              <div className="flex justify-between">
                <span>Line:</span>
                <span className="font-mono text-[var(--tokyo-blue)]">
                  {step.lineNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Column:</span>
                <span className="font-mono text-[var(--tokyo-blue)]">
                  {step.columnNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--tokyo-bg)] p-4 rounded-lg border border-[var(--tokyo-bg-highlight)]">
            <div className="flex items-center gap-3 mb-3">
              <Layers size={16} className="text-[var(--tokyo-red)]" />
              <span className="text-sm font-semibold text-[var(--tokyo-fg)]">
                Execution Context
              </span>
            </div>
            <div className="space-y-2 text-sm text-[var(--tokyo-fg)]">
              <div className="flex justify-between">
                <span>Depth:</span>
                <span className="font-mono text-[var(--tokyo-blue)]">
                  {step.depth}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phase:</span>
                <span className="font-mono text-[var(--tokyo-blue)]">
                  {step.executionPhase}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Result display with enhanced formatting */}
        {step.result && (
          <div className="bg-[var(--tokyo-bg)] p-5 rounded-lg border-l-4 border-[var(--tokyo-green)]">
            <div className="flex items-start gap-4">
              <CheckCircle
                size={18}
                className="text-[var(--tokyo-green)] mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base font-semibold text-[var(--tokyo-green)]">
                    Step Result:
                  </span>
                  <Badge className="bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] text-sm">
                    {typeof step.result.inspect()}
                  </Badge>
                </div>
                <code className="block text-sm bg-[var(--tokyo-bg-dark)] px-4 py-3 rounded text-[var(--tokyo-cyan)] font-mono leading-relaxed">
                  {step.result.inspect()}
                </code>
                <div className="mt-3 text-sm text-[var(--tokyo-comment)] italic">
                  This value will be used in subsequent operations
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step guidance */}
        <div className="bg-[var(--tokyo-bg)] p-4 rounded-lg border border-[var(--tokyo-bg-highlight)]">
          <div className="flex items-start gap-3">
            <Info
              size={16}
              className="text-[var(--tokyo-blue)] mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-[var(--tokyo-comment)]">
              <span className="font-semibold text-[var(--tokyo-blue)]">
                Next:{" "}
              </span>
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
