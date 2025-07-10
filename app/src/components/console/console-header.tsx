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
    <div className="bg-[var(--tokyo-bg)] border-b border-[var(--tokyo-comment)]/10 px-4 py-2.5 flex items-center justify-between min-h-[44px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-[var(--tokyo-green)]" />
          <span className="font-medium text-[var(--tokyo-fg)] text-sm">
            Console
          </span>
        </div>

        {entries.length > 0 && (
          <Badge
            variant="secondary"
            className="bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg-dark)] text-xs border border-[var(--tokyo-comment)]/20"
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
                className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                  filter === type
                    ? "bg-[var(--tokyo-bg-highlight)] text-[var(--tokyo-fg)] border border-[var(--tokyo-comment)]/20"
                    : "text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]/50"
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--tokyo-comment)]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 h-7 pl-7 pr-2 bg-[var(--tokyo-bg-highlight)] border border-[var(--tokyo-comment)]/20 rounded text-xs text-[var(--tokyo-fg)] placeholder-[var(--tokyo-comment)] focus:outline-none focus:border-[var(--tokyo-blue)]/50"
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
