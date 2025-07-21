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
      <div className="text-center py-3 text-xs text-[var(--tokyo-comment)]">
        No variables declared yet
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-2 bg-[var(--tokyo-bg-highlight)]/30 hover:bg-[var(--tokyo-bg-highlight)]/50 rounded transition-colors text-sm">
          <div className="flex items-center gap-2">
            <ChevronRight
              size={12}
              className={`transition-transform duration-200 text-[var(--tokyo-comment)] ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <Database size={12} className="text-[var(--tokyo-purple)]" />
            <span className="font-medium text-[var(--tokyo-fg)]">
              Variables ({variables.length})
            </span>
            {newChanges && (
              <div className="flex items-center gap-1 bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] text-xs px-1.5 py-0.5 rounded">
                <Sparkles size={8} />
                <span>New</span>
              </div>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 mt-2">
        {variables.map((variable) => (
          <div
            key={variable.name}
            className={`group relative rounded border transition-all duration-200 cursor-pointer ${
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
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-mono font-medium ${
                      variable.isConstant
                        ? "bg-[var(--tokyo-red)]/20 text-[var(--tokyo-red)]"
                        : "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)]"
                    }`}
                  >
                    {variable.isConstant ? "const" : "let"}
                  </span>
                  <span className="font-mono font-medium text-[var(--tokyo-fg)] text-sm truncate">
                    {variable.name}
                  </span>
                  <span className="text-xs text-[var(--tokyo-comment)] hidden sm:inline">
                    {variable.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {variable.isNew && (
                    <span className="text-xs bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
              </div>

              {/* Value Row */}
              <div className="bg-[var(--tokyo-bg)]/60 rounded p-2 mt-1">
                <code className="text-xs font-mono text-[var(--tokyo-cyan)] break-all leading-relaxed">
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
