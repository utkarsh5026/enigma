import { useState } from "react";
import type { ExecutionState } from "@/lang/exec/steps/step-info";
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
  const outputEntries = executionState.output || [];

  const getOutputIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Database size={10} className="text-[var(--tokyo-green)]" />;
      case "operation":
        return <Zap size={10} className="text-[var(--tokyo-blue)]" />;
      case "error":
        return <AlertCircle size={10} className="text-[var(--tokyo-red)]" />;
      default:
        return <Activity size={10} className="text-[var(--tokyo-fg-dark)]" />;
    }
  };

  if (outputEntries.length === 0) {
    return (
      <div className="py-2 text-center text-xs text-[var(--tokyo-comment)]">
        No execution logs yet
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded bg-[var(--tokyo-bg-highlight)]/30 p-2 text-sm transition-colors hover:bg-[var(--tokyo-bg-highlight)]/50">
          <div className="flex items-center gap-2">
            <ChevronRight
              size={12}
              className={`text-[var(--tokyo-comment)] transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <Terminal size={12} className="text-[var(--tokyo-orange)]" />
            <span className="font-medium text-[var(--tokyo-fg)]">
              Execution Log ({outputEntries.length})
            </span>
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2">
        <ScrollArea className="h-48 w-full rounded border border-[var(--tokyo-comment)]/20">
          <div className="space-y-1 p-2">
            {outputEntries.map((entry, index) => (
              <div
                key={`${entry.stepNumber}-${index}`}
                className="rounded border border-[var(--tokyo-comment)]/10 bg-[var(--tokyo-bg-highlight)]/20 p-2 transition-colors hover:border-[var(--tokyo-comment)]/20"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getOutputIcon(entry.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs leading-relaxed break-words text-[var(--tokyo-fg-dark)]">
                      {parseDescriptionWithBadges(entry.value)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--tokyo-comment)]">
                      <span>Step {entry.stepNumber}</span>
                      <span>•</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OutputVisualizer;
