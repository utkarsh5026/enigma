import React, { useState, useEffect } from "react";
import { Terminal, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { consoleStore, type ConsoleEntry } from "@/stores/console-stores";
import { useMobile } from "@/hooks/use-mobile";

const OutputPanel: React.FC = () => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const { isMobile, isPhone } = useMobile();

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
      <div
        className={`shrink-0 bg-[var(--tokyo-bg)] border-b border-[var(--tokyo-comment)]/20 ${
          isPhone ? "px-2 py-1.5" : "px-3 py-2"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 ${isPhone ? "ml-1" : "ml-3"}`}
            >
              <Terminal
                size={isPhone ? 12 : 14}
                className="text-[var(--tokyo-green)]"
              />
              <span
                className={`${
                  isPhone ? "text-xs" : "text-sm"
                } text-[var(--tokyo-fg)]`}
              >
                {isPhone ? "Console" : "Console"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={`${
              isPhone ? "h-7 w-7" : "h-6 w-6"
            } p-0 text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]`}
            title="Clear terminal"
          >
            <X size={isPhone ? 14 : 12} />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 min-h-0 bg-[var(--tokyo-bg-dark)]">
        <ScrollArea className="h-full">
          <div className={`${isPhone ? "p-2 space-y-1" : "p-4 space-y-1"}`}>
            {entries.length === 0 ? (
              <EmptyTerminalState isMobile={isMobile} isPhone={isPhone} />
            ) : (
              <>
                <div
                  className={`text-[var(--tokyo-cyan)] ${
                    isPhone ? "text-xs" : "text-sm"
                  } mb-2 font-bold`}
                >
                  {isPhone
                    ? "Enigma Terminal"
                    : "Enigma Programming Language Terminal"}
                </div>
                {entries.map((entry) => (
                  <TerminalEntry
                    key={entry.id}
                    entry={entry}
                    isPhone={isPhone}
                  />
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
  isPhone?: boolean;
}

const TerminalEntry: React.FC<TerminalEntryProps> = ({
  entry,
  isPhone = false,
}) => {
  const getTerminalPrefix = (type: ConsoleEntry["type"]) => {
    switch (type) {
      case "error":
        return "[ERROR]";
      case "info":
        return "[INFO]";
      case "success":
        return "[SUCCESS]";
      default:
        return "";
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
      case "success":
        return "text-[var(--tokyo-green)]";
      default:
        return "text-[var(--tokyo-fg)]";
    }
  };

  return (
    <div
      className={`flex items-start gap-2 ${
        isPhone ? "text-xs leading-relaxed" : "text-sm leading-relaxed"
      }`}
    >
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

interface EmptyTerminalStateProps {
  isMobile: boolean;
  isPhone: boolean;
}

const EmptyTerminalState: React.FC<EmptyTerminalStateProps> = ({ isPhone }) => (
  <div
    className={`text-[var(--tokyo-comment)] ${isPhone ? "text-xs" : "text-sm"}`}
  >
    <div
      className={`text-[var(--tokyo-cyan)] ${
        isPhone ? "mb-2" : "mb-4"
      } font-bold`}
    >
      {isPhone ? "Enigma Terminal" : "Enigma Programming Language Terminal"}
    </div>
    <div className={`${isPhone ? "mb-1" : "mb-2"} text-[var(--tokyo-fg-dark)]`}>
      {isPhone
        ? "Welcome to Enigma output."
        : "Welcome to Enigma terminal output."}
    </div>
    <div className={`${isPhone ? "mb-1" : "mb-2"} text-[var(--tokyo-fg-dark)]`}>
      {isPhone
        ? "Run code to see output."
        : "Run your Enigma code to see output here."}
    </div>
    <div className={`${isPhone ? "mb-2" : "mb-4"} text-[var(--tokyo-fg-dark)]`}>
      {isPhone ? (
        <>
          Commands: <span className="text-[var(--tokyo-purple)]">print()</span>,{" "}
          <span className="text-[var(--tokyo-purple)]">println()</span>...
        </>
      ) : (
        <>
          Available commands:{" "}
          <span className="text-[var(--tokyo-purple)]">print()</span>,{" "}
          <span className="text-[var(--tokyo-purple)]">println()</span>, and
          more...
        </>
      )}
    </div>
  </div>
);

export default OutputPanel;
