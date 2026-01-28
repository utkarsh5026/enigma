import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { consoleStore } from "@/stores/console-stores";
import ConsoleHeader from "./console-header";
import ConsoleEntry from "./console-entry";
import EmptyConsole from "./empty-console";

interface EnigmaConsoleProps {
  isVisible: boolean;
  onClose: () => void;
  onToggleSize?: () => void;
  isMinimized?: boolean;
}

type FilterType = "all" | "log" | "info" | "error";

const EnigmaConsole: React.FC<EnigmaConsoleProps> = ({
  isVisible,
  onClose,
  onToggleSize,
  isMinimized = false,
}) => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = consoleStore.subscribe(setEntries);
    setEntries(consoleStore.getEntries());
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (
      autoScroll &&
      bottomRef.current &&
      isVisible &&
      !isMinimized &&
      isNearBottom
    ) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll, isVisible, isMinimized, isNearBottom]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNear = scrollHeight - scrollTop - clientHeight < 100;
      setIsNearBottom(isNear);
    }
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "all" || entry.type === filter;
    const matchesSearch =
      searchTerm === "" ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const entryCounts = {
    all: entries.length,
    log: entries.filter((e) => e.type === "print" || e.type === "println")
      .length,
    info: entries.filter((e) => e.type === "info").length,
    error: entries.filter((e) => e.type === "error").length,
  };

  const handleClear = () => {
    consoleStore.clear();
  };

  const handleCopy = async () => {
    const text = filteredEntries
      .map(
        (entry) =>
          `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.content}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setShowCopyConfirmation(true);
      setTimeout(() => setShowCopyConfirmation(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        handleClear();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="flex flex-col border-t border-[var(--tokyo-comment)]/20 bg-transparent"
      initial={{ height: 0 }}
      animate={{ height: isMinimized ? 44 : 280 }}
      exit={{ height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <ConsoleHeader
        entries={entries}
        filteredEntries={filteredEntries}
        entryCounts={entryCounts}
        filter={filter}
        setFilter={(filter: string) => setFilter(filter as FilterType)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        onToggleSize={onToggleSize}
        onClose={onClose}
        isMinimized={isMinimized}
        handleCopy={handleCopy}
        handleClear={handleClear}
        showCopyConfirmation={showCopyConfirmation}
      />

      {/* Minimal Console Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex-1 overflow-hidden"
          >
            <ScrollArea
              className="h-full font-mono text-xs"
              onScroll={handleScroll}
              ref={scrollRef}
            >
              <div className="space-y-1 p-4">
                {filteredEntries.length === 0 ? (
                  <EmptyConsole entries={entries} />
                ) : (
                  <AnimatePresence initial={false}>
                    {filteredEntries.map((entry, index) => (
                      <ConsoleEntry key={index} entry={entry} index={index} />
                    ))}
                  </AnimatePresence>
                )}

                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <AnimatePresence>
              {!isNearBottom && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToBottom}
                  className="absolute right-4 bottom-4 rounded border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)] p-2 text-[var(--tokyo-blue)] transition-all duration-200 hover:bg-[var(--tokyo-bg-highlight)]/70"
                  title="Scroll to bottom"
                >
                  <ArrowDown size={12} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnigmaConsole;
