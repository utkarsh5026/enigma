// app/src/components/console/integrated-console.tsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { consoleStore, type ConsoleEntry } from "@/stores/console-stores";

interface IntegratedConsoleProps {
  isVisible: boolean;
  onClose: () => void;
  onToggleSize?: () => void;
  isMinimized?: boolean;
}

/**
 * Integrated Console Component - VS Code style console for the bottom panel
 */
const IntegratedConsole: React.FC<IntegratedConsoleProps> = ({
  isVisible,
  onClose,
  onToggleSize,
  isMinimized = false,
}) => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to console store
  useEffect(() => {
    const unsubscribe = consoleStore.subscribe(setEntries);
    setEntries(consoleStore.getEntries());
    return unsubscribe;
  }, []);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && bottomRef.current && isVisible && !isMinimized) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll, isVisible, isMinimized]);

  const handleClear = () => {
    consoleStore.clear();
  };

  const handleCopy = async () => {
    const text = entries
      .map(
        (entry) =>
          `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.content}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const getEntryStyle = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-[var(--tokyo-red)]";
      case "info":
        return "text-[var(--tokyo-blue)]";
      default:
        return "text-[var(--tokyo-fg)]";
    }
  };

  const getEntryIcon = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return ">";
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-[var(--tokyo-bg-dark)] border-t border-[var(--tokyo-comment)]/40 flex flex-col"
      initial={{ height: 0 }}
      animate={{ height: isMinimized ? 40 : 250 }}
      exit={{ height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Console Header */}
      <div className="bg-[var(--tokyo-bg-dark)] border-b border-[var(--tokyo-comment)]/30 px-4 py-2 flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[var(--tokyo-green)]" />
            <span className="font-medium text-[var(--tokyo-fg)] text-sm">
              Console
            </span>
          </div>

          {entries.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] text-xs"
            >
              {entries.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Auto-scroll toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`h-7 w-7 p-0 ${
              autoScroll
                ? "text-[var(--tokyo-green)]"
                : "text-[var(--tokyo-comment)]"
            }`}
            title={`Auto-scroll: ${autoScroll ? "On" : "Off"}`}
          >
            <Settings size={12} />
          </Button>

          {/* Copy button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)]"
            title="Copy all output"
            disabled={entries.length === 0}
          >
            <Copy size={12} />
          </Button>

          {/* Clear button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-red)]"
            title="Clear console"
            disabled={entries.length === 0}
          >
            <Trash2 size={12} />
          </Button>

          {/* Minimize/Maximize toggle */}
          {onToggleSize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSize}
              className="h-7 w-7 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)]"
              title={isMinimized ? "Maximize console" : "Minimize console"}
            >
              {isMinimized ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </Button>
          )}

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-red)]"
            title="Close console"
          >
            <X size={12} />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full font-mono text-xs">
              <div className="p-3 space-y-1">
                {entries.length === 0 ? (
                  <div className="text-[var(--tokyo-comment)] italic text-center py-4 text-xs">
                    Console is empty. Run code with print statements to see
                    output here.
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-2 py-0.5 ${getEntryStyle(
                          entry.type
                        )}`}
                      >
                        <span className="text-[var(--tokyo-comment)] select-none w-3 text-xs">
                          {getEntryIcon(entry.type)}
                        </span>
                        <span className="text-xs text-[var(--tokyo-comment)] select-none min-w-[50px]">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="flex-1 break-words whitespace-pre-wrap">
                          {entry.content}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IntegratedConsole;
