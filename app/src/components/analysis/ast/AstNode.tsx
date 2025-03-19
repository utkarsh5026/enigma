import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ASTNodes } from "@/lang/ast";
import { getNodeColor } from "./nodeColor";

interface AstNodeProps {
  node: ASTNodes;
  depth: number;
  path: string;
  isLast?: boolean;
}

/**
 * AstNode Component
 *
 * This component is responsible for rendering a single node of the Abstract Syntax Tree (AST).
 * It displays the node type, its simple properties, and allows for expandable complex properties.
 *
 * Props:
 * - node (ASTNodes): The AST node to be rendered. This can be a literal, statement, or expression.
 * - depth (number): The depth of the node in the AST hierarchy, used for indentation and styling.
 * - path (string): A unique path identifier for the node, useful for keying child components.
 * - isLast (boolean): Indicates if this node is the last child in its parent, used for styling.
 *
 * State:
 * - expanded (boolean): Tracks whether the node's complex properties are currently expanded or collapsed.
 *
 * Functions:
 * - hasChildren(node: ASTNodes): Determines if the given node has any children that can be expanded.
 * - formatSimpleValue(value: string): Formats simple values (strings, numbers) for display.
 * - getSimpleProperties(): Extracts and formats properties of the node that are simple enough to display directly.
 * - getComplexProperties(): Extracts properties of the node that are complex objects or arrays of objects.
 *
 * Rendering:
 * The component renders a tree-like structure with connectors for visual hierarchy.
 * It displays the node type, simple properties as badges, and expandable sections for complex properties.
 */
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

  return (
    <div className={`relative bg-ctp-surface2 ${depth > 0 ? "ml-6" : ""}`}>
      {/* Tree line connector */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 -ml-6 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
          style={{
            height: isLast ? "14px" : "100%",
            left: "-2px",
          }}
        />
      )}

      {depth > 0 && (
        <div className="absolute border-t-2 border-dashed border-gray-300 dark:border-gray-700 w-[20px] top-[14px] left-[-20px]" />
      )}

      <div className="relative mb-2">
        {/* Node content */}
        <div
          className={cn(
            "p-2 rounded-md border relative",
            getNodeColor(nodeType)
          )}
        >
          <div className="flex items-center">
            {hasExpandableChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {expanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}

            <div className="font-medium">{nodeType}</div>

            {/* Basic properties badge */}
            {Object.keys(simpleProps).length > 0 && (
              <div className="ml-3 flex flex-wrap gap-1">
                {Object.entries(simpleProps).map(([key, value]) => (
                  <Badge
                    variant="outline"
                    key={`${path}-${key}`}
                    className="text-xs"
                  >
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Expanded content */}
          {expanded && hasExpandableChildren && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
              {/* Complex properties */}
              {Object.entries(complexProps).map(
                ([key, value], index, array) => {
                  if (Array.isArray(value)) {
                    return (
                      <div key={`${path}-${key}`} className="mb-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {key}:
                        </div>
                        {value.length === 0 ? (
                          <div className="text-xs italic text-gray-400 dark:text-gray-500">
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
                      <div key={`${path}-${key}`}>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AstNode;
