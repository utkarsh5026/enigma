import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
  ArrowDown,
  Check,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConsoleEntry } from "@/stores/console-stores";
import ConsoleActionButton from "./console-action-button";
type FilterType = "all" | "log" | "info" | "error";

interface ConsoleHeaderProps {
  entries: ConsoleEntry[];
  filteredEntries: ConsoleEntry[];
  entryCounts: Record<string, number>;
  filter: string;
  setFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  autoScroll: boolean;
  setAutoScroll: (autoScroll: boolean) => void;
  onToggleSize?: () => void;
  onClose: () => void;
  isMinimized: boolean;
  handleCopy: () => void;
  handleClear: () => void;
  showCopyConfirmation: boolean;
}

const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  entries,
  filteredEntries,
  entryCounts,
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  autoScroll,
  setAutoScroll,
  onToggleSize,
  onClose,
  isMinimized,
  handleCopy,
  handleClear,
  showCopyConfirmation,
}: ConsoleHeaderProps) => {
  return (
    <div className="flex min-h-[44px] items-center justify-between border-b border-[var(--tokyo-comment)]/10 bg-[var(--tokyo-bg)] px-4 py-2.5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-[var(--tokyo-green)]" />
          <span className="text-sm font-medium text-[var(--tokyo-fg)]">
            Console
          </span>
        </div>

        {entries.length > 0 && (
          <Badge
            variant="secondary"
            className="border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)] text-xs text-[var(--tokyo-fg-dark)]"
          >
            {filteredEntries.length}
            {entries.length !== filteredEntries.length &&
              ` / ${entries.length}`}
          </Badge>
        )}

        {!isMinimized && (
          <div className="flex items-center gap-1">
            {(["all", "log", "info", "error"] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded px-2 py-1 text-xs transition-all duration-200 ${
                  filter === type
                    ? "border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)]"
                    : "text-[var(--tokyo-comment)] hover:bg-[var(--tokyo-bg-highlight)]/50 hover:text-[var(--tokyo-fg)]"
                }`}
              >
                {type} {entryCounts[type] > 0 && `(${entryCounts[type]})`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Minimal Search Input */}
        {!isMinimized && (
          <div className="relative">
            <Search
              size={12}
              className="absolute top-1/2 left-2 -translate-y-1/2 transform text-[var(--tokyo-comment)]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 w-32 rounded border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-highlight)] pr-2 pl-7 text-xs text-[var(--tokyo-fg)] placeholder-[var(--tokyo-comment)] focus:border-[var(--tokyo-blue)]/50 focus:outline-none"
            />
          </div>
        )}

        <ConsoleActionButton
          onClick={() => setAutoScroll(!autoScroll)}
          tooltip={`Auto-scroll: ${
            autoScroll ? "On" : "Off"
          } (Ctrl+K to clear)`}
          variant={autoScroll ? "success" : "default"}
        >
          <ArrowDown size={12} />
        </ConsoleActionButton>

        <ConsoleActionButton
          onClick={handleCopy}
          disabled={filteredEntries.length === 0}
          tooltip="Copy all visible output"
        >
          <AnimatePresence mode="wait">
            {showCopyConfirmation ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={12} className="text-[var(--tokyo-green)]" />
              </motion.div>
            ) : (
              <Copy size={12} />
            )}
          </AnimatePresence>
        </ConsoleActionButton>

        <ConsoleActionButton
          onClick={handleClear}
          disabled={entries.length === 0}
          tooltip="Clear console (Ctrl+K)"
          variant="danger"
        >
          <Trash2 size={12} />
        </ConsoleActionButton>

        {onToggleSize && (
          <ConsoleActionButton
            onClick={onToggleSize}
            tooltip={isMinimized ? "Maximize console" : "Minimize console"}
          >
            {isMinimized ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </ConsoleActionButton>
        )}

        <ConsoleActionButton
          onClick={onClose}
          tooltip="Close console"
          variant="danger"
        >
          <X size={12} />
        </ConsoleActionButton>
      </div>
    </div>
  );
};

export default ConsoleHeader;
