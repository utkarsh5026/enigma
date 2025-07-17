/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getMinimalNodeStyle,
  getNodeIcon,
  getNodeDescription,
} from "../node-info";
import { Node } from "@/lang/ast/ast";
interface MinimalAstNodeProps {
  node: any;
  depth: number;
  path: string;
  isLast?: boolean;
}

const MinimalAstNode: React.FC<MinimalAstNodeProps> = ({
  node,
  depth,
  path,
  isLast = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const nodeType = node.constructor.name;
  const style = getMinimalNodeStyle(nodeType);
  const icon = getNodeIcon(nodeType);
  const description = getNodeDescription(nodeType);

  // Check if node has children
  const hasChildren = (node: any): boolean => {
    if (!node || typeof node !== "object") return false;

    for (const key in node) {
      const value = node[key as keyof Node];
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0]?.tokenLiteral
      ) {
        return true;
      }
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        value?.tokenLiteral &&
        key !== "token"
      ) {
        return true;
      }
    }
    return false;
  };

  const hasExpandableChildren = hasChildren(node);

  // Get simple properties
  const getSimpleProperties = () => {
    const simpleProps: Record<string, string> = {};
    for (const key in node) {
      const value = node[key as keyof Node];
      if (
        typeof value === "function" ||
        key.startsWith("_") ||
        key === "token" ||
        key === "constructor"
      )
        continue;

      if (
        value === null ||
        typeof value !== "object" ||
        (typeof value === "object" &&
          value !== null &&
          "value" in value &&
          Object.keys(value).length === 1)
      ) {
        if (typeof value === "object" && value !== null && "value" in value) {
          simpleProps[key] = String(value.value);
        } else {
          simpleProps[key] = String(value);
        }
      }
    }
    return simpleProps;
  };

  // Get complex properties
  const getComplexProperties = () => {
    const complexProps: Record<string, any> = {};
    for (const key in node) {
      const value = node[key];
      if (
        typeof value === "function" ||
        key.startsWith("_") ||
        key === "token" ||
        key === "constructor"
      )
        continue;

      if (Array.isArray(value) && value.length > 0) {
        if (
          typeof value[0] === "object" &&
          value[0] !== null &&
          value[0]?.tokenLiteral
        ) {
          complexProps[key] = value;
        }
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !(
          typeof value === "object" &&
          "value" in value &&
          Object.keys(value).length === 1
        ) &&
        value?.tokenLiteral
      ) {
        complexProps[key] = value;
      }
    }
    return complexProps;
  };

  const simpleProps = getSimpleProperties();
  const complexProps = getComplexProperties();

  // Get node summary for tooltip
  const getNodeSummary = () => {
    switch (nodeType) {
      case "Identifier":
        return `Variable: ${node.toString() || ""}`;
      case "IntegerLiteral":
        return `Number: ${node.toString() || ""}`;
      case "StringLiteral":
        return `String: "${node.toString() || ""}"`;
      case "InfixExpression":
        return `Operation: ${node.toString() || ""}`;
      case "CallExpression": {
        const funcName = node.func?.toString() || "function";
        return `Call: ${funcName}()`;
      }
      default:
        return nodeType;
    }
  };

  return (
    <div className="relative">
      {/* Connection lines */}
      {depth > 0 && (
        <>
          <div
            className="absolute left-0 -top-2 border-l border-tokyo-comment/50"
            style={{
              height: isLast ? "14px" : "calc(100% + 16px)",
              left: `${(depth - 1) * 24 + 12}px`,
            }}
          />
          <div
            className="absolute top-4 border-t border-tokyo-comment/50"
            style={{
              left: `${(depth - 1) * 24 + 12}px`,
              width: "20px",
            }}
          />
        </>
      )}

      <div
        className={`relative ${depth > 0 ? "ml-6" : ""}`}
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : 0 }}
      >
        <div
          className={`
            relative rounded-md border bg-tokyo-bg/50 backdrop-blur-sm
            ${style.border} ${style.accent}
          `}
        >
          {/* Main content */}
          <div
            className={`
              px-3 py-2 cursor-pointer flex items-center justify-between
              ${hasExpandableChildren ? "hover:bg-tokyo-bg-highlight/30" : ""}
            `}
            onClick={() => hasExpandableChildren && setExpanded(!expanded)}
          >
            <div className="flex items-center gap-2">
              {/* Expand/collapse arrow */}
              {hasExpandableChildren && (
                <ChevronRight
                  size={14}
                  className={`text-tokyo-comment transition-transform duration-200 ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
              )}

              {/* Icon and type */}
              <span className="text-sm" role="img" aria-label={nodeType}>
                {icon}
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`font-medium text-sm ${style.text}`}>
                    {nodeType}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-tokyo-bg-dark font-family-mono p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-xs text-tokyo-fg">
                      {getNodeSummary()}
                    </p>
                    <p className="text-xs text-tokyo-fg">{description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* Simple properties */}
              {Object.keys(simpleProps).length > 0 && (
                <div className="flex gap-1 ml-2">
                  {Object.entries(simpleProps)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <Badge
                        key={key}
                        className="text-xs bg-tokyo-bg-highlight/60 text-tokyo-fg border-tokyo-comment/40 font-mono"
                      >
                        {key}: {value}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            {/* Child count */}
            {hasExpandableChildren && (
              <span className="text-xs text-tokyo-fg-dark">
                {Object.keys(complexProps).reduce((count, key) => {
                  const value = complexProps[key];
                  return count + (Array.isArray(value) ? value.length : 1);
                }, 0)}
              </span>
            )}
          </div>

          {/* Expanded content */}
          {expanded && hasExpandableChildren && (
            <div className="border-t border-tokyo-comment/30 bg-tokyo-bg-dark/30">
              <div className="p-3 space-y-3">
                {Object.entries(complexProps).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="text-xs text-tokyo-comment font-medium uppercase tracking-wide">
                      {key}
                      {Array.isArray(value) && (
                        <span className="ml-2 text-tokyo-fg-dark">
                          ({value.length})
                        </span>
                      )}
                    </div>

                    {Array.isArray(value) ? (
                      <div className="space-y-1">
                        {value.map((item, i) => (
                          <MinimalAstNode
                            key={`${path}-${key}-${i}`}
                            node={item}
                            depth={0}
                            path={`${path}.${key}[${i}]`}
                            isLast={i === value.length - 1}
                          />
                        ))}
                      </div>
                    ) : (
                      <MinimalAstNode
                        node={value}
                        depth={0}
                        path={`${path}.${key}`}
                        isLast={true}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalAstNode;
