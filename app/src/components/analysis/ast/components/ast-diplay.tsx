/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TreePine,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractSearchableText } from "../hooks/astUtils";
import EmptyAst from "./empty-ast";
import AstTree from "./ast-tree";
import { ErrorMessage } from "@/lang/parser/parser";
import { Program } from "@/lang/ast";

interface ASTDisplayProps {
  program: Program | null;
  parserErrors: ErrorMessage[];
}

const EnhancedASTDisplay: React.FC<ASTDisplayProps> = ({
  program,
  parserErrors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );
  const [forceRefresh, setForceRefresh] = useState(0);

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
    if (!searchTerm || !program) {
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

    searchInNode(program, "root");
    setHighlightedNodes(matches);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchNodes(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, program]);

  const nodeCount = program ? countNodes(program) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: "var(--tokyo-bg)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 border-b p-4"
        style={{
          borderColor: "var(--tokyo-comment)",
          backgroundColor: "var(--tokyo-bg-dark)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded"
              style={{ backgroundColor: "var(--tokyo-blue)" }}
            >
              <TreePine size={18} className="text-white" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--tokyo-fg)" }}
              >
                AST
              </h2>
              <p className="text-sm" style={{ color: "var(--tokyo-comment)" }}>
                Abstract Syntax Tree
              </p>
            </div>
          </div>

          {program && (
            <div className="flex items-center gap-2">
              <Badge
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: "var(--tokyo-cyan)",
                  color: "var(--tokyo-bg)",
                }}
              >
                {nodeCount} nodes
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setForceRefresh((prev) => prev + 1)}
                className="h-8 w-8 p-0"
                style={{
                  borderColor: "var(--tokyo-comment)",
                  color: "var(--tokyo-fg)",
                  backgroundColor: "transparent",
                }}
                title="Refresh"
              >
                <RefreshCw size={14} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 px-2"
                style={{
                  borderColor: "var(--tokyo-comment)",
                  color: "var(--tokyo-fg)",
                  backgroundColor: "transparent",
                }}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        {program && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--tokyo-comment)" }}
              />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-sm"
                style={{
                  backgroundColor: "var(--tokyo-bg-highlight)",
                  borderColor: "var(--tokyo-comment)",
                  color: "var(--tokyo-fg)",
                }}
              />
            </div>

            {highlightedNodes.size > 0 && (
              <Badge
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: "var(--tokyo-yellow)",
                  color: "var(--tokyo-bg)",
                }}
              >
                {highlightedNodes.size} matches
              </Badge>
            )}

            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-8 px-2 text-xs"
                style={{
                  borderColor: "var(--tokyo-comment)",
                  color: "var(--tokyo-fg)",
                  backgroundColor: "transparent",
                }}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!program ? (
          <EmptyAst />
        ) : (
          <AstTree
            ast={{
              program,
              errors: parserErrors,
            }}
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
