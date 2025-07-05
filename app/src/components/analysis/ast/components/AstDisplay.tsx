/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  TreePine,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractSearchableText } from "../../../utils/astUtils";
import { useAst } from "../hooks/use-ast";
import EmptyAst from "./empty-ast";
import AstTree from "./ast-tree";

interface ASTDisplayProps {
  code: string;
}

const EnhancedASTDisplay: React.FC<ASTDisplayProps> = ({ code }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );
  const [forceRefresh, setForceRefresh] = useState(0);

  const { ast } = useAst(code);

  // Count nodes recursively with better detection
  const countNodes = (node: any): number => {
    if (!node || typeof node !== "object") return 0;

    let count = 1;
    for (const key in node) {
      if (
        key === "token" ||
        key === "constructor" ||
        typeof node[key] === "function"
      ) {
        continue;
      }

      const value = node[key];
      if (Array.isArray(value)) {
        count += value.reduce((sum, item) => sum + countNodes(item), 0);
      } else if (
        typeof value === "object" &&
        value !== null &&
        typeof value.tokenLiteral === "function"
      ) {
        count += countNodes(value);
      }
    }
    return count;
  };

  // Enhanced search functionality
  const searchNodes = (searchTerm: string) => {
    if (!searchTerm || !ast?.program) {
      setHighlightedNodes(new Set());
      return;
    }

    const matches = new Set<string>();
    const searchLower = searchTerm.toLowerCase();

    const searchInNode = (node: any, path: string) => {
      if (!node || typeof node !== "object") return;

      // Get searchable text from the node
      const searchableTexts = extractSearchableText(node);
      const nodeMatches = searchableTexts.some((text) =>
        text.toLowerCase().includes(searchLower)
      );

      if (nodeMatches) {
        matches.add(path);
      }

      // Recursively search children
      for (const key in node) {
        if (
          key === "token" ||
          key === "constructor" ||
          typeof node[key] === "function"
        ) {
          continue;
        }

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

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchNodes(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, ast]);

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
                    onClick={() => setForceRefresh((prev) => prev + 1)}
                    className="border-gray-600 hover:border-gray-500"
                    title="Refresh AST"
                  >
                    <RefreshCw size={16} />
                  </Button>

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
                  placeholder="Search nodes by type, value, or content..."
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

              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="border-gray-600 hover:border-gray-500"
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {!code || code.trim() === "" ? (
          <EmptyAst />
        ) : ast === null ? (
          renderErrorState()
        ) : (
          <AstTree
            ast={ast}
            forceRefresh={forceRefresh}
            nodeCount={nodeCount}
            highlightedNodes={highlightedNodes}
          />
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedASTDisplay;
