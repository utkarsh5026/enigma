import { useState, useEffect } from "react";
import { consoleStore, type ConsoleEntry } from "@/stores/console-stores";

/**
 * React hook for accessing console state
 *
 * This hook provides a convenient way to access console entries
 * and console control functions in React components.
 */
export const useConsole = () => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);

  useEffect(() => {
    // Get initial entries
    setEntries(consoleStore.getEntries());

    // Subscribe to changes
    const unsubscribe = consoleStore.subscribe(setEntries);

    return unsubscribe;
  }, []);

  return {
    entries,
    clear: () => consoleStore.clear(),
    addEntry: (content: string, type: ConsoleEntry["type"] = "print") =>
      consoleStore.addEntry(content, type),
    entryCount: entries.length,
    hasEntries: entries.length > 0,
    latestEntry: entries[entries.length - 1] || null,
  };
};
