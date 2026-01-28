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
      className="py-12 text-center"
    >
      <div className="mx-auto max-w-sm">
        <Terminal
          size={24}
          className="mx-auto mb-3 text-[var(--tokyo-comment)]"
        />
        <p className="mb-1 text-sm text-[var(--tokyo-comment)]">
          {entries.length === 0
            ? "Console is empty"
            : `No entries match filter`}
        </p>
        <p className="text-xs text-[var(--tokyo-comment)]/70">
          {entries.length === 0
            ? "Run code with print statements to see output here"
            : "Try adjusting your search or filter criteria"}
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyConsole;
