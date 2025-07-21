import React from "react";
import { FileCode, Play, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EditorHeaderProps {
  code: string;
  isExecuting: boolean;
  executionSuccess: boolean;
  handleRunCode: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  code,
  isExecuting,
  executionSuccess,
  handleRunCode,
}) => {
  return (
    <motion.div
      className="shrink-0 border-b border-[var(--tokyo-comment)]/20 bg-gradient-to-r from-[var(--tokyo-bg)] to-[var(--tokyo-bg-dark)]/90 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* File Info */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-gradient-to-br from-[var(--tokyo-purple)]/20 to-[var(--tokyo-blue)]/20 border border-[var(--tokyo-purple)]/30"
          >
            <FileCode size={16} className="text-[var(--tokyo-purple)]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-[var(--tokyo-fg)]">
                main.enigma
              </span>
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleRunCode}
            disabled={isExecuting || !code.trim()}
            className={`
                  px-6 py-2 rounded-xl font-medium text-sm
                  transition-all duration-300 ease-in-out
                  cursor-pointer
                  flex items-center gap-2
                  shadow-lg hover:shadow-xl
                  border-0
                  ${
                    executionSuccess
                      ? "bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan text-white"
                      : "bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan hover:from-tokyo-green/90 hover:to-tokyo-cyan/90 text-white"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:shadow-lg
                  ${isExecuting ? "animate-pulse" : ""}
                `}
            title={
              !code.trim()
                ? "Enter some code to run"
                : isExecuting
                ? "Executing..."
                : "Run your code"
            }
          >
            {isExecuting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : executionSuccess ? (
              <>
                <Check
                  size={16}
                  className="animate-in zoom-in-50 duration-200"
                />
                <span>Success!</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Run Code</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditorHeader;
