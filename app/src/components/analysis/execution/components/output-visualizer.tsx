import { useRef, useEffect } from "react";
import { ExecutionState } from "@/lang/exec/stepwise/stepwise";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Zap,
  Terminal,
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

  const getOutputIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle size={12} className="text-[var(--tokyo-red)]" />;
      case "return":
        return <CheckCircle size={12} className="text-[var(--tokyo-blue)]" />;
      case "assignment":
        return <Database size={12} className="text-[var(--tokyo-green)]" />;
      case "operation":
        return <Zap size={12} className="text-[var(--tokyo-yellow)]" />;
      default:
        return <Terminal size={12} className="text-[var(--tokyo-fg)]" />;
    }
  };

  return (
    <div className="border rounded-md bg-[var(--tokyo-bg-dark)] p-3">
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={14} className="text-[var(--tokyo-green)]" />
        <h3 className="text-sm font-medium">Execution Log</h3>
        <Badge variant="outline" className="text-xs">
          {outputs.length} entries
        </Badge>
      </div>

      <div
        ref={outputRef}
        className="font-mono text-xs bg-[var(--tokyo-bg)] rounded-md p-3 max-h-48 overflow-auto space-y-1"
      >
        {outputs.length > 0 ? (
          <AnimatePresence>
            {outputs.map((output, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={cn(
                  "flex items-start gap-2 px-2 py-1 rounded",
                  output.type === "error"
                    ? "bg-[var(--tokyo-red)]/10 text-[var(--tokyo-red)]"
                    : output.type === "return"
                    ? "bg-[var(--tokyo-blue)]/10 text-[var(--tokyo-blue)]"
                    : output.type === "assignment"
                    ? "bg-[var(--tokyo-green)]/10 text-[var(--tokyo-green)]"
                    : output.type === "operation"
                    ? "bg-[var(--tokyo-yellow)]/10 text-[var(--tokyo-yellow)]"
                    : "bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)]"
                )}
              >
                <div className="mt-0.5">{getOutputIcon(output.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs opacity-60 mb-1">
                    <span>Step {output.stepNumber}</span>
                    <span>•</span>
                    <span>
                      {new Date(output.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>{output.value}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-[var(--tokyo-comment)] italic text-center py-8">
            <Terminal size={24} className="mx-auto mb-2 opacity-50" />
            <p>No output yet. Execute some code to see results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputVisualizer;
