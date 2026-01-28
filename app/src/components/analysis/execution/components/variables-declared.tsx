import type { ExecutionState } from "@/lang/exec/steps/step-info";
import { ChevronRight, Database, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface VariablesDeclaredProps {
  executionState: ExecutionState;
  highlightedVariable: string | null;
  setHighlightedVariable: (variable: string | null) => void;
}

const VariablesDeclared: React.FC<VariablesDeclaredProps> = ({
  executionState,
  highlightedVariable,
  setHighlightedVariable,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const variables = executionState?.currentStep?.envSnapshot.variables || [];
  const newChanges = variables.some((v) => v.isNew);

  if (variables.length === 0) {
    return (
      <div className="py-3 text-center text-xs text-[var(--tokyo-comment)]">
        No variables declared yet
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
            <Database size={12} className="text-[var(--tokyo-purple)]" />
            <span className="font-medium text-[var(--tokyo-fg)]">
              Variables ({variables.length})
            </span>
            {newChanges && (
              <div className="flex items-center gap-1 rounded bg-[var(--tokyo-green)]/20 px-1.5 py-0.5 text-xs text-[var(--tokyo-green)]">
                <Sparkles size={8} />
                <span>New</span>
              </div>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-2">
        {variables.map((variable) => (
          <div
            key={variable.name}
            className={`group relative cursor-pointer rounded border transition-all duration-200 ${
              variable.isNew
                ? "border-[var(--tokyo-green)]/30 bg-[var(--tokyo-green)]/5"
                : "border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)]/20"
            } ${
              highlightedVariable === variable.name
                ? "border-[var(--tokyo-blue)]/50 bg-[var(--tokyo-blue)]/5"
                : ""
            } hover:border-[var(--tokyo-blue)]/30`}
            onMouseEnter={() => setHighlightedVariable(variable.name)}
            onMouseLeave={() => setHighlightedVariable(null)}
          >
            <div className="p-2">
              {/* Header Row */}
              <div className="mb-1 flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-xs font-medium ${
                      variable.isConstant
                        ? "bg-[var(--tokyo-red)]/20 text-[var(--tokyo-red)]"
                        : "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)]"
                    }`}
                  >
                    {variable.isConstant ? "const" : "let"}
                  </span>
                  <span className="truncate font-mono text-sm font-medium text-[var(--tokyo-fg)]">
                    {variable.name}
                  </span>
                  <span className="hidden text-xs text-[var(--tokyo-comment)] sm:inline">
                    {variable.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {variable.isNew && (
                    <span className="rounded bg-[var(--tokyo-green)]/20 px-1.5 py-0.5 text-xs text-[var(--tokyo-green)]">
                      NEW
                    </span>
                  )}
                </div>
              </div>

              {/* Value Row */}
              <div className="mt-1 rounded bg-[var(--tokyo-bg)]/60 p-2">
                <code className="font-mono text-xs leading-relaxed break-all text-[var(--tokyo-cyan)]">
                  {variable.value}
                </code>
              </div>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default VariablesDeclared;
