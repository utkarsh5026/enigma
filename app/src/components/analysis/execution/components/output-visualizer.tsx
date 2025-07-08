import { useState } from "react";
import { ExecutionState } from "@/lang/exec/stepwise";
import {
  AlertCircle,
  Database,
  Zap,
  Terminal,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseDescriptionWithBadges } from "./utils";

interface OutputVisualizerProps {
  executionState: ExecutionState;
}

const OutputVisualizer: React.FC<OutputVisualizerProps> = ({
  executionState,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getOutputIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Database size={14} style={{ color: "var(--tokyo-green)" }} />;
      case "operation":
        return <Zap size={14} style={{ color: "var(--tokyo-blue)" }} />;
      case "error":
        return <AlertCircle size={14} style={{ color: "var(--tokyo-red)" }} />;
      default:
        return (
          <Activity
            size={14}
            style={{
              color: "var(--tokyo-fg-dark)",
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] transition-colors w-full">
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <Terminal size={16} />
            <span className="font-medium">
              Execution Log ({executionState.output.length})
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2">
          <ScrollArea className="h-96 w-full rounded-md">
            <div className="space-y-2 p-1">
              {executionState.output.map((entry, index) => (
                <div
                  key={`${entry.stepNumber}-${index}`}
                  className="bg-[var(--tokyo-bg-highlight)]/30 rounded p-3 border border-[var(--tokyo-comment)]/20 animate-in slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getOutputIcon(entry.type)}
                    <div className="flex-1">
                      <div className="text-sm text-[var(--tokyo-fg-dark)] font-mono">
                        {parseDescriptionWithBadges(entry.value)}
                      </div>
                      <div className="text-xs text-[var(--tokyo-comment)] mt-1">
                        Step {entry.stepNumber} •{" "}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default OutputVisualizer;
