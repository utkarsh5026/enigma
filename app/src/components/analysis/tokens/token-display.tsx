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
      className="w-full h-full overflow-hidden flex flex-col bg-[var(--tokyo-bg)]"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-dark)]/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2.5 rounded-lg bg-gradient-to-br from-[var(--tokyo-cyan)] to-[var(--tokyo-blue)] shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Terminal size={18} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--tokyo-fg)] font-mono">
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
                        className="bg-gradient-to-r from-[var(--tokyo-cyan)] to-[var(--tokyo-blue)] hover:from-[var(--tokyo-cyan)]/90 hover:to-[var(--tokyo-blue)]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-[var(--tokyo-cyan)]/20"
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
                    <Badge className="bg-[var(--tokyo-cyan)]/20 text-[var(--tokyo-cyan)] border border-[var(--tokyo-cyan)]/30 text-xs px-2 py-1">
                      {tokens.length} tokens
                    </Badge>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleTokenize}
                          disabled={isTokenizing}
                          className="h-9 w-9 p-0 rounded-md border border-transparent bg-[var(--tokyo-bg)] text-[var(--tokyo-comment)] 
                                   hover:text-[var(--tokyo-cyan)] hover:bg-[var(--tokyo-bg-highlight)] hover:border-[var(--tokyo-border)]
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-[var(--tokyo-comment)]
                                   transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
                                   active:scale-95 transform"
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
                      <TooltipContent className="bg-[var(--tokyo-bg-dark)] border-[var(--tokyo-border)] text-[var(--tokyo-fg)] shadow-lg">
                        <p className="text-xs font-medium font-cascadia-code">
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
                          className="h-9 w-9 p-0 rounded-md border border-transparent bg-[var(--tokyo-bg)] text-[var(--tokyo-comment)] 
                                   hover:text-[var(--tokyo-red)] hover:bg-[var(--tokyo-bg-highlight)] hover:border-[var(--tokyo-border)]
                                   transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
                                   active:scale-95 transform"
                        >
                          <RotateCcw size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[var(--tokyo-bg-dark)] border-[var(--tokyo-border)] text-[var(--tokyo-fg)] shadow-lg">
                        <p className="text-xs font-medium font-cascadia-code">
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
                className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-[var(--tokyo-orange)]/10 border border-[var(--tokyo-orange)]/30"
              >
                <AlertCircle size={16} className="text-[var(--tokyo-orange)]" />
                <span className="text-sm text-[var(--tokyo-orange)] font-medium">
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
                className="bg-[var(--tokyo-red)]/10 border border-[var(--tokyo-red)]/30 rounded-lg p-3 mb-3"
              >
                <div className="flex items-center text-[var(--tokyo-red)] text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="font-medium">Tokenization Error:</span>
                </div>
                <p className="text-[var(--tokyo-red)]/80 text-sm mt-1">
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
                    className="cursor-pointer bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border border-[var(--tokyo-blue)]/30 hover:bg-[var(--tokyo-blue)]/30 transition-colors"
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
                      className="cursor-pointer flex items-center bg-[var(--tokyo-purple)]/20 text-[var(--tokyo-purple)] border border-[var(--tokyo-purple)]/30 hover:bg-[var(--tokyo-purple)]/30 transition-colors"
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
        <div className="p-4 space-y-4">
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
