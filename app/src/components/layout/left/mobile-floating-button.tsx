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
      className="absolute right-4 bottom-4 z-10"
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
        <div className="absolute inset-0 animate-pulse rounded-full bg-tokyo-green opacity-50 blur-lg" />

        <Button
          onClick={handleRunCode}
          disabled={isExecuting || !canRunCode}
          className={`hover:shadow-3xl relative flex h-16 w-16 items-center justify-center rounded-full border-0 bg-tokyo-green text-white shadow-2xl transition-all duration-300 hover:bg-tokyo-green/90 disabled:cursor-not-allowed disabled:opacity-50 ${isExecuting ? "animate-pulse" : ""} ${!canRunCode ? "opacity-30" : ""} `}
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
            <Check size={24} className="animate-in duration-200 zoom-in-50" />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default MobileFloatingRunButton;
