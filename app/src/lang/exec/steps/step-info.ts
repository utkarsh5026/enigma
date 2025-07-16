import { Node } from "@/lang/ast/ast";
import { BaseObject, Environment } from "../objects";

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
}
