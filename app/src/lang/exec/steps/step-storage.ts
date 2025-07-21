import {
  type EvaluationStep,
  type StepInfo,
  type StepStorage,
  type EnvironmentSnapshot,
  type Variable,
  type OutputEntry,
  ExecutionState,
  type CallStackFrame,
} from "./step-info";
import { Environment } from "@/lang/exec/core";

export class DefaultStepStorage implements StepStorage {
  private steps: EvaluationStep[] = [];
  private currentStepIndex: number = 0;
  private executionState: ExecutionState = new ExecutionState();
  private stepCounter: number = 0;

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
    this.stepCounter++;

    // Update execution state
    this.executionState.currentStep = evaluationStep;
    this.executionState.currentStepNumber = this.stepCounter;
    this.currentStepIndex = this.steps.length - 1;
  }

  getSteps(): EvaluationStep[] {
    return [...this.steps];
  }

  getCurrentStep(): EvaluationStep | null {
    if (
      this.currentStepIndex >= 0 &&
      this.currentStepIndex < this.steps.length
    ) {
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  reset(): void {
    this.steps = [];
    this.currentStepIndex = 0;
    this.stepCounter = 0;
    this.executionState = new ExecutionState();
  }

  // Navigation methods
  nextStep(): EvaluationStep | null {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.updateCurrentStepInExecutionState();
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  previousStep(): EvaluationStep | null {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.updateCurrentStepInExecutionState();
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  public goToStep(index: number): EvaluationStep | null {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
      this.updateCurrentStepInExecutionState();
      return this.steps[this.currentStepIndex];
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

    env.variableBindings.forEach((value, name) => {
      variables.push({
        name,
        value: value.inspect(),
        type: value.type(),
        isConstant: env.isVariableImmutable(name),
        isNew: false,
      });
    });

    return {
      variables,
      isBlockScope: env.isBlockScope(),
      parentEnvironment: env.enclosingScope
        ? this.createEnvironmentSnapshot(env.enclosingScope)
        : undefined,
    };
  }

  public addOutput(output: OutputEntry): void {
    this.executionState.output.push({
      ...output,
      stepNumber: this.stepCounter,
      timestamp: output.timestamp || Date.now(),
    });
  }

  public getExecutionState(): ExecutionState {
    return {
      currentStep: this.executionState.currentStep,
      callStack: [...this.executionState.callStack],
      output: [...this.executionState.output],
      isComplete: this.executionState.isComplete,
      currentStepNumber: this.executionState.currentStepNumber,
    };
  }

  updateExecutionState(updates: Partial<ExecutionState>): void {
    Object.assign(this.executionState, updates);
  }

  pushCallStack(frame: CallStackFrame): void {
    this.executionState.callStack.forEach((f) => (f.isActive = false));

    this.executionState.callStack.push({
      ...frame,
      isActive: true,
    });

    this.addOutput({
      value: `Function "${frame.functionName}" called with ${frame.args.length} arguments`,
      type: "log",
      timestamp: Date.now(),
      stepNumber: this.stepCounter,
    });
  }

  popCallStack(): CallStackFrame | null {
    const frame = this.executionState.callStack.pop();

    if (frame) {
      // Mark previous frame as active if it exists
      const previousFrame =
        this.executionState.callStack[this.executionState.callStack.length - 1];
      if (previousFrame) {
        previousFrame.isActive = true;
      }

      // Add output for function return
      const returnStr = frame.returnValue || "undefined";
      this.addOutput({
        value: `Function "${frame.functionName}" returned: ${returnStr}`,
        type: "return",
        timestamp: Date.now(),
        stepNumber: this.stepCounter,
      });
    }

    return frame || null;
  }

  private updateCurrentStepInExecutionState(): void {
    const currentStep = this.steps[this.currentStepIndex];
    if (currentStep) {
      this.executionState.currentStep = currentStep;
      this.executionState.currentStepNumber = this.currentStepIndex + 1;
      this.executionState.isComplete =
        this.currentStepIndex === this.steps.length - 1;
    }
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }
}
