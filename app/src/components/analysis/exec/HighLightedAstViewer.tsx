import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import * as ast from "@/lang/ast/ast";
import { ChevronRight } from "lucide-react";

interface HighlightedAstViewerProps {
  code: string;
  highlightedNodePath?: string | null;
}

/**
 * A simplified AST viewer that highlights the node being executed
 */
const HighlightedAstViewer: React.FC<HighlightedAstViewerProps> = ({
  code,
  highlightedNodePath,
}) => {
  const [program, setProgram] = useState<ast.Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse the code when it changes
  useEffect(() => {
    if (!code || code.trim() === "") {
      setProgram(null);
      setError(null);
      return;
    }

    try {
      const lexer = new Lexer(code);
      const parser = new Parser(lexer);
      const parsedProgram = parser.parseProgram();

      const errors = parser.parserErrors();
      if (errors.length > 0) {
        setError(`Parser errors: ${errors.map((e) => e.message).join(", ")}`);
        return;
      }

      setProgram(parsedProgram);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(`Error parsing code: ${errorMessage}`);
    }
  }, [code]);

  // Check if a node path should be highlighted
  const isHighlighted = (path: string): boolean => {
    if (!highlightedNodePath) return false;
    return path === highlightedNodePath;
  };

  // Recursively render a node in the AST
  const renderNode = (
    node: any,
    path: string,
    depth: number = 0
  ): JSX.Element => {
    const nodeType = node.constructor.name;
    const [expanded, setExpanded] = useState(depth < 2 || isHighlighted(path));
    const hasChildren = hasNodeChildren(node);

    // When highlighted path changes, expand nodes in the path
    useEffect(() => {
      if (isHighlighted(path)) {
        setExpanded(true);
      }
    }, [highlightedNodePath, path]);

    return (
      <div
        key={path}
        className={cn(
          "border-l-2 pl-3 mb-1",
          isHighlighted(path)
            ? "border-[#7dcfff] bg-[#212b3b]"
            : "border-[#30363d]"
        )}
        style={{ marginLeft: depth > 0 ? "12px" : "0" }}
      >
        <div className="flex items-center py-1">
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mr-1 text-gray-500 hover:text-gray-300"
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  expanded ? "rotate-90" : ""
                }`}
              />
            </button>
          ) : (
            <span className="w-4 mr-1"></span>
          )}

          <span
            className={cn(
              "font-medium",
              isHighlighted(path) ? "text-[#7dcfff]" : "text-white"
            )}
          >
            {nodeType}
          </span>

          {renderNodeAttributes(node)}
        </div>

        {expanded && hasChildren && (
          <div>{renderNodeChildren(node, path, depth + 1)}</div>
        )}
      </div>
    );
  };

  // Render the attributes of a node
  const renderNodeAttributes = (node: any): JSX.Element | null => {
    // Show simple attributes for certain node types
    if (node.constructor.name === "Identifier") {
      return <span className="ml-2 text-[#a5d6ff] text-sm">{node.value}</span>;
    }

    if (node.constructor.name === "IntegerLiteral") {
      return <span className="ml-2 text-[#f2cc60] text-sm">{node.value}</span>;
    }

    if (node.constructor.name === "StringLiteral") {
      return (
        <span className="ml-2 text-[#e0af68] text-sm">"{node.value}"</span>
      );
    }

    if (node.constructor.name === "BooleanExpression") {
      return (
        <span className="ml-2 text-[#f7768e] text-sm">
          {node.value.toString()}
        </span>
      );
    }

    return null;
  };

  // Check if a node has children to render
  const hasNodeChildren = (node: any): boolean => {
    for (const key in node) {
      // Skip non-AST properties
      if (
        key === "token" ||
        key === "constructor" ||
        typeof node[key] === "function"
      ) {
        continue;
      }

      // Check for arrays of AST nodes
      if (Array.isArray(node[key]) && node[key].length > 0) {
        const firstItem = node[key][0];
        if (
          firstItem &&
          typeof firstItem === "object" &&
          "tokenLiteral" in firstItem
        ) {
          return true;
        }
      }

      // Check for individual AST nodes
      if (
        node[key] &&
        typeof node[key] === "object" &&
        "tokenLiteral" in node[key]
      ) {
        return true;
      }
    }

    return false;
  };

  // Render the children of a node
  const renderNodeChildren = (
    node: any,
    parentPath: string,
    depth: number
  ): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    for (const key in node) {
      // Skip non-AST properties
      if (
        key === "token" ||
        key === "constructor" ||
        typeof node[key] === "function"
      ) {
        continue;
      }

      // Handle arrays of AST nodes
      if (Array.isArray(node[key])) {
        node[key].forEach((child: any, index: number) => {
          if (child && typeof child === "object" && "tokenLiteral" in child) {
            const childPath = `${parentPath}.${key}[${index}]`;
            elements.push(renderNode(child, childPath, depth));
          }
        });
      }
      // Handle individual AST nodes
      else if (
        node[key] &&
        typeof node[key] === "object" &&
        "tokenLiteral" in node[key]
      ) {
        const childPath = `${parentPath}.${key}`;
        elements.push(renderNode(node[key], childPath, depth));
      }
    }

    return elements;
  };

  if (error) {
    return (
      <div className="text-[#f7768e] text-sm p-3 bg-[#331c1f] rounded-md">
        {error}
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-[#8b949e] text-sm p-3">No code to display AST.</div>
    );
  }

  return (
    <div className="text-sm p-3 bg-[#0d1117] rounded-md overflow-auto max-h-64">
      {renderNode(program, "program", 0)}
    </div>
  );
};

export default HighlightedAstViewer;
