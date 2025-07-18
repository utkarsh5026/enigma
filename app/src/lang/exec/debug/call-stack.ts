import { StackFrame } from "./stack-frame";

/**
 * 📚 CallStack - Execution Stack Manager 📚
 *
 * Manages the call stack during program execution, tracking which functions
 * are currently being executed and where they were called from.
 *
 * From first principles, the call stack works like this:
 *
 * 1. **Push**: When entering a function, push a new frame onto the stack
 * 2. **Pop**: When exiting a function, pop the top frame off the stack
 * 3. **Peek**: Look at the current (top) frame without removing it
 * 4. **Capture**: Take a snapshot of the entire stack for error reporting
 *
 * The stack grows "upward" - newer calls are at the top, older calls at the
 * bottom:
 *
 * ```
 * ┌─────────────────┐ <- Top (most recent call)
 * │ innerFunc()
 * ├─────────────────┤
 * │ middleFunc()
 * ├─────────────────┤
 * │ outerFunc()
 * ├─────────────────┤
 * │ <global> <- Bottom (program start)
 * └─────────────────┘
 * ```
 *
 * When an error occurs, we can traverse the entire stack to show exactly
 * how the program reached the error point.
 */
export class CallStack {
  private readonly frames: StackFrame[];
  private readonly maxStackDepth: number;
  private maxDepthReached: number;

  constructor(maxStackDepth: number = 1000) {
    this.frames = [];
    this.maxStackDepth = maxStackDepth;
    this.maxDepthReached = 1;

    // Initialize with global frame
    this.frames.push(StackFrame.createGlobalFrame());
  }

  /**
   * ⬆️ Pushes a new frame onto the stack (entering a function)
   */
  push(frame: StackFrame): void {
    if (this.frames.length >= this.maxStackDepth) {
      throw new Error(
        `Stack overflow: Maximum stack depth of ${this.maxStackDepth} exceeded. ` +
          `This usually indicates infinite recursion.`
      );
    }

    this.frames.push(frame);

    if (this.frames.length > this.maxDepthReached) {
      this.maxDepthReached = this.frames.length;
    }
  }

  /**
   * ⬇️ Pops the top frame from the stack (exiting a function)
   */
  pop(): StackFrame | null {
    if (this.frames.length === 0) {
      return null;
    }

    if (this.frames.length === 1) {
      return null;
    }

    return this.frames.pop() ?? null;
  }

  /**
   * 👁️ Peeks at the current (top) frame without removing it
   */
  peek(): StackFrame | null {
    if (this.frames.length === 0) {
      return null;
    }
    return this.frames[this.frames.length - 1];
  }

  /**
   * 📊 Gets the current stack depth
   */
  depth(): number {
    return this.frames.length;
  }

  /**
   * 🔍 Checks if the stack is empty
   */
  isEmpty(): boolean {
    return this.frames.length === 0;
  }

  /**
   * 📸 Captures the current stack state for error reporting from (oldest) to (newest)
   */
  captureStackTrace(): StackFrame[] {
    return [...this.frames];
  }

  /**
   * 📸 Captures the current stack state for error reporting from (newest) to (oldest)
   * This is the more common format for stack traces
   */
  captureStackTraceReversed(): StackFrame[] {
    return [...this.frames].reverse();
  }

  /**
   * 🧹 Clears the entire stack (except global frame)
   */
  clear(): void {
    this.frames.length = 0;
    this.frames.push(StackFrame.createGlobalFrame());
    this.maxDepthReached = 1;
  }

  /**
   * 📝 Formats the entire stack trace as a string
   */
  formatStackTrace(): string {
    const frames = this.captureStackTraceReversed();
    return frames.map((frame) => frame.formatForStackTrace()).join("\n");
  }

  /**
   * 🎯 Gets the current function name (top of stack)
   */
  getCurrentFunctionName(): string {
    const current = this.peek();
    return current?.functionName ?? "<unknown>";
  }

  /**
   * 🔍 Checks if a specific function is currently in the call stack
   */
  contains(functionName: string): boolean {
    return this.frames.some((frame) => frame.functionName === functionName);
  }

  /**
   * 📏 Gets the remaining stack capacity
   */
  getRemainingCapacity(): number {
    return this.maxStackDepth - this.frames.length;
  }

  toString(): string {
    return `CallStack(depth=${this.depth()}, maxDepth=${this.maxStackDepth})`;
  }
}
