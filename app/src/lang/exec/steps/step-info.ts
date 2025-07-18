import { Node } from "@/lang/ast/ast";
import { BaseObject, Environment } from "@/lang/exec/core";

export type StepInfo = {
  node: Node;
  description: string;
  env: Environment;
  result?: BaseObject;
  evaluationDepth: number;
  evaluationPath: string;
  stepType: StepType;
  timestamp: number;
  customData?: unknown;
};

export type StepType = "Before" | "During" | "After";

export type EvaluationStep = {
  node: Node;
  description: string;
  envSnapshot: EnvironmentSnapshot;
  result?: BaseObject;
  lineNumber: number;
  columnNumber: number;
  depth: number;
  nodePath: string;
  stepType: StepType;
  executionPhase: "evaluation" | "execution" | "completed" | "unknown";
};

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

export interface StepStorage {
  addStep(step: StepInfo): void;
  getSteps(): EvaluationStep[];
  reset(): void;
  getCurrentStep(): EvaluationStep | null;

  pushCallStack(frame: CallStackFrame): void;
  popCallStack(): CallStackFrame | null;
  addOutput(output: OutputEntry): void;
  getExecutionState(): ExecutionState;
  updateExecutionState(updates: Partial<ExecutionState>): void;

  nextStep(): EvaluationStep | null;
  previousStep(): EvaluationStep | null;
  goToStep(index: number): EvaluationStep | null;
}

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
