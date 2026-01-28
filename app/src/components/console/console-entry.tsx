import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle, Info, Zap } from "lucide-react";
import { type ConsoleEntry } from "@/stores/console-stores";

interface ConsoleEntryProps {
  entry: ConsoleEntry;
  index: number;
}

const ConsoleEntry: React.FC<ConsoleEntryProps> = ({ entry, index }) => {
  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{
        duration: 0.2,
        delay: index * 0.01,
      }}
      className={`group flex items-start gap-3 rounded p-2.5 transition-all duration-200 hover:bg-[var(--tokyo-bg-highlight)]/50 ${getEntryStyle(
        entry.type
      )}`}
    >
      <div className="mt-0.5 flex-shrink-0">{getEntryIcon(entry.type)}</div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--tokyo-comment)]">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
          <span className="text-xs tracking-wide text-[var(--tokyo-comment)]/70 uppercase">
            {entry.type}
          </span>
        </div>
        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {entry.content}
        </div>
      </div>

      {/* Minimal entry actions */}
      <div className="flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigator.clipboard.writeText(entry.content)}
          className="h-6 w-6 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)]"
          title="Copy this entry"
        >
          <Copy size={10} />
        </Button>
      </div>
    </motion.div>
  );
};

const getEntryStyle = (type: ConsoleEntry["type"]) => {
  switch (type) {
    case "error":
      return "text-[var(--tokyo-red)] bg-[var(--tokyo-red)]/5 border-l-2 border-[var(--tokyo-red)]/20";
    case "info":
      return "text-[var(--tokyo-blue)] bg-[var(--tokyo-blue)]/5 border-l-2 border-[var(--tokyo-blue)]/20";
    default:
      return "text-[var(--tokyo-fg)] bg-[var(--tokyo-bg-highlight)]/30 border-l-2 border-[var(--tokyo-comment)]/20";
  }
};

const getEntryIcon = (type: ConsoleEntry["type"]) => {
  switch (type) {
    case "error":
      return (
        <AlertCircle size={12} className="mt-0.5 text-[var(--tokyo-red)]" />
      );
    case "info":
      return <Info size={12} className="mt-0.5 text-[var(--tokyo-blue)]" />;
    default:
      return <Zap size={12} className="mt-0.5 text-[var(--tokyo-comment)]" />;
  }
};

export default ConsoleEntry;
