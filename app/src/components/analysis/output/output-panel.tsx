import React, { useState, useEffect } from "react";
import { Terminal, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { consoleStore, type ConsoleEntry } from "@/stores/console-stores";

const OutputPanel: React.FC = () => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);

  useEffect(() => {
    const unsubscribe = consoleStore.subscribe(setEntries);
    setEntries(consoleStore.getEntries());
    return unsubscribe;
  }, []);

  const handleClear = () => {
    consoleStore.clear();
  };

  return (
    <div className="h-full flex flex-col bg-[var(--tokyo-bg-dark)] border border-[var(--tokyo-comment)]/20 rounded-md overflow-hidden font-mono">
      {/* Terminal Header */}
      <div className="shrink-0 bg-[var(--tokyo-bg)] border-b border-[var(--tokyo-comment)]/20 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 ml-3">
              <Terminal size={14} className="text-[var(--tokyo-green)]" />
              <span className="text-sm text-[var(--tokyo-fg)]">Console</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]"
            title="Clear terminal"
          >
            <X size={12} />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 min-h-0 bg-[var(--tokyo-bg-dark)]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-1">
            {entries.length === 0 ? (
              <EmptyTerminalState />
            ) : (
              <>
                <div className="text-[var(--tokyo-cyan)] text-sm mb-2 font-bold">
                  Enigma Programming Language Terminal
                </div>
                {entries.map((entry) => (
                  <TerminalEntry key={entry.id} entry={entry} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface TerminalEntryProps {
  entry: ConsoleEntry;
}

const TerminalEntry: React.FC<TerminalEntryProps> = ({ entry }) => {
  const getTerminalPrefix = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "error":
        return "[ERROR]";
      case "info":
        return "[INFO]";
      case "print":
      case "println":
        return ">";
      default:
        return ">";
    }
  };

  const getTerminalColor = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-[var(--tokyo-red)]";
      case "info":
        return "text-[var(--tokyo-blue)]";
      case "print":
      case "println":
        return "text-[var(--tokyo-fg)]";
      default:
        return "text-[var(--tokyo-fg)]";
    }
  };

  return (
    <div className="flex items-start gap-2 text-sm leading-relaxed">
      <span
        className={`${getTerminalColor(entry.type)} font-bold min-w-0 shrink-0`}
      >
        {getTerminalPrefix(entry.type)}
      </span>
      <span
        className={`${getTerminalColor(
          entry.type
        )} whitespace-pre-wrap break-words`}
      >
        {entry.content}
      </span>
    </div>
  );
};

const EmptyTerminalState: React.FC = () => (
  <div className="text-[var(--tokyo-comment)] text-sm">
    <div className="text-[var(--tokyo-cyan)] mb-4 font-bold">
      Enigma Programming Language Terminal
    </div>
    <div className="mb-2 text-[var(--tokyo-fg-dark)]">
      Welcome to Enigma terminal output.
    </div>
    <div className="mb-2 text-[var(--tokyo-fg-dark)]">
      Run your Enigma code to see output here.
    </div>
    <div className="mb-4 text-[var(--tokyo-fg-dark)]">
      Available commands:{" "}
      <span className="text-[var(--tokyo-purple)]">print()</span>,{" "}
      <span className="text-[var(--tokyo-purple)]">println()</span>, and more...
    </div>
  </div>
);

export default OutputPanel;
