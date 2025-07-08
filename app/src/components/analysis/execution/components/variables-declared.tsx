import { ExecutionState } from "@/lang/exec/stepwise";
import { ChevronRight } from "lucide-react";
import { Database } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

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
            <Database size={16} />
            <span className="font-medium">
              Variables (
              {executionState?.currentStep?.environment.variables.length})
            </span>
            {executionState?.currentStep?.environment.variables.some(
              (v) => v.isNew
            ) && (
              <span className="bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] text-xs px-2 py-1 rounded animate-in zoom-in-50">
                New Changes
              </span>
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-3 overflow-hidden">
          {executionState?.currentStep?.environment.variables.map(
            (variable, index) => (
              <div
                key={variable.name}
                className={`bg-[var(--tokyo-bg-highlight)]/30 rounded-lg p-4 border transition-all duration-200 ${
                  variable.isNew
                    ? "border-[var(--tokyo-green)]/30 bg-[var(--tokyo-green)]/5"
                    : "border-[var(--tokyo-comment)]/30"
                } ${
                  highlightedVariable === variable.name
                    ? "border-[var(--tokyo-blue)]/50 bg-[var(--tokyo-blue)]/5"
                    : ""
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onMouseEnter={() => setHighlightedVariable(variable.name)}
                onMouseLeave={() => setHighlightedVariable(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-mono ${
                        variable.isConstant
                          ? "bg-[var(--tokyo-red)]/20 text-[var(--tokyo-red)]"
                          : "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)]"
                      }`}
                    >
                      {variable.isConstant ? "const" : "let"}
                    </span>
                    <span className="font-mono font-medium text-[var(--tokyo-fg)]">
                      {variable.name}
                    </span>
                    <span className="text-xs text-[var(--tokyo-comment)]">
                      {variable.type}
                    </span>
                  </div>
                  {variable.isNew && (
                    <span className="text-xs bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] px-2 py-1 rounded animate-in zoom-in-50">
                      NEW
                    </span>
                  )}
                </div>
                <div className="bg-[var(--tokyo-bg)]/50 rounded p-3">
                  <code className="text-[var(--tokyo-fg-dark)] font-mono">
                    {variable.value}
                  </code>
                </div>
              </div>
            )
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default VariablesDeclared;
