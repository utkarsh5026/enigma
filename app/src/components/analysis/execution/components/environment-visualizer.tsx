import { motion } from "framer-motion";
import { ChevronRight, Database } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type EnvironmentSnapshot } from "@/lang/exec/stepwise";

interface EnvironmentVisualizerProps {
  environment: EnvironmentSnapshot;
  depth?: number;
  highlightChanges?: boolean;
}

export const EnvironmentVisualizer: React.FC<EnvironmentVisualizerProps> = ({
  environment,
  depth = 0,
  highlightChanges = false,
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-lg overflow-hidden",
        depth > 0
          ? "mt-3 ml-3 border-l border-[var(--tokyo-comment)]/30 pl-3"
          : ""
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: depth * 0.05 }}
    >
      <Collapsible defaultOpen={depth === 0}>
        <CollapsibleTrigger className="group flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-[var(--tokyo-bg-highlight)]/50 transition-colors [&[data-state=open]>div:last-child]:rotate-90">
          <div className="flex items-center gap-2">
            <Database
              size={14}
              className="text-[var(--tokyo-comment)] group-hover:text-[var(--tokyo-blue)] transition-colors"
            />
            <span className="text-sm font-medium text-[var(--tokyo-fg)]">
              {environment.isBlockScope ? "Block" : "Function"}
            </span>
            {environment.variables.length > 0 && (
              <span className="text-xs text-[var(--tokyo-comment)] font-mono">
                {environment.variables.length}
              </span>
            )}
          </div>
          <div className="transition-transform duration-200 text-[var(--tokyo-comment)]">
            <ChevronRight size={14} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="pt-2 pb-1">
            {environment.variables.length > 0 ? (
              <div className="space-y-1">
                {environment.variables.map((variable, idx) => (
                  <Variable
                    key={`${variable.name}-${idx}`}
                    variable={variable}
                    idx={idx}
                    highlightChanges={highlightChanges}
                  />
                ))}
              </div>
            ) : (
              <div className="text-[var(--tokyo-comment)] text-xs italic px-3 py-2">
                No variables
              </div>
            )}

            {environment.parentEnvironment && (
              <EnvironmentVisualizer
                environment={environment.parentEnvironment}
                depth={depth + 1}
                highlightChanges={highlightChanges}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

interface VariableProps {
  variable: EnvironmentSnapshot["variables"][number];
  idx: number;
  highlightChanges: boolean;
}

const Variable: React.FC<VariableProps> = ({
  variable,
  idx,
  highlightChanges,
}) => {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors group",
        variable.isNew && highlightChanges
          ? "bg-[var(--tokyo-green)]/10 hover:bg-[var(--tokyo-green)]/15"
          : "hover:bg-[var(--tokyo-bg-highlight)]/30"
      )}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.2 }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[var(--tokyo-comment)] text-xs font-mono">
          {variable.isConstant ? "const" : "let"}
        </span>
        <span className="text-[var(--tokyo-fg)] font-medium">
          {variable.name}
        </span>
        <span className="text-[var(--tokyo-comment)] text-xs font-mono">
          {variable.type}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <code className="text-xs bg-[var(--tokyo-bg-dark)] px-2 py-0.5 rounded text-[var(--tokyo-cyan)] font-mono max-w-[120px] truncate">
          {variable.value}
        </code>
        {variable.isNew && highlightChanges && (
          <div className="w-2 h-2 rounded-full bg-[var(--tokyo-green)] animate-pulse" />
        )}
      </div>
    </motion.div>
  );
};

export default EnvironmentVisualizer;
