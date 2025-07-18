import { Position } from "@/lang/token/token";

/**
 * 📞 StackFrame - Single Call Stack Entry 📞
 *
 * Represents a single function call frame in the execution stack.
 *
 * This is like a snapshot of "where we are" in the program execution.
 * When an error occurs, we can look at all the stack frames to see
 * the complete path that led to the error.
 *
 * Example stack frame chain:
 * ```
 * main() at line 10 <- Top of stack (most recent call)
 * └─ calculateTotal() at line 5
 * └─ processItem() at line 2 <- Bottom of stack (oldest call)
 * ```
 */

/**
 * 🏷️ Types of stack frames in our interpreter
 */
export enum FrameType {
  GLOBAL = "Global", // Top-level program execution
  USER_FUNCTION = "Function", // User-defined function call
  BUILTIN = "Built-in", // Built-in function call
  EXPRESSION = "Expression", // Expression evaluation (for very detailed traces)
  UNKNOWN = "Unknown", // Fallback for edge cases
}

export class StackFrame {
  readonly functionName: string;
  readonly position: Position | null;
  readonly frameType: FrameType;

  /**
   * 🏗️ Creates a new stack frame with full context
   */
  constructor(
    functionName: string | null,
    position: Position | null,
    frameType: FrameType | null
  ) {
    this.functionName = functionName ?? "<anonymous>";
    this.position = position;
    this.frameType = frameType ?? FrameType.UNKNOWN;
  }

  /**
   * 🏗️ Creates a global scope frame
   */
  static createGlobalFrame(): StackFrame {
    return new StackFrame("<global>", { line: 1, column: 1 }, FrameType.GLOBAL);
  }

  /**
   * 🏗️ Creates a user function frame
   */
  static createFunctionFrame(
    functionName: string,
    position: Position
  ): StackFrame {
    return new StackFrame(functionName, position, FrameType.USER_FUNCTION);
  }

  /**
   * 🏗️ Creates a built-in function frame
   */
  static createBuiltinFrame(functionName: string): StackFrame {
    const builtinPosition: Position = { line: 0, column: 0 }; // Built-ins don't have source positions
    return new StackFrame(functionName, builtinPosition, FrameType.BUILTIN);
  }

  /**
   * 📝 Formats this frame for display in stack traces
   *
   * Creates a readable representation like:
   * "at calculateTotal() [Function] (line 15, column 8)"
   * "at len() [Built-in]"
   * "at <global> [Global] (line 1, column 1)"
   */
  formatForStackTrace(): string {
    let result = `  at ${this.functionName} [${this.frameType}]`;

    if (this.frameType !== FrameType.BUILTIN && this.position !== null) {
      result += ` (line ${this.position.line}, column ${this.position.column})`;
    }

    return result;
  }

  toString(): string {
    return this.formatForStackTrace();
  }
}
