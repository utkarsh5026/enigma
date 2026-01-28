// src/components/analysis/ast/components/ast-diplay.tsx (Updated)

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
  Zap,
  Eye,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractSearchableText } from "../hooks/ast-utils";
import EmptyAst from "./empty-ast";
import AstTree from "./ast-tree";
import { useAst } from "../hooks/use-ast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Node } from "@/lang/ast";

interface ASTDisplayProps {
  code: string;
  onHighlightCode?: (
    line: number,
    column: number,
    endLine?: number,
    endColumn?: number
  ) => void;
}

const ASTDisplay: React.FC<ASTDisplayProps> = ({ code, onHighlightCode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );
  const [activeHighlightedNode, setActiveHighlightedNode] = useState<any>(null);

  const { program, parserErrors, parse, isParsing, hasBeenParsed, canParse } =
    useAst(code);

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

  // Handle node click for code highlighting
  const handleNodeClick = (node: Node) => {
    if (!node || !node.position || !onHighlightCode) return;

    const { start, end } = node.nodeRange();

    // Call the highlighting function passed from parent
    onHighlightCode(start.line, start.column, end.line, end.column);

    // Update the active highlighted node for visual feedback
    setActiveHighlightedNode(node);

    setTimeout(() => {
      setActiveHighlightedNode(null);
    }, 3000);

    console.log("AST Node clicked:", {
      type: node.whatIam?.()?.name || "Unknown",
      position: node.position(),
      value: node.toString?.() || "",
      tokenLiteral: node.tokenLiteral?.() || "",
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchNodes(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, program]);

  const nodeCount = program ? countNodes(program) : 0;
  const hasContent = program || hasBeenParsed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-hidden bg-tokyo-bg"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-(--tokyo-comment)/20 bg-tokyo-bg-dark/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="rounded-lg bg-[var(--tokyo-blue)] p-2.5 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GitBranch size={18} className="text-white" />
              </motion.div>
              <div>
                <h2 className="font-mono text-lg font-semibold text-[var(--tokyo-fg)]">
                  AST Parser
                </h2>
                <p className="text-sm text-[var(--tokyo-comment)]">
                  Abstract Syntax Tree Generator
                </p>
              </div>
            </div>

            {/* Parse Controls */}
            <div className="flex items-center gap-2">
              {!program && !isParsing && canParse && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={parse}
                        disabled={isParsing || !canParse}
                        className="flex items-center gap-2 rounded-lg bg-[var(--tokyo-green)] px-4 py-2 text-white shadow-lg transition-all hover:bg-[var(--tokyo-green)]/90 hover:shadow-[var(--tokyo-green)]/20"
                      >
                        {isParsing ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Zap size={16} />
                        )}
                        {isParsing ? "Parsing..." : "Parse Code"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Parse the current code to generate AST
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )}

              {program && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Badge className="border border-[var(--tokyo-cyan)]/30 bg-[var(--tokyo-cyan)]/20 px-2 py-1 text-xs text-[var(--tokyo-cyan)]">
                      {nodeCount} nodes
                    </Badge>

                    {onHighlightCode && (
                      <Badge className="flex items-center gap-1 border border-[var(--tokyo-blue)]/30 bg-[var(--tokyo-blue)]/20 px-2 py-1 text-xs text-[var(--tokyo-blue)]">
                        <Eye size={10} />
                        Click to highlight
                      </Badge>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={parse}
                          disabled={isParsing}
                          className="disabled:hover:bg h-9 w-9 transform rounded-md border border-transparent bg-[var(--tokyo-bg)] p-0 text-[var(--tokyo-comment)] shadow-sm transition-all duration-200 ease-in-out hover:border-[var(--tokyo-border)] hover:bg-[var(--tokyo-bg-highlight)] hover:text-[var(--tokyo-green)] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-[var(--tokyo-comment)]"
                        >
                          {isParsing ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-[var(--tokyo-blue)]"
                            />
                          ) : (
                            <RefreshCw size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-[var(--tokyo-border)] bg-[var(--tokyo-bg-dark)] text-[var(--tokyo-fg)] shadow-lg">
                        <p className="font-cascadia-code text-xs font-medium">
                          Re-parse code
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="h-8 px-2 text-[var(--tokyo-comment)] transition-all hover:bg-[var(--tokyo-bg-highlight)] hover:text-[var(--tokyo-fg)]"
                        >
                          {isExpanded ? (
                            <Minimize2 size={14} />
                          ) : (
                            <Maximize2 size={14} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {isExpanded ? "Collapse" : "Expand"} view
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Active highlight indicator */}
          <AnimatePresence>
            {activeHighlightedNode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--tokyo-blue)]/30 bg-[var(--tokyo-blue)]/10 p-2"
              >
                <MapPin size={14} className="text-[var(--tokyo-blue)]" />
                <span className="text-sm font-medium text-[var(--tokyo-blue)]">
                  Highlighting:{" "}
                  {activeHighlightedNode.whatIam?.()?.name || "Node"} at line{" "}
                  {activeHighlightedNode.position?.()?.line || "?"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search - Only show when we have a program */}
          <AnimatePresence>
            {program && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-[var(--tokyo-comment)]"
                  />
                  <Input
                    placeholder="Search AST nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 border-[var(--tokyo-comment)]/30 bg-[var(--tokyo-bg-highlight)]/60 pl-9 text-sm text-[var(--tokyo-fg)] transition-colors focus:border-[var(--tokyo-blue)]"
                  />
                </div>

                {highlightedNodes.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Badge className="border border-[var(--tokyo-yellow)]/30 bg-[var(--tokyo-yellow)]/20 px-2 py-1 text-xs text-[var(--tokyo-yellow)]">
                      {highlightedNodes.size} matches
                    </Badge>
                  </motion.div>
                )}

                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="h-8 px-2 text-xs text-[var(--tokyo-comment)] transition-all hover:bg-[var(--tokyo-bg-highlight)] hover:text-[var(--tokyo-fg)]"
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {!hasContent || !program ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyAst
                onParse={parse}
                isParsing={isParsing}
                canParse={canParse}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <AstTree
                program={program}
                parserErrors={parserErrors}
                forceRefresh={0}
                nodeCount={nodeCount}
                highlightedNodes={highlightedNodes}
                onNodeClick={onHighlightCode ? handleNodeClick : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ASTDisplay;
