import { motion } from "framer-motion";
import type { ExecutionState } from "@/lang/exec/steps/step-info";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Layers, MapPin, Zap } from "lucide-react";
import { useState } from "react";
import { parseDescriptionWithBadges } from "@/components/analysis/execution/components/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DebugComponentProps {
  executionState: ExecutionState;
}

export const DebugComponent: React.FC<DebugComponentProps> = ({
  executionState,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEnvironment, setShowEnvironment] = useState(false);

  if (executionState.currentStep === null) return null;

  const step = executionState.currentStep;
  const node = step.node;
  const { start } = node.nodeRange();
  const { name } = node.whatIam();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-2 right-2 z-10 max-w-[calc(100%-1rem)] sm:top-4 sm:right-4 sm:max-w-md"
    >
      <Card className="border border-[var(--tokyo-green)]/30 bg-[var(--tokyo-bg)]/95 text-white backdrop-blur-sm">
        <div className="space-y-3 p-3">
          {/* Main Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--tokyo-green)]">
                {name}
              </span>
            </div>

            {/* Badges for step type and phase */}
            <div className="flex flex-wrap gap-2">
              {step.depth > 0 && (
                <Badge className="border-[var(--tokyo-purple)]/30 bg-[var(--tokyo-purple)]/20 text-xs text-[var(--tokyo-purple)]">
                  Depth: {step.depth}
                </Badge>
              )}
            </div>

            {/* Position and description */}
            <div className="space-y-1 text-xs text-[var(--tokyo-comment)]">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>
                  Line {start.line}, Col {start.column}
                </span>
              </div>
              {step.description && (
                <div className="flex items-start gap-1">
                  <span className="leading-relaxed">
                    {parseDescriptionWithBadges(step.description)}
                  </span>
                </div>
              )}
            </div>

            {/* Result */}
            {step.result && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.1, 1],
                  opacity: 1,
                  boxShadow: [
                    "0 0 0 rgba(34, 197, 94, 0)",
                    "0 0 20px rgba(34, 197, 94, 0.3)",
                    "0 0 0 rgba(34, 197, 94, 0)",
                  ],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  times: [0, 0.6, 1],
                }}
                className="rounded border border-[var(--tokyo-green)]/20 bg-[var(--tokyo-green)]/10 p-2"
              >
                <div className="mb-1 flex items-center gap-1">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    <Zap size={12} className="text-[var(--tokyo-green)]" />
                  </motion.div>
                  <span className="text-xs font-medium text-[var(--tokyo-green)]">
                    Result
                  </span>
                </div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="font-mono text-xs text-[var(--tokyo-fg)]"
                >
                  {step.result.inspect()}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Collapsible Details */}
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-[var(--tokyo-comment)] transition-colors hover:text-[var(--tokyo-fg)]">
              {showDetails ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              More Details
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {/* Node Path */}
              {step.nodePath && (
                <div className="text-xs">
                  <span className="text-[var(--tokyo-comment)]">Path: </span>
                  <span className="font-mono text-[var(--tokyo-fg)]">
                    {step.nodePath}
                  </span>
                </div>
              )}

              {/* Call Stack */}
              {executionState.callStack.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Layers size={12} className="text-[var(--tokyo-blue)]" />
                    <span className="text-xs font-medium text-[var(--tokyo-blue)]">
                      Call Stack ({executionState.callStack.length})
                    </span>
                  </div>
                  <div className="max-h-20 space-y-1 overflow-y-auto">
                    {executionState.callStack.slice(-3).map((frame, index) => (
                      <div
                        key={index}
                        className="rounded border border-[var(--tokyo-blue)]/20 bg-[var(--tokyo-blue)]/10 p-1 text-xs"
                      >
                        <span className="font-mono text-[var(--tokyo-fg)]">
                          {frame.functionName}({frame.args.join(", ")})
                        </span>
                        {frame.isActive && (
                          <Badge className="ml-1 border-[var(--tokyo-green)]/30 bg-[var(--tokyo-green)]/20 text-xs text-[var(--tokyo-green)]">
                            active
                          </Badge>
                        )}
                      </div>
                    ))}
                    {executionState.callStack.length > 3 && (
                      <div className="text-xs text-[var(--tokyo-comment)]">
                        ... and {executionState.callStack.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {step.envSnapshot && step.envSnapshot.variables.length > 0 && (
            <Collapsible
              open={showEnvironment}
              onOpenChange={setShowEnvironment}
            >
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-[var(--tokyo-comment)] transition-colors hover:text-[var(--tokyo-fg)]">
                {showEnvironment ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                Variables ({step.envSnapshot.variables.length})
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ScrollArea className="h-32 overflow-auto">
                  <div className="flex flex-col gap-1">
                    {step.envSnapshot.variables.map((variable, index) => (
                      <div
                        key={index}
                        className="rounded border border-[var(--tokyo-purple)]/20 bg-[var(--tokyo-purple)]/10 p-1 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[var(--tokyo-fg)]">
                            {variable.name}
                          </span>
                          <span className="text-[var(--tokyo-comment)]">=</span>
                          <span className="flex-1 truncate font-mono text-[var(--tokyo-green)]">
                            {variable.value}
                          </span>
                          {variable.isConstant && (
                            <Badge className="border-[var(--tokyo-orange)]/30 bg-[var(--tokyo-orange)]/20 text-xs text-[var(--tokyo-orange)]">
                              const
                            </Badge>
                          )}
                          {variable.isNew && (
                            <Badge className="border-[var(--tokyo-green)]/30 bg-[var(--tokyo-green)]/20 text-xs text-[var(--tokyo-green)]">
                              new
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--tokyo-comment)]">
                          {variable.type}
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
