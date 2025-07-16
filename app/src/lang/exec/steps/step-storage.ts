import {
  EvaluationStep,
  StepInfo,
  StepStorage,
  EnvironmentSnapshot,
  Variable,
} from "./step-info";
import { Environment } from "../objects";

export class DefaultStepStorage implements StepStorage {
  private steps: EvaluationStep[] = [];
  private currentIndex: number = 0;

  addStep(step: StepInfo): void {
    const evaluationStep: EvaluationStep = {
      node: step.node,
      description: step.description,
      envSnapshot: this.createEnvironmentSnapshot(step.env),
      result: step.result,
      lineNumber: step.node.position().line,
      columnNumber: step.node.position().column,
      depth: step.evaluationDepth,
      nodePath: step.evaluationPath,
      stepType: step.stepType,
      executionPhase: this.getExecutionPhase(step.stepType),
    };

    this.steps.push(evaluationStep);
    this.currentIndex = this.steps.length - 1;
  }

  getSteps(): EvaluationStep[] {
    return [...this.steps];
  }

  getCurrentStep(): EvaluationStep | null {
    return this.steps[this.currentIndex] || null;
  }

  reset(): void {
    this.steps = [];
    this.currentIndex = 0;
  }

  // Navigation methods
  nextStep(): EvaluationStep | null {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      return this.steps[this.currentIndex];
    }
    return null;
  }

  previousStep(): EvaluationStep | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.steps[this.currentIndex];
    }
    return null;
  }

  goToStep(index: number): EvaluationStep | null {
    if (index >= 0 && index < this.steps.length) {
      this.currentIndex = index;
      return this.steps[this.currentIndex];
    }
    return null;
  }

  private getExecutionPhase(
    stepType: StepInfo["stepType"]
  ): EvaluationStep["executionPhase"] {
    switch (stepType) {
      case "Before":
        return "evaluation";
      case "During":
        return "execution";
      case "After":
        return "completed";
      default:
        return "unknown";
    }
  }

  private createEnvironmentSnapshot(env: Environment): EnvironmentSnapshot {
    const variables: Variable[] = [];

    env.store().forEach((value, name) => {
      variables.push({
        name,
        value: value.inspect(),
        type: value.type(),
        isConstant: env.isConstant(name),
        isNew: false,
      });
    });

    return {
      variables,
      isBlockScope: env.isBlockScope(),
      parentEnvironment: env.outer()
        ? this.createEnvironmentSnapshot(env.outer()!)
        : undefined,
    };
  }
}
