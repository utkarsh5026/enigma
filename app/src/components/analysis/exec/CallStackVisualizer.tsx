import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowDown, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExecutionState, CallStackFrame } from "@/lang/exec/stepwise/stepwise";

interface CallStackVisualizerProps {
  callStack: ExecutionState["callStack"];
  currentStep: ExecutionState["currentStep"];
  code: string;
}

/**
 * Enhanced CallStackVisualizer component with improved visual representation
 * and animation of the call stack during execution.
 */
const EnhancedCallStackVisualizer: React.FC<CallStackVisualizerProps> = ({
  callStack,
  currentStep,
  code,
}) => {
  const stackRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the stack when new frames are added
  useEffect(() => {
    if (stackRef.current) {
      stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
  }, [callStack.length]);

  // Function to get the relevant code snippet for a call frame
  const getCodeSnippet = (frame: CallStackFrame): string => {
    if (!code) return "";

    const lines = code.split("\n");
    const lineIndex = frame.startLine - 1;

    if (lineIndex < 0 || lineIndex >= lines.length) return "";

    return lines[lineIndex].trim();
  };

  return (
    <div className="border rounded-md bg-[#161b22] p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#7aa2f7]" />
          <h3 className="text-sm font-medium text-white">
            Function Call Stack
          </h3>
        </div>

        {callStack.length > 0 && (
          <Badge className="bg-[#7aa2f7]/20 text-[#7aa2f7] border-[#7aa2f7]/30">
            {callStack.length} {callStack.length === 1 ? "frame" : "frames"}
          </Badge>
        )}
      </div>

      <div ref={stackRef} className="max-h-48 overflow-auto pr-1 space-y-2">
        {callStack.length > 0 ? (
          <AnimatePresence>
            {callStack
              .slice()
              .reverse()
              .map((frame, idx) => (
                <motion.div
                  key={`${frame.functionName}-${idx}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {/* Call connector line */}
                  {idx > 0 && (
                    <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex items-center">
                      <ArrowDown size={12} className="text-[#565f89]" />
                      <div className="h-px w-8 bg-[#565f89]"></div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-3 py-2 rounded-md text-sm border",
                      idx === 0
                        ? "bg-[#1a1b26] border-[#7aa2f7]/30"
                        : "bg-[#1a1b26]/50 border-[#30363d]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-[#7aa2f7]" />
                        <span className="font-medium">
                          {frame.functionName === "anonymous"
                            ? "<anonymous>"
                            : frame.functionName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        line {frame.startLine}
                      </Badge>
                    </div>

                    {/* Code snippet where the function was called */}
                    <div className="font-mono text-xs bg-[#0d1117] p-2 rounded mb-2 text-[#a9b1d6] overflow-x-auto">
                      {getCodeSnippet(frame)}
                    </div>

                    {/* Arguments passed to the function */}
                    <div className="flex items-center gap-1 text-[#565f89] text-xs">
                      <span>Args:</span>
                      <div className="font-mono text-[#e0af68]">
                        ({frame.args.join(", ")})
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <div className="bg-[#1a1b26] p-3 rounded-full mb-3">
              <Layers size={20} className="text-[#565f89]" />
            </div>
            <p className="text-[#565f89] italic text-sm">
              No active function calls in the stack
            </p>
            <p className="text-[#565f89] text-xs mt-2 max-w-xs">
              When you execute code with function calls, they will appear here
            </p>
          </div>
        )}
      </div>

      {/* Execution context information */}
      {currentStep && (
        <div className="mt-3 pt-3 border-t border-[#30363d]">
          <div className="text-xs text-[#565f89]">
            Current execution depth:{" "}
            <span className="text-[#7aa2f7]">{currentStep.depth}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCallStackVisualizer;
