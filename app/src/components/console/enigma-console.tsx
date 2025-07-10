// app/src/components/console/console.tsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Trash2,
  Copy,
  Download,
  ChevronUp,
  ChevronDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { consoleStore, type ConsoleEntry } from "@/stores/console-stores";

interface ConsoleProps {
  className?: string;
  maxHeight?: string;
  isCollapsible?: boolean;
}

/**
 * Console Component - Displays output from print statements
 *
 * This component subscribes to the console store and displays all
 * output from print, println, and error functions in a terminal-like interface.
 */
const Console: React.FC<ConsoleProps> = ({
  className = "",
  maxHeight = "300px",
  isCollapsible = true,
}) => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to console store
  useEffect(() => {
    const unsubscribe = consoleStore.subscribe(setEntries);

    // Get initial entries
    setEntries(consoleStore.getEntries());

    return unsubscribe;
  }, []);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll]);

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
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleDownload = () => {
    const text = entries
      .map(
        (entry) =>
          `[${new Date(
            entry.timestamp
          ).toLocaleTimeString()}] [${entry.type.toUpperCase()}] ${
            entry.content
          }`
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-output-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEntryStyle = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "print":
        return "text-tokyo-fg";
      case "println":
        return "text-tokyo-fg";
      case "error":
        return "text-tokyo-red";
      case "info":
        return "text-tokyo-blue";
      default:
        return "text-tokyo-fg";
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

  return (
    <motion.div
      className={`bg-tokyo-bg border border-tokyo-comment rounded-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Console Header */}
      <div className="bg-tokyo-bg-dark border-b border-tokyo-comment p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-tokyo-green p-1.5 rounded">
              <Terminal size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-tokyo-fg">Console Output</h3>
              <p className="text-xs text-tokyo-comment">
                Output from print statements
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-tokyo-bg-highlight text-tokyo-fg"
            >
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-scroll toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`h-8 w-8 p-0 ${
                autoScroll ? "text-tokyo-green" : "text-tokyo-comment"
              }`}
              title={`Auto-scroll: ${autoScroll ? "On" : "Off"}`}
            >
              <Settings size={14} />
            </Button>

            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 text-tokyo-comment hover:text-tokyo-fg"
              title="Copy all output"
              disabled={entries.length === 0}
            >
              <Copy size={14} />
            </Button>

            {/* Download button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0 text-tokyo-comment hover:text-tokyo-fg"
              title="Download as file"
              disabled={entries.length === 0}
            >
              <Download size={14} />
            </Button>

            {/* Clear button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 text-tokyo-comment hover:text-tokyo-red"
              title="Clear console"
              disabled={entries.length === 0}
            >
              <Trash2 size={14} />
            </Button>

            {/* Collapse toggle */}
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0 text-tokyo-comment hover:text-tokyo-fg"
                title={isCollapsed ? "Expand console" : "Collapse console"}
              >
                {isCollapsed ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Console Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ScrollArea
              className="font-mono text-sm"
              style={{ height: maxHeight }}
              ref={scrollAreaRef}
            >
              <div className="p-4 space-y-1">
                {entries.length === 0 ? (
                  <div className="text-tokyo-comment italic text-center py-8">
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
                        className={`flex items-start gap-2 py-1 ${getEntryStyle(
                          entry.type
                        )}`}
                      >
                        <span className="text-tokyo-comment select-none w-2">
                          {getEntryIcon(entry.type)}
                        </span>
                        <span className="text-xs text-tokyo-comment select-none min-w-[60px]">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="flex-1 break-words whitespace-pre-wrap">
                          {entry.content}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {/* Invisible element for auto-scrolling */}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Console;
