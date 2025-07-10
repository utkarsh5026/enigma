import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

import { type ConsoleEntry } from "@/stores/console-stores";

interface EmptyConsoleProps {
  entries: ConsoleEntry[];
}

const EmptyConsole: React.FC<EmptyConsoleProps> = ({ entries }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="max-w-sm mx-auto">
        <Terminal
          size={24}
          className="text-[var(--tokyo-comment)] mx-auto mb-3"
        />
        <p className="text-[var(--tokyo-comment)] text-sm mb-1">
          {entries.length === 0
            ? "Console is empty"
            : `No entries match filter`}
        </p>
        <p className="text-[var(--tokyo-comment)]/70 text-xs">
          {entries.length === 0
            ? "Run code with print statements to see output here"
            : "Try adjusting your search or filter criteria"}
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyConsole;
