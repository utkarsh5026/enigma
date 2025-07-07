import { motion } from "framer-motion";
import {
  ChevronRight,
  Database,
  Globe,
  Package,
  Info,
  Eye,
} from "lucide-react";
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
  const getScopeInfo = (isBlockScope: boolean, depth: number) => {
    if (depth === 0) {
      return {
        name: "Global Scope",
        description: "Variables accessible throughout the entire program",
        icon: <Globe size={14} className="text-[var(--tokyo-blue)]" />,
        color: "text-[var(--tokyo-blue)]",
      };
    } else if (isBlockScope) {
      return {
        name: "Block Scope",
        description:
          "Variables only accessible within this code block (e.g., inside { })",
        icon: <Package size={14} className="text-[var(--tokyo-purple)]" />,
        color: "text-[var(--tokyo-purple)]",
      };
    } else {
      return {
        name: "Function Scope",
        description:
          "Variables accessible within this function and its nested blocks",
        icon: <Database size={14} className="text-[var(--tokyo-orange)]" />,
        color: "text-[var(--tokyo-orange)]",
      };
    }
  };

  const scopeInfo = getScopeInfo(environment.isBlockScope, depth);
  const newVariables = environment.variables.filter((v) => v.isNew).length;
  const totalVariables = environment.variables.length;

  return (
    <motion.div
      className={cn(
        "rounded-lg overflow-hidden",
        depth > 0
          ? "mt-3 ml-3 border-l-2 border-[var(--tokyo-comment)]/30 pl-4"
          : "border border-[var(--tokyo-bg-highlight)]"
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: depth * 0.05 }}
    >
      <Collapsible defaultOpen={depth === 0}>
        <CollapsibleTrigger className="group flex items-center justify-between w-full px-4 py-3 text-left rounded-md hover:bg-[var(--tokyo-bg-highlight)]/50 transition-colors [&[data-state=open]>div:last-child]:rotate-90">
          <div className="flex items-center gap-3">
            {scopeInfo.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--tokyo-fg)]">
                  {scopeInfo.name}
                </span>
                {depth > 0 && (
                  <span className="text-xs text-[var(--tokyo-comment)] bg-[var(--tokyo-bg-dark)] px-2 py-0.5 rounded">
                    Level {depth}
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--tokyo-comment)] mt-0.5">
                {scopeInfo.description}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {totalVariables > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--tokyo-comment)] font-mono">
                    {totalVariables} var{totalVariables !== 1 ? "s" : ""}
                  </span>
                  {newVariables > 0 && highlightChanges && (
                    <span className="text-xs bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] px-1.5 py-0.5 rounded font-mono">
                      +{newVariables} new
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="transition-transform duration-200 text-[var(--tokyo-comment)]">
            <ChevronRight size={14} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="px-4 pb-3">
            {environment.variables.length > 0 ? (
              <div className="space-y-2">
                {/* Variables header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--tokyo-bg-highlight)]">
                  <Eye size={12} className="text-[var(--tokyo-comment)]" />
                  <span className="text-xs font-medium text-[var(--tokyo-comment)] uppercase tracking-wide">
                    Variables in this scope
                  </span>
                </div>

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
              <div className="bg-[var(--tokyo-bg-dark)] rounded-md p-4 text-center">
                <Database
                  size={20}
                  className="text-[var(--tokyo-comment)] mx-auto mb-2 opacity-50"
                />
                <div className="text-[var(--tokyo-comment)] text-sm font-medium mb-1">
                  No Variables Declared
                </div>
                <div className="text-[var(--tokyo-comment)] text-xs">
                  This scope doesn't contain any variable declarations yet
                </div>
              </div>
            )}

            {environment.parentEnvironment && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={12} className="text-[var(--tokyo-comment)]" />
                  <span className="text-xs text-[var(--tokyo-comment)]">
                    Variables from outer scopes are also accessible here:
                  </span>
                </div>
                <EnvironmentVisualizer
                  environment={environment.parentEnvironment}
                  depth={depth + 1}
                  highlightChanges={highlightChanges}
                />
              </div>
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
  const getVariableTypeInfo = (type: string, isConstant: boolean) => {
    const baseInfo = {
      const: {
        label: "constant",
        description: "Cannot be reassigned after declaration",
        color: "text-[var(--tokyo-red)]",
      },
      let: {
        label: "variable",
        description: "Can be reassigned with new values",
        color: "text-[var(--tokyo-blue)]",
      },
    };

    return baseInfo[isConstant ? "const" : "let"];
  };

  const typeInfo = getVariableTypeInfo(variable.type, variable.isConstant);

  return (
    <motion.div
      className={cn(
        "group relative rounded-md p-3 transition-all duration-200",
        variable.isNew && highlightChanges
          ? "bg-[var(--tokyo-green)]/15 border border-[var(--tokyo-green)]/30 shadow-sm"
          : "bg-[var(--tokyo-bg-dark)] hover:bg-[var(--tokyo-bg-highlight)]/50"
      )}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.2 }}
    >
      {/* Variable header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-full",
              typeInfo.color,
              "bg-current/10"
            )}
          >
            {variable.isConstant ? "const" : "let"}
          </span>
          <span className="text-sm font-medium text-[var(--tokyo-fg)]">
            {variable.name}
          </span>
          <span className="text-xs text-[var(--tokyo-comment)] bg-[var(--tokyo-bg)] px-1.5 py-0.5 rounded">
            {variable.type}
          </span>
        </div>

        {variable.isNew && highlightChanges && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--tokyo-green)] font-medium">
              NEW
            </span>
            <div className="w-2 h-2 rounded-full bg-[var(--tokyo-green)] animate-pulse" />
          </div>
        )}
      </div>

      {/* Variable value */}
      <div className="space-y-2">
        <div className="bg-[var(--tokyo-bg)] rounded p-2">
          <div className="text-xs text-[var(--tokyo-comment)] mb-1">
            Current Value:
          </div>
          <code className="text-sm text-[var(--tokyo-cyan)] font-mono break-all">
            {variable.value}
          </code>
        </div>

        {/* Variable description */}
        <div className="text-xs text-[var(--tokyo-comment)] italic">
          {typeInfo.description}
        </div>
      </div>
    </motion.div>
  );
};

export default EnvironmentVisualizer;
