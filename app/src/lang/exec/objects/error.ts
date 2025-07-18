import { BaseObject, ObjectType } from "../core/base";
import { StackFrame } from "../debug/stack-frame";
import { CallStack } from "../debug/call-stack";
import { Position } from "../../token/token";

/**
 * Error object for representing runtime errors.
 */
export class ErrorObject implements BaseObject {
  readonly message: string;
  readonly stackTrace: StackFrame[];
  readonly hasStackTrace: boolean;
  readonly position: Position | null;
  readonly sourceContext: string | null;

  constructor(
    message: string | null,
    position?: Position | null,
    stackTrace?: StackFrame[] | null,
    sourceContext?: string | null
  ) {
    this.message = message ?? "Unknown error";
    this.position = position ?? null;
    this.stackTrace = stackTrace ? [...stackTrace] : [];
    this.hasStackTrace = this.stackTrace.length > 0;
    this.sourceContext = sourceContext ?? null;
  }

  static withStackTrace(
    message: string,
    callStack: CallStack | null,
    position?: Position | null,
    sourceContext?: string | null
  ): ErrorObject {
    const stackTrace = callStack ? callStack.captureStackTrace() : [];
    return new ErrorObject(message, position, stackTrace, sourceContext);
  }

  static simple(message: string): ErrorObject {
    return new ErrorObject(message);
  }

  getStackTrace(): StackFrame[] {
    return this.hasStackTrace ? [...this.stackTrace] : [];
  }

  /**
   * 📝 Gets detailed error message with stack trace
   */
  getDetailedMessage(): string {
    let result = this.message;

    if (this.position) {
      result += `\n   at line ${this.position.line}, column ${this.position.column}`;
    }

    if (this.sourceContext) {
      result += `\n\n${this.sourceContext}`;
    }

    if (this.hasStackTrace) {
      result += `\n\n${this.formatStackTrace()}`;
    }

    return result;
  }

  /**
   * 📚 Formats the stack trace for display
   */
  formatStackTrace(): string {
    if (!this.hasStackTrace) {
      return "No stack trace available";
    }

    const result = ["Stack trace (most recent call first):\n"];
    for (let i = 0; i < this.stackTrace.length; i++) {
      const frame = this.stackTrace[i];
      result.push(`\n  ${frame.formatForStackTrace()}`);
    }

    return result.join("");
  }

  type(): ObjectType {
    return ObjectType.ERROR;
  }

  inspect(): string {
    return this.hasStackTrace
      ? this.getDetailedMessage()
      : `ERROR: ${this.message}`;
  }

  isTruthy(): boolean {
    return false;
  }

  equals(obj: unknown): boolean {
    if (this === obj) return true;
    if (!(obj instanceof ErrorObject)) return false;
    const other = obj as ErrorObject;
    return this.message === other.message;
  }

  hashCode(): number {
    let hash = 0;
    for (let i = 0; i < this.message.length; i++) {
      const char = this.message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * 🖨️ Prints the stack trace to console
   */
  printStackTrace(): void {
    console.error(this.getDetailedMessage());
  }

  /**
   * 📝 Creates a user-friendly error message for display
   */
  toDisplayString(): string {
    if (this.hasStackTrace) {
      return this.getDetailedMessage();
    }

    return this.message;
  }
}
