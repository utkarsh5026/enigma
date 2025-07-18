/**
 * Console Entry represents a single line of output in our console
 */
export interface ConsoleEntry {
  id: string;
  content: string;
  timestamp: number;
  type: "print" | "println" | "error" | "info" | "success";
}

/**
 * Console Store - Manages print output from the language runtime
 *
 * This store captures output from print statements and makes it available
 * to React components for display in a console UI.
 */
class ConsoleStore {
  private entries: ConsoleEntry[] = [];
  private listeners: Array<(entries: ConsoleEntry[]) => void> = [];
  private maxEntries = 1000; // Prevent memory issues with too many entries

  /**
   * Add a new entry to the console
   */
  addEntry(content: string, type: ConsoleEntry["type"] = "print"): void {
    const entry: ConsoleEntry = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      timestamp: Date.now(),
      type,
    };

    this.entries.push(entry);

    // Trim entries if we exceed max
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    this.notifyListeners();
  }

  /**
   * Get all console entries
   */
  getEntries(): ConsoleEntry[] {
    return [...this.entries];
  }

  /**
   * Clear all console entries
   */
  clear(): void {
    this.entries = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to console changes
   */
  subscribe(listener: (entries: ConsoleEntry[]) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.entries]));
  }

  /**
   * Set maximum number of entries to keep
   */
  setMaxEntries(max: number): void {
    this.maxEntries = max;
    if (this.entries.length > max) {
      this.entries = this.entries.slice(-max);
      this.notifyListeners();
    }
  }
}

// Create singleton instance
export const consoleStore = new ConsoleStore();

// Convenience functions for different output types
export const consolePrint = (content: string) =>
  consoleStore.addEntry(content, "print");
export const consolePrintln = (content: string) =>
  consoleStore.addEntry(content, "println");
export const consoleError = (content: string) =>
  consoleStore.addEntry(content, "error");
export const consoleInfo = (content: string) =>
  consoleStore.addEntry(content, "info");
