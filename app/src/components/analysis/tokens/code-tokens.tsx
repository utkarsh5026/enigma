import { Terminal, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Token } from "@/lang/token/token";
import React, { useState } from "react";
import CodeToken from "./code-token";

interface CodeTokensProps {
  lineNumbers: number[];
  tokensByLine: Record<number, Token[]>;
  activeFilter: string | null;
  isEmpty?: boolean;
  isTokenizing?: boolean;
  code?: string;
}

const CodeTokens: React.FC<CodeTokensProps> = ({
  lineNumbers,
  tokensByLine,
  activeFilter,
  isTokenizing = false,
  code = "",
}: CodeTokensProps) => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);

  const hasCode = code.trim().length > 0;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-tokyo-bg-highlight/30 bg-tokyo-bg-dark/40 p-4">
        {isTokenizing ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-tokyo-blue"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-tokyo-blue border-t-transparent" />
            <p className="text-lg font-medium">Tokenizing your code...</p>
            <p className="mt-1 text-sm text-tokyo-fg-dark">
              This may take a moment for complex code
            </p>
          </motion.div>
        ) : lineNumbers.length > 0 ? (
          <div className="space-y-1">
            <AnimatePresence>
              {lineNumbers.map((lineNum) => {
                const lineTokens = [...tokensByLine[lineNum]];
                lineTokens.sort(
                  (a, b) => a.position.column - b.position.column
                );

                return (
                  <CodeToken
                    key={`line-${lineNum}`}
                    lineNum={lineNum}
                    lineTokens={lineTokens}
                    activeFilter={activeFilter}
                    hoveredToken={hoveredToken}
                    setHoveredToken={setHoveredToken}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-tokyo-comment"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {hasCode ? (
              <>
                <Play size={40} className="mb-3 opacity-50" />
                <p className="text-lg font-medium">Ready to tokenize!</p>
                <p className="mt-1 text-sm text-tokyo-fg-dark">
                  Click the "Tokenize Code" button above to analyze your code
                </p>
              </>
            ) : (
              <>
                <Terminal size={40} className="mb-3 opacity-50" />
                <p className="text-lg font-medium">No code to tokenize</p>
                <p className="mt-1 text-sm text-tokyo-fg-dark">
                  Enter some code in the editor, then click tokenize to see the
                  analysis
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeTokens;
