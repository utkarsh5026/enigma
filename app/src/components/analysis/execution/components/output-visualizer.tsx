import { useRef, useEffect } from "react";
import { ExecutionState } from "@/lang/exec/stepwise";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Zap,
  Terminal,
  ArrowRight,
  Clock,
  Activity,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OutputVisualizerProps {
  outputs: ExecutionState["output"];
}

const OutputVisualizer: React.FC<OutputVisualizerProps> = ({ outputs }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const getOutputInfo = (type: string) => {
    switch (type) {
      case "error":
        return {
          icon: <AlertCircle size={16} className="text-[var(--tokyo-red)]" />,
          label: "Error",
          description: "An error occurred during execution",
          color: "text-[var(--tokyo-red)]",
          bgColor: "bg-[var(--tokyo-red)]/10",
          borderColor: "border-l-[var(--tokyo-red)]",
        };
      case "return":
        return {
          icon: <CheckCircle size={16} className="text-[var(--tokyo-blue)]" />,
          label: "Return Value",
          description: "Function returned a value",
          color: "text-[var(--tokyo-blue)]",
          bgColor: "bg-[var(--tokyo-blue)]/10",
          borderColor: "border-l-[var(--tokyo-blue)]",
        };
      case "assignment":
        return {
          icon: <Database size={16} className="text-[var(--tokyo-green)]" />,
          label: "Variable Assignment",
          description: "A variable was assigned a new value",
          color: "text-[var(--tokyo-green)]",
          bgColor: "bg-[var(--tokyo-green)]/10",
          borderColor: "border-l-[var(--tokyo-green)]",
        };
      case "operation":
        return {
          icon: <Zap size={16} className="text-[var(--tokyo-orange)]" />,
          label: "Operation",
          description: "An operation was performed",
          color: "text-[var(--tokyo-orange)]",
          bgColor: "bg-[var(--tokyo-orange)]/10",
          borderColor: "border-l-[var(--tokyo-orange)]",
        };
      default:
        return {
          icon: <Activity size={16} className="text-[var(--tokyo-fg)]" />,
          label: "Execution Step",
          description: "General execution activity",
          color: "text-[var(--tokyo-fg)]",
          bgColor: "bg-[var(--tokyo-bg-highlight)]",
          borderColor: "border-l-[var(--tokyo-comment)]",
        };
    }
  };

  const groupedOutputs = outputs.reduce((acc, output) => {
    const lastGroup = acc[acc.length - 1];
    if (
      lastGroup &&
      lastGroup.type === output.type &&
      lastGroup.outputs.length < 3
    ) {
      lastGroup.outputs.push(output);
    } else {
      acc.push({
        type: output.type,
        outputs: [output],
      });
    }
    return acc;
  }, [] as Array<{ type: string; outputs: typeof outputs }>);

  return (
    <div className="border rounded-lg bg-[var(--tokyo-bg-dark)] shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-[var(--tokyo-bg-highlight)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-[var(--tokyo-green)]" />
            <h3 className="text-lg font-semibold text-[var(--tokyo-fg)]">
              Execution Activity Log
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {outputs.length} events
            </Badge>
            {outputs.length > 0 && (
              <Badge variant="outline" className="text-sm">
                Latest:{" "}
                {new Date(
                  outputs[outputs.length - 1].timestamp
                ).toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--tokyo-comment)] leading-relaxed">
          This log shows all the important events that happen during code
          execution, including variable assignments, function returns, and any
          errors.
        </p>
      </div>

      {/* Output content */}
      <div className="p-6">
        <div
          ref={outputRef}
          className="bg-[var(--tokyo-bg)] rounded-lg p-4 max-h-80 overflow-auto space-y-4"
        >
          {outputs.length > 0 ? (
            <AnimatePresence>
              {groupedOutputs.map((group, groupIdx) => {
                const outputInfo = getOutputInfo(group.type);

                return (
                  <motion.div
                    key={groupIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: groupIdx * 0.05 }}
                    className={cn(
                      "rounded-lg p-4 border-l-4",
                      outputInfo.bgColor,
                      outputInfo.borderColor
                    )}
                  >
                    {/* Group header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {outputInfo.icon}
                        <span
                          className={cn(
                            "text-base font-semibold",
                            outputInfo.color
                          )}
                        >
                          {outputInfo.label}
                        </span>
                        {group.outputs.length > 1 && (
                          <Badge
                            className={cn(
                              "text-sm",
                              outputInfo.color,
                              outputInfo.bgColor
                            )}
                          >
                            {group.outputs.length} occurrences
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[var(--tokyo-comment)]">
                        <Clock size={12} />
                        <span>
                          Step{" "}
                          {group.outputs[group.outputs.length - 1].stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Output entries */}
                    <div className="space-y-3">
                      {group.outputs.map((output, idx) => (
                        <div key={idx} className="space-y-2">
                          {group.outputs.length > 1 && (
                            <div className="flex items-center gap-2 text-sm text-[var(--tokyo-comment)]">
                              <ArrowRight size={12} />
                              <span>Step {output.stepNumber}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  output.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          )}

                          <div className="bg-[var(--tokyo-bg-dark)] rounded-lg p-3 font-mono text-sm">
                            <div
                              className={cn(
                                "break-words leading-relaxed",
                                outputInfo.color
                              )}
                            >
                              {output.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="mt-3 text-sm text-[var(--tokyo-comment)] italic">
                      {outputInfo.description}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="text-center py-16">
              <Play
                size={40}
                className="mx-auto mb-4 text-[var(--tokyo-comment)] opacity-50"
              />
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-[var(--tokyo-comment)]">
                  No Activity Yet
                </h4>
                <p className="text-sm text-[var(--tokyo-comment)] max-w-md mx-auto leading-relaxed">
                  Start executing your code to see a detailed log of what
                  happens at each step. You'll see variable assignments,
                  function calls, return values, and any errors here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputVisualizer;
