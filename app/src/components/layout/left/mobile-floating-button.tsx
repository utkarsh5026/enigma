import { motion } from "framer-motion";
import React from "react";
import { Play, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileFloatingButtonProps {
  canRunCode: boolean;
  isExecuting: boolean;
  executionSuccess: boolean;
  handleRunCode: () => void;
}

const MobileFloatingRunButton: React.FC<MobileFloatingButtonProps> = ({
  canRunCode,
  isExecuting,
  executionSuccess,
  handleRunCode,
}) => {
  return (
    <motion.div
      className="absolute bottom-4 right-4 z-10"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--tokyo-green)] to-[var(--tokyo-cyan)] rounded-full blur-lg opacity-50 animate-pulse" />

        <Button
          onClick={handleRunCode}
          disabled={isExecuting || !canRunCode}
          className={`
                  relative w-16 h-16 rounded-full
                  bg-gradient-to-r from-tokyo-green/10 to-tokyo-cyan
                  hover:from-tokyo-green/90 hover:to-tokyo-cyan/90
                  text-white border-0
                  shadow-2xl hover:shadow-3xl
                  transition-all duration-300
                  flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isExecuting ? "animate-pulse" : ""}
                  ${!canRunCode ? "opacity-30" : ""}
                `}
          title={
            !canRunCode
              ? "Enter some code to run"
              : isExecuting
              ? "Executing..."
              : "Run your code"
          }
        >
          {isExecuting ? (
            <Loader2 size={24} className="animate-spin" />
          ) : executionSuccess ? (
            <Check size={24} className="animate-in zoom-in-50 duration-200" />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default MobileFloatingRunButton;
