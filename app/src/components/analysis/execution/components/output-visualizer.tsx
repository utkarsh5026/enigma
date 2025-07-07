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
          icon: <AlertCircle size={14} className="text-[var(--tokyo-red)]" />,
          label: "Error",
          description: "An error occurred during execution",
          color: "text-[var(--tokyo-red)]",
          bgColor: "bg-[var(--tokyo-red)]/10",
        };
      case "return":
        return {
          icon: <CheckCircle size={14} className="text-[var(--tokyo-blue)]" />,
          label: "Return Value",
          description: "Function returned a value",
          color: "text-[var(--tokyo-blue)]",
          bgColor: "bg-[var(--tokyo-blue)]/10",
        };
      case "assignment":
        return {
          icon: <Database size={14} className="text-[var(--tokyo-green)]" />,
          label: "Variable Assignment",
          description: "A variable was assigned a new value",
          color: "text-[var(--tokyo-green)]",
          bgColor: "bg-[var(--tokyo-green)]/10",
        };
      case "operation":
        return {
          icon: <Zap size={14} className="text-[var(--tokyo-yellow)]" />,
          label: "Operation",
          description: "An operation was performed",
          color: "text-[var(--tokyo-yellow)]",
          bgColor: "bg-[var(--tokyo-yellow)]/10",
        };
      default:
        return {
          icon: <Activity size={14} className="text-[var(--tokyo-fg)]" />,
          label: "Execution Step",
          description: "General execution activity",
          color: "text-[var(--tokyo-fg)]",
          bgColor: "bg-[var(--tokyo-bg-highlight)]",
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
    <div className="border rounded-md bg-[var(--tokyo-bg-dark)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--tokyo-bg-highlight)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-[var(--tokyo-green)]" />
            <h3 className="text-sm font-medium">Execution Activity Log</h3>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {outputs.length} events
            </Badge>
            {outputs.length > 0 && (
              <Badge variant="outline" className="text-xs">
                Latest:{" "}
                {new Date(
                  outputs[outputs.length - 1].timestamp
                ).toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--tokyo-comment)]">
          This log shows all the important events that happen during code
          execution, including variable assignments, function returns, and any
          errors.
        </p>
      </div>

      {/* Output content */}
      <div className="p-4">
        <div
          ref={outputRef}
          className="bg-[var(--tokyo-bg)] rounded-md p-3 max-h-64 overflow-auto space-y-2"
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
                      "rounded-md p-3 border-l-2",
                      outputInfo.bgColor,
                      group.type === "error"
                        ? "border-l-[var(--tokyo-red)]"
                        : group.type === "return"
                        ? "border-l-[var(--tokyo-blue)]"
                        : group.type === "assignment"
                        ? "border-l-[var(--tokyo-green)]"
                        : group.type === "operation"
                        ? "border-l-[var(--tokyo-yellow)]"
                        : "border-l-[var(--tokyo-comment)]"
                    )}
                  >
                    {/* Group header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {outputInfo.icon}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            outputInfo.color
                          )}
                        >
                          {outputInfo.label}
                        </span>
                        {group.outputs.length > 1 && (
                          <Badge
                            className={cn(
                              "text-xs",
                              outputInfo.color,
                              outputInfo.bgColor
                            )}
                          >
                            {group.outputs.length} occurrences
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-[var(--tokyo-comment)]">
                        <Clock size={10} />
                        <span>
                          Step{" "}
                          {group.outputs[group.outputs.length - 1].stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Output entries */}
                    <div className="space-y-2">
                      {group.outputs.map((output, idx) => (
                        <div key={idx} className="space-y-1">
                          {group.outputs.length > 1 && (
                            <div className="flex items-center gap-2 text-xs text-[var(--tokyo-comment)]">
                              <ArrowRight size={10} />
                              <span>Step {output.stepNumber}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  output.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          )}

                          <div className="bg-[var(--tokyo-bg-dark)] rounded p-2 font-mono text-xs">
                            <div
                              className={cn("break-words", outputInfo.color)}
                            >
                              {output.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="mt-2 text-xs text-[var(--tokyo-comment)] italic">
                      {outputInfo.description}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <Terminal
                size={32}
                className="mx-auto mb-3 text-[var(--tokyo-comment)] opacity-50"
              />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[var(--tokyo-comment)]">
                  No Activity Yet
                </h4>
                <p className="text-xs text-[var(--tokyo-comment)] max-w-xs mx-auto leading-relaxed">
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
