import React, { useMemo } from "react";
import Lexer from "../lang/lexer/lexer";
import { Parser } from "../lang/parser/parser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, FileCode, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ASTDisplayProps {
  code: string;
}

// Define color mapping for different node types
const getNodeColor = (nodeType: string): string => {
  const colorMap: Record<string, string> = {
    Program:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    LetStatement:
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    ConstStatement:
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    ReturnStatement:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    ExpressionStatement:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    BlockStatement:
      "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    WhileStatement:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    ForStatement:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    BreakStatement:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
    ContinueStatement:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
    Identifier:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    IntegerLiteral:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
    StringLiteral:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    BooleanExpression:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
    ArrayLiteral:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    HashLiteral:
      "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    PrefixExpression:
      "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800",
    InfixExpression:
      "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    IfExpression:
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    FunctionLiteral:
      "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    CallExpression:
      "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    IndexExpression:
      "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300 border-lime-200 dark:border-lime-800",
    AssignmentExpression:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  };

  return (
    colorMap[nodeType] ||
    "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  );
};

const ASTDisplay: React.FC<ASTDisplayProps> = ({ code }) => {
  // Parse the code to get the AST
  const ast = useMemo(() => {
    if (!code || code.trim() === "") {
      return null;
    }

    try {
      const lexer = new Lexer(code);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser.parserErrors().length > 0) {
        return { program, errors: parser.parserErrors() };
      }

      return { program, errors: [] };
    } catch (error) {
      console.error("Error parsing code:", error);
      return null;
    }
  }, [code]);

  // Helper function to determine if a node has properties that can be expanded
  const hasChildren = (node: any): boolean => {
    if (!node || typeof node !== "object") return false;

    // Check for arrays that might contain nodes
    for (const key in node) {
      if (
        Array.isArray(node[key]) &&
        node[key].length > 0 &&
        typeof node[key][0] === "object" &&
        (node[key][0].tokenLiteral || node[key][0].toString)
      ) {
        return true;
      }

      // Check for object properties that are nodes
      if (
        typeof node[key] === "object" &&
        node[key] !== null &&
        !Array.isArray(node[key]) &&
        (node[key].tokenLiteral || node[key].toString) &&
        key !== "token" // Skip the token property
      ) {
        return true;
      }
    }

    return false;
  };

  // Component to display a tree node
  const TreeNode: React.FC<{
    node: any;
    label: string;
    depth: number;
    path: string;
    isLast?: boolean;
  }> = ({ node, label, depth, path, isLast = false }) => {
    const [expanded, setExpanded] = React.useState(depth < 2);
    const nodeType = node.constructor.name;
    const hasExpandableChildren = hasChildren(node);

    // Format simple properties like numbers, strings, etc.
    const formatSimpleValue = (value: any): string => {
      if (value === null || value === undefined) return "null";
      if (typeof value === "string") return `"${value}"`;
      return String(value);
    };

    // Get the node's properties that aren't objects or are simple enough to display directly
    const getSimpleProperties = () => {
      const simpleProps: Record<string, string> = {};

      for (const key in node) {
        // Skip functions, internal properties, and complex objects
        if (
          typeof node[key] === "function" ||
          key.startsWith("_") ||
          key === "token" ||
          key === "constructor"
        )
          continue;

        // Handle simple values
        if (
          node[key] === null ||
          typeof node[key] !== "object" ||
          (typeof node[key] === "object" &&
            node[key] !== null &&
            "value" in node[key] &&
            Object.keys(node[key]).length === 1)
        ) {
          // Special case for objects with just a 'value' property
          if (
            typeof node[key] === "object" &&
            node[key] !== null &&
            "value" in node[key]
          ) {
            simpleProps[key] = formatSimpleValue(node[key].value);
          } else {
            simpleProps[key] = formatSimpleValue(node[key]);
          }
        }
      }

      return simpleProps;
    };

    // Get the node's properties that are complex objects or arrays of objects
    const getComplexProperties = () => {
      const complexProps: Record<string, any> = {};

      for (const key in node) {
        // Skip functions, internal properties, and already handled properties
        if (
          typeof node[key] === "function" ||
          key.startsWith("_") ||
          key === "token" ||
          key === "constructor"
        )
          continue;

        // Handle arrays of nodes
        if (Array.isArray(node[key]) && node[key].length > 0) {
          if (
            typeof node[key][0] === "object" &&
            node[key][0] !== null &&
            (node[key][0].tokenLiteral || node[key][0].toString)
          ) {
            complexProps[key] = node[key];
          }
        }
        // Handle object nodes
        else if (
          typeof node[key] === "object" &&
          node[key] !== null &&
          !Array.isArray(node[key]) &&
          !(
            typeof node[key] === "object" &&
            "value" in node[key] &&
            Object.keys(node[key]).length === 1
          ) &&
          (node[key].tokenLiteral || node[key].toString)
        ) {
          complexProps[key] = node[key];
        }
      }

      return complexProps;
    };

    const simpleProps = getSimpleProperties();
    const complexProps = getComplexProperties();

    return (
      <div className={`relative ${depth > 0 ? "ml-6" : ""}`}>
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

        {/* Horizontal connector line */}
        {depth > 0 && (
          <div
            className="absolute border-t-2 border-dashed border-gray-300 dark:border-gray-700"
            style={{
              width: "20px",
              left: "-20px",
              top: "14px",
            }}
          />
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
                              <TreeNode
                                key={`${path}-${key}-${i}`}
                                node={item}
                                label={`${i}`}
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
                          <TreeNode
                            node={value}
                            label={key}
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

  // Display parser errors if any
  const ParserErrors: React.FC<{
    errors: { message: string; line: number; column: number }[];
  }> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
        <div className="flex items-center mb-2">
          <X size={16} className="text-red-600 dark:text-red-400 mr-2" />
          <h3 className="text-red-700 dark:text-red-300 font-medium">
            Parser Errors ({errors.length})
          </h3>
        </div>
        <ul className="space-y-1 text-sm">
          {errors.map((error, index) => (
            <li key={index} className="text-red-600 dark:text-red-400">
              <span className="font-mono bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded mr-2">
                Ln {error.line}, Col {error.column}
              </span>
              {error.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">AST Analysis</CardTitle>
        <CardDescription>
          Abstract Syntax Tree representation of your code
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!code || code.trim() === "" ? (
          <div className="flex flex-col items-center justify-center p-10 text-gray-500 dark:text-gray-400">
            <FileCode
              size={40}
              className="mb-3 text-gray-400 dark:text-gray-600"
            />
            <p className="text-center">
              Enter some code in the editor to see its AST representation.
            </p>
          </div>
        ) : ast === null ? (
          <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-950 rounded-md text-red-600 dark:text-red-400">
            <X size={40} className="mb-3" />
            <p className="text-center">
              Failed to parse the code. There may be syntax errors.
            </p>
          </div>
        ) : (
          <>
            {ast.errors && ast.errors.length > 0 && (
              <ParserErrors errors={ast.errors} />
            )}
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
              <TreeNode
                node={ast.program}
                label="Program"
                depth={0}
                path="root"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ASTDisplay;
