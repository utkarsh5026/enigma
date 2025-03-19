import { Terminal, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getTokenCategory, getTokenColor, getCategoryIcon } from "./tokens";
import { Token } from "@/lang/token/token";
import React, { useState } from "react";

interface CodeTokensProps {
  lineNumbers: number[];
  tokensByLine: Record<number, Token[]>;
  activeFilter: string | null;
}

/**
 * CodeTokens component displays the tokenization of source code.
 *
 * This component takes in line numbers, a mapping of tokens by line,
 * and an active filter to show only specific token categories. It
 * renders the tokens in a user-friendly format, allowing users to
 * hover over tokens to see additional information such as type,
 * category, position, and literal value.
 *
 * @param {Object} props - The component props.
 * @param {number[]} props.lineNumbers - An array of line numbers
 *        that contain tokens.
 * @param {Record<number, Token[]>} props.tokensByLine - A mapping
 *        of line numbers to arrays of tokens.
 * @param {string | null} props.activeFilter - A filter to show
 *        specific token categories. If null, all tokens are shown.
 *
 * @returns {JSX.Element} The rendered CodeTokens component.
 */
const CodeTokens: React.FC<CodeTokensProps> = ({
  lineNumbers,
  tokensByLine,
  activeFilter,
}: CodeTokensProps) => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);

  return (
    <div className="space-y-3">
      <motion.h3
        className="text-lg font-medium text-tokyo-fg flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Code className="mr-2 text-tokyo-purple" size={18} />
        Source Code Tokenization
      </motion.h3>

      <div className="rounded-lg p-4 border border-tokyo-bg-highlight/30 bg-tokyo-bg-dark/40">
        {lineNumbers.length > 0 ? (
          <div className="space-y-1">
            <AnimatePresence>
              {lineNumbers.map((lineNum) => {
                const lineTokens = [...tokensByLine[lineNum]];
                lineTokens.sort(
                  (a, b) => a.position.column - b.position.column
                );

                return (
                  <pre
                    key={`line-${lineNum}`}
                    className="text-sm whitespace-pre-wrap overflow-x-auto p-2 border-l-2 border-l-tokyo-bg-highlight mb-1 font-family-mono bg-tokyo-bg-dark rounded-r"
                  >
                    <span className="mr-4 select-none text-tokyo-fg-dark w-8 inline-block text-right">
                      {lineNum}
                    </span>

                    <TooltipProvider>
                      {lineTokens.map((token, idx) => {
                        const category = getTokenCategory(token.type);
                        const shouldShow =
                          !activeFilter || activeFilter === category;

                        return (
                          <Tooltip key={`token-${lineNum}-${idx}`}>
                            <TooltipTrigger asChild>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 mx-0.5 shadow-sm",
                                  getTokenColor(token.type),
                                  !shouldShow && "opacity-30 scale-95",
                                  hoveredToken === token &&
                                    "ring-1 ring-white/30",
                                  "cursor-pointer"
                                )}
                                onMouseEnter={() => setHoveredToken(token)}
                                onMouseLeave={() => setHoveredToken(null)}
                              >
                                {token.literal || " "}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              className="p-0 overflow-hidden bg-tokyo-bg-dark border border-tokyo-bg-highlight"
                              side="bottom"
                              sideOffset={5}
                            >
                              <div className="p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-tokyo-fg-dark">
                                    Type:
                                  </div>
                                  <Badge
                                    className={cn(
                                      "font-mono",
                                      getTokenColor(token.type)
                                    )}
                                  >
                                    {token.type}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-tokyo-fg-dark">
                                    Category:
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="font-normal bg-tokyo-bg text-tokyo-fg flex items-center"
                                  >
                                    {getCategoryIcon(category)}
                                    {category}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-tokyo-fg-dark">
                                    Position:
                                  </div>
                                  <span className="font-mono text-tokyo-fg">
                                    Line {token.position.line}, Col{" "}
                                    {token.position.column}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-tokyo-fg-dark">
                                    Literal:
                                  </div>
                                  <code className="px-2 py-1 bg-tokyo-bg-highlight/50 rounded font-mono text-tokyo-fg">
                                    {token.literal || "<empty>"}
                                  </code>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </pre>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-8 text-tokyo-comment italic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Terminal size={40} className="mb-3 opacity-50" />
            <p>No tokens to display. Enter some code in the editor.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeTokens;
