/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import ParserErrors from "./ParserErrors";
import { X, TreePine, Search, Info, Maximize2, Minimize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AstNode from "./AstNode";

interface ASTDisplayProps {
  code: string;
}

const EnhancedASTDisplay: React.FC<ASTDisplayProps> = ({ code }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );

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

  // Count nodes recursively
  const countNodes = (node: any): number => {
    if (!node || typeof node !== "object") return 0;

    let count = 1;
    for (const key in node) {
      const value = node[key];
      if (Array.isArray(value)) {
        count += value.reduce((sum, item) => sum + countNodes(item), 0);
      } else if (
        typeof value === "object" &&
        value !== null &&
        value.tokenLiteral
      ) {
        count += countNodes(value);
      }
    }
    return count;
  };

  // Search functionality
  const searchNodes = (searchTerm: string) => {
    if (!searchTerm || !ast?.program) {
      setHighlightedNodes(new Set());
      return;
    }

    const matches = new Set<string>();
    const searchInNode = (node: any, path: string) => {
      if (!node || typeof node !== "object") return;

      // Check if node type matches
      if (
        node.constructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        matches.add(path);
      }

      // Check properties
      for (const key in node) {
        const value = node[key];
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          matches.add(path);
        }
      }

      // Recursively search children
      for (const key in node) {
        const value = node[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item?.tokenLiteral) {
              searchInNode(item, `${path}.${key}[${index}]`);
            }
          });
        } else if (
          typeof value === "object" &&
          value !== null &&
          value?.tokenLiteral
        ) {
          searchInNode(value, `${path}.${key}`);
        }
      }
    };

    searchInNode(ast.program, "root");
    setHighlightedNodes(matches);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchNodes(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, ast]);

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-full border border-gray-700">
          <TreePine size={48} className="text-gray-400" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        No AST to Display
      </h3>
      <p className="text-gray-400 max-w-md leading-relaxed">
        Enter some Enigma code in the editor to see its Abstract Syntax Tree
        representation. The AST shows how your code is parsed and structured.
      </p>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 max-w-sm">
        <p className="text-sm text-gray-300 mb-2">Try this example:</p>
        <code className="text-xs text-blue-300 font-mono">let x = 5 + 3;</code>
      </div>
    </motion.div>
  );

  const renderErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
        <div className="relative bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-full border border-red-700">
          <X size={48} className="text-red-400" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">Parse Error</h3>
      <p className="text-gray-400 max-w-md leading-relaxed">
        Failed to parse the code. Check for syntax errors and try again.
      </p>
    </motion.div>
  );

  const nodeCount = ast?.program ? countNodes(ast.program) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full overflow-hidden flex flex-col bg-[#0d1117]"
    >
      {/* Enhanced Header */}
      <div className="shrink-0 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-sm" />
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <TreePine size={20} className="text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Abstract Syntax Tree
                </h2>
                <p className="text-sm text-gray-400">
                  Visual representation of parsed code structure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {ast?.program && (
                <>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {nodeCount} nodes
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="border-gray-600 hover:border-gray-500"
                  >
                    {isExpanded ? (
                      <>
                        <Minimize2 size={16} className="mr-2" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <Maximize2 size={16} className="mr-2" />
                        Expand All
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          {ast?.program && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 focus:border-blue-500"
                />
              </div>

              {highlightedNodes.size > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {highlightedNodes.size} matches
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {!code || code.trim() === "" ? (
          renderEmptyState()
        ) : ast === null ? (
          renderErrorState()
        ) : (
          <div className="p-6">
            {/* Parser Errors */}
            <AnimatePresence>
              {ast.errors && ast.errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <ParserErrors errors={ast.errors} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* AST Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Connection guide */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-600/30 to-transparent" />

              {/* Root node */}
              <AstNode
                node={ast.program}
                depth={0}
                path="root"
                isLast={true}
                // parentExpanded={true}
                // searchTerm={searchTerm}
                // highlightedNodes={highlightedNodes}
                // forceExpanded={isExpanded}
              />
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-white">Legend</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">💜</span>
                  <span className="text-gray-300">Statements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">💙</span>
                  <span className="text-gray-300">Expressions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">💚</span>
                  <span className="text-gray-300">Literals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">💛</span>
                  <span className="text-gray-300">Identifiers</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedASTDisplay;
