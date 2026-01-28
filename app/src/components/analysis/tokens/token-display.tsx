import React, { useState } from "react";
import { Token } from "@/lang/token/token";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  RotateCcw,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { getTokenCategory, getCategoryIcon } from "./tokens-info";
import CodeTokens from "./code-tokens";

interface TokenDisplayProps {
  tokens: Token[];
  code: string;
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  tokens,
  code,
  isTokenizing,
  error,
  hasTokens,
  isCodeChanged,
  onTokenize,
  onClearTokens,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const tokensByLine = tokens.reduce<Record<number, Token[]>>((acc, token) => {
    const { line } = token.position;
    if (!acc[line]) {
      acc[line] = [];
    }
    acc[line].push(token);
    return acc;
  }, {});

  const uniqueCategories = [
    ...new Set(tokens.map((token) => getTokenCategory(token.type))),
  ];

  const lineNumbers = Object.keys(tokensByLine)
    .map(Number)
    .sort((a, b) => a - b);

  const handleTokenize = () => {
    onTokenize(code);
  };

  const codeHasContent = code.trim().length > 0;
  const showCodeChanged = codeHasContent && hasTokens && isCodeChanged(code);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-hidden bg-[var(--tokyo-bg)]"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-dark)]/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="rounded-lg bg-[var(--tokyo-cyan)] p-2.5 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Terminal size={18} className="text-white" />
              </motion.div>
              <div>
                <h2 className="font-mono text-lg font-semibold text-[var(--tokyo-fg)]">
                  Token Analyzer
                </h2>
                <p className="text-sm text-[var(--tokyo-comment)]">
                  Lexical analysis and token stream
                </p>
              </div>
            </div>

            {/* Tokenize Controls */}
            <div className="flex items-center gap-2">
              {!hasTokens && !isTokenizing && codeHasContent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleTokenize}
                        disabled={!codeHasContent || isTokenizing}
                        className="flex items-center gap-2 rounded-lg bg-[var(--tokyo-cyan)] px-4 py-2 text-white shadow-lg transition-all hover:bg-[var(--tokyo-cyan)]/90 hover:shadow-[var(--tokyo-cyan)]/20"
                      >
                        {isTokenizing ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Zap size={16} />
                        )}
                        {isTokenizing ? "Tokenizing..." : "Tokenize Code"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Analyze the current code to generate tokens
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )}

              {hasTokens && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Badge className="border border-[var(--tokyo-cyan)]/30 bg-[var(--tokyo-cyan)]/20 px-2 py-1 text-xs text-[var(--tokyo-cyan)]">
                      {tokens.length} tokens
                    </Badge>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleTokenize}
                          disabled={isTokenizing}
                          className="h-9 w-9 transform rounded-md border border-transparent bg-[var(--tokyo-bg)] p-0 text-[var(--tokyo-comment)] shadow-sm transition-all duration-200 ease-in-out hover:border-[var(--tokyo-border)] hover:bg-[var(--tokyo-bg-highlight)] hover:text-[var(--tokyo-cyan)] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-[var(--tokyo-comment)]"
                        >
                          {isTokenizing ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-[var(--tokyo-blue)]"
                            />
                          ) : showCodeChanged ? (
                            <AlertCircle size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-[var(--tokyo-border)] bg-[var(--tokyo-bg-dark)] text-[var(--tokyo-fg)] shadow-lg">
                        <p className="font-cascadia-code text-xs font-medium">
                          {showCodeChanged
                            ? "Code changed - re-tokenize"
                            : "Re-tokenize code"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearTokens}
                          className="h-9 w-9 transform rounded-md border border-transparent bg-[var(--tokyo-bg)] p-0 text-[var(--tokyo-comment)] shadow-sm transition-all duration-200 ease-in-out hover:border-[var(--tokyo-border)] hover:bg-[var(--tokyo-bg-highlight)] hover:text-[var(--tokyo-red)] hover:shadow-md active:scale-95"
                        >
                          <RotateCcw size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-[var(--tokyo-border)] bg-[var(--tokyo-bg-dark)] text-[var(--tokyo-fg)] shadow-lg">
                        <p className="font-cascadia-code text-xs font-medium">
                          Clear tokens
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showCodeChanged && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--tokyo-orange)]/30 bg-[var(--tokyo-orange)]/10 p-2"
              >
                <AlertCircle size={16} className="text-[var(--tokyo-orange)]" />
                <span className="text-sm font-medium text-[var(--tokyo-orange)]">
                  Code changed - click tokenize to update
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 rounded-lg border border-[var(--tokyo-red)]/30 bg-[var(--tokyo-red)]/10 p-3"
              >
                <div className="flex items-center text-sm text-[var(--tokyo-red)]">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="font-medium">Tokenization Error:</span>
                </div>
                <p className="mt-1 text-sm text-[var(--tokyo-red)]/80">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filters - Only show when we have tokens */}
          <AnimatePresence>
            {tokens.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={activeFilter === null ? "default" : "outline"}
                    className="cursor-pointer border border-[var(--tokyo-blue)]/30 bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] transition-colors hover:bg-[var(--tokyo-blue)]/30"
                    onClick={() => setActiveFilter(null)}
                  >
                    All
                  </Badge>
                </motion.div>

                {uniqueCategories.map((category, index) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.1 + index * 0.05,
                      },
                    }}
                  >
                    <Badge
                      variant={
                        activeFilter === category ? "default" : "outline"
                      }
                      className="flex cursor-pointer items-center border border-[var(--tokyo-purple)]/30 bg-[var(--tokyo-purple)]/20 text-[var(--tokyo-purple)] transition-colors hover:bg-[var(--tokyo-purple)]/30"
                      onClick={() =>
                        setActiveFilter(
                          category === activeFilter ? null : category
                        )
                      }
                    >
                      {getCategoryIcon(category)}
                      {category}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="tokens-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CodeTokens
                tokensByLine={tokensByLine}
                activeFilter={activeFilter}
                lineNumbers={lineNumbers}
                isEmpty={!hasTokens && !isTokenizing}
                isTokenizing={isTokenizing}
                code={code}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenDisplay;
