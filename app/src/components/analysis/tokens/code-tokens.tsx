import { Terminal, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Token } from "@/lang/token/token";
import React, { useState } from "react";
import CodeToken from "./code-token";

interface CodeTokensProps {
  lineNumbers: number[];
  tokensByLine: Record<number, Token[]>;
  activeFilter: string | null;
}

const CodeTokens: React.FC<CodeTokensProps> = ({
  lineNumbers,
  tokensByLine,
  activeFilter,
}: CodeTokensProps) => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-tokyo-fg flex items-center">
        <Code className="mr-2 text-tokyo-purple" size={18} />
        Source Code Tokenization
      </h3>

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
