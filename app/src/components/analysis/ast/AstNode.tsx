import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ASTNodes } from "@/lang/ast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNodeStyle, getNodeCategory } from "./nodeStyles";

interface AstNodeProps {
  node: ASTNodes;
  depth: number;
  path: string;
  isLast?: boolean;
}

const AstNode: React.FC<AstNodeProps> = ({
  node,
  depth,
  path,
  isLast = false,
}) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const nodeType = node.constructor.name;

  const hasChildren = (node: ASTNodes): boolean => {
    if (!node || typeof node !== "object") return false;

    for (const key in node) {
      const value = (node as any)[key];

      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object" &&
        (value[0].tokenLiteral || value[0].toString)
      ) {
        return true;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        (value.tokenLiteral || value.toString) &&
        key !== "token"
      ) {
        return true;
      }
    }

    return false;
  };

  const hasExpandableChildren = hasChildren(node);

  // Format simple properties like numbers, strings, etc.
  const formatSimpleValue = (value: string): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
  };

  // Get the node's properties that aren't objects or are simple enough to display directly
  const getSimpleProperties = () => {
    const simpleProps: Record<string, string> = {};

    for (const key in node) {
      const value = (node as any)[key];

      // Skip functions, internal properties, and complex objects
      if (
        typeof value === "function" ||
        key.startsWith("_") ||
        key === "token" ||
        key === "constructor"
      )
        continue;

      // Handle simple values
      if (
        value === null ||
        typeof value !== "object" ||
        (typeof value === "object" &&
          value !== null &&
          "value" in value &&
          Object.keys(value).length === 1)
      ) {
        // Special case for objects with just a 'value' property
        if (typeof value === "object" && value !== null && "value" in value) {
          simpleProps[key] = formatSimpleValue(value.value);
        } else {
          simpleProps[key] = formatSimpleValue(value);
        }
      }
    }

    return simpleProps;
  };

  // Get the node's properties that are complex objects or arrays of objects
  const getComplexProperties = () => {
    const complexProps: Record<string, any> = {};

    for (const key in node) {
      const value = (node as any)[key];

      // Skip functions, internal properties, and already handled properties
      if (
        typeof value === "function" ||
        key.startsWith("_") ||
        key === "token" ||
        key === "constructor"
      )
        continue;

      // Handle arrays of nodes
      if (Array.isArray(value) && value.length > 0) {
        if (
          typeof value[0] === "object" &&
          value[0] !== null &&
          (value[0].tokenLiteral || value[0].toString)
        ) {
          complexProps[key] = value;
        }
      }
      // Handle object nodes
      else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !(
          typeof value === "object" &&
          "value" in value &&
          Object.keys(value).length === 1
        ) &&
        (value.tokenLiteral || value.toString)
      ) {
        complexProps[key] = value;
      }
    }

    return complexProps;
  };

  const simpleProps = getSimpleProperties();
  const complexProps = getComplexProperties();

  // Get node styling
  const nodeStyle = getNodeStyle(nodeType);

  return (
    <div className={`relative ${depth > 0 ? "ml-6" : ""}`}>
      {/* Tree line connector */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 -ml-6 border-l border-[#30363d]"
          style={{
            height: isLast ? "16px" : "100%",
            left: "-2px",
          }}
        />
      )}

      {depth > 0 && (
        <div className="absolute border-t border-[#30363d] w-[20px] top-[16px] left-[-20px]" />
      )}

      <div className="relative mb-2">
        <Collapsible
          open={expanded}
          onOpenChange={setExpanded}
          className="border border-[#30363d] rounded-md overflow-hidden"
        >
          <CollapsibleTrigger
            className={`w-full p-2 flex items-center justify-between hover:bg-[#161b22] transition-colors text-left cursor-pointer focus:outline-none ${nodeStyle.background}`}
            disabled={!hasExpandableChildren}
          >
            <div className="flex items-center">
              {hasExpandableChildren && (
                <ChevronRight
                  size={14}
                  className={`mr-2 transition-transform duration-200 ${
                    expanded ? "rotate-90" : ""
                  } text-[#8b949e]`}
                />
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`font-medium ${nodeStyle.text}`}>
                    {nodeType}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{getNodeCategory(nodeType)}</TooltipContent>
              </Tooltip>

              {/* Basic properties badge */}
              {Object.keys(simpleProps).length > 0 && (
                <div className="ml-3 flex flex-wrap gap-1">
                  {Object.entries(simpleProps).map(([key, value]) => (
                    <Badge
                      key={`${path}-${key}`}
                      className="text-xs bg-[#1f2937] text-[#9ece6a] border-none"
                    >
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleTrigger>

          {/* Expanded content */}
          {hasExpandableChildren && (
            <CollapsibleContent>
              <div className="p-2 pt-0 border-t border-[#30363d] bg-[#0d1117]">
                {/* Complex properties */}
                {Object.entries(complexProps).map(
                  ([key, value], index, array) => {
                    if (Array.isArray(value)) {
                      return (
                        <div key={`${path}-${key}`} className="mt-2">
                          <div className="text-xs text-[#565f89] mb-1 font-medium">
                            {key}:
                          </div>
                          {value.length === 0 ? (
                            <div className="text-xs italic text-[#565f89] ml-2">
                              Empty array
                            </div>
                          ) : (
                            value.map((item, i) => (
                              <AstNode
                                key={`${path}-${key}-${i}`}
                                node={item}
                                depth={depth + 1}
                                path={`${path}-${key}-${i}`}
                                isLast={
                                  i === value.length - 1 &&
                                  index === array.length - 1
                                }
                              />
                            ))
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div key={`${path}-${key}`} className="mt-2">
                          <div className="text-xs text-[#565f89] mb-1 font-medium">
                            {key}:
                          </div>
                          <AstNode
                            node={value}
                            depth={depth + 1}
                            path={`${path}-${key}`}
                            isLast={index === array.length - 1}
                          />
                        </div>
                      );
                    }
                  }
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    </div>
  );
};

export default AstNode;
