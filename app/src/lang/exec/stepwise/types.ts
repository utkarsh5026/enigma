import * as ast from "@/lang/ast/ast";
import * as objects from "@/lang/exec/objects";

export type StepType = "before" | "after" | "during";

export interface EvaluationStep {
  node: ast.Node;
  description: string;
  environment: EnvironmentSnapshot;
  result?: objects.BaseObject;
  lineNumber: number;
  columnNumber: number;
  depth: number;
  nodePath: string;
  stepType: StepType;
  executionPhase: string; // e.g., "evaluating", "completed", "entered"
}

/**
 * Represents a snapshot of the environment at a point in time
 */
export interface EnvironmentSnapshot {
  variables: Variable[];
  parentEnvironment?: EnvironmentSnapshot;
  isBlockScope: boolean;
}

/**
 * Represents a variable in the environment
 */
export interface Variable {
  name: string;
  value: string;
  type: string;
  isConstant: boolean;
  isNew?: boolean; // Flag to highlight newly created variables
}

/**
 * Manages the execution state for visualization
 */
export class ExecutionState {
  currentStep: EvaluationStep | null = null;
  callStack: CallStackFrame[] = [];
  output: OutputEntry[] = [];
  isComplete: boolean = false;
  currentStepNumber: number = 0;
}

/**
 * Represents a function call in the call stack
 */
export interface CallStackFrame {
  functionName: string;
  args: string[];
  returnValue?: string;
  startLine: number;
  startColumn: number;
  isActive: boolean;
}

/**
 * Represents an output entry (console output, return value, etc.)
 */
export interface OutputEntry {
  value: string;
  type: "log" | "error" | "return" | "assignment" | "operation";
  timestamp: number;
  stepNumber: number;
}
