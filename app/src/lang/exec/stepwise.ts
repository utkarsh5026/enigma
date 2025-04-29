import * as ast from "@/lang/ast/ast";
import Evaluator from "@/lang/exec/eval";
import * as objects from "@/lang/exec/objects";
import * as statements from "@/lang/ast/statement";
import * as expressions from "@/lang/ast/expression";
import * as literals from "@/lang/ast/literal";
import * as utils from "@/lang/exec/utils";
import { Token } from "@/lang/token/token";

/**
 * Represents a snapshot of an execution step during program evaluation
 */
export interface EvaluationStep {
  node: ast.Node; // The AST node being evaluated
  description: string; // Human-readable description of this step
  environment: EnvironmentSnapshot; // Snapshot of variable environment
  result?: objects.BaseObject; // Result of this evaluation step
  lineNumber: number; // Source code line number
  columnNumber: number; // Source code column number
  depth: number; // Call stack depth (for indentation)
  nodePath: string; // Path to the node in the AST (for highlighting)
}

/**
 * Represents a snapshot of the environment at a point in time
 */
export interface EnvironmentSnapshot {
  variables: Variable[]; // Variables in this environment
  parentEnvironment?: EnvironmentSnapshot; // Parent environment (closure)
  isBlockScope: boolean; // Whether this is a block scope
}

/**
 * Represents a variable in the environment
 */
export interface Variable {
  name: string; // Variable name
  value: string; // Stringified value
  type: string; // Type of the value
  isConstant: boolean; // Whether this is a constant
}

/**
 * Manages the execution state for visualization
 */
export class ExecutionState {
  currentStep: EvaluationStep | null = null;
  callStack: CallStackFrame[] = [];
  output: OutputEntry[] = [];
  isComplete: boolean = false;
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
}

/**
 * Represents an output entry (console output, return value, etc.)
 */
export interface OutputEntry {
  value: string;
  type: "log" | "error" | "return";
  timestamp: number;
}

/**
 * A specialized evaluator that supports step-by-step execution
 * with detailed state tracking for visualization purposes
 */
export class StepwiseEvaluator extends Evaluator {
  private steps: EvaluationStep[] = [];
  private currentStepIndex: number = 0;
  private globalEnv: objects.Environment;
  private executionState: ExecutionState = new ExecutionState();
  private nodeQueue: {
    node: ast.Node;
    env: objects.Environment;
    path: string;
  }[] = [];
  private callDepth: number = 0;

  constructor() {
    super();
    this.globalEnv = new objects.Environment();
  }

  /**
   * Prepare a program for step-by-step execution
   *
   * @param program The AST of the program to execute
   * @param code The original source code (for line mapping)
   */
  public prepare(program: ast.Program): void {
    this.steps = [];
    this.currentStepIndex = 0;
    this.nodeQueue = [];
    this.callDepth = 0;
    this.executionState = new ExecutionState();

    // Reset the environment
    this.globalEnv = new objects.Environment();

    // Queue up the program statements
    program.statements.forEach((stmt, index) => {
      this.nodeQueue.push({
        node: stmt,
        env: this.globalEnv,
        path: `program.statements[${index}]`,
      });
    });
  }

  /**
   * Execute the next step in the program
   *
   * @returns The next execution step or null if execution is complete
   */
  public nextStep(): ExecutionState {
    // Return cached step if available
    if (this.currentStepIndex < this.steps.length) {
      const step = this.steps[this.currentStepIndex++];
      this.executionState.currentStep = step;
      return this.executionState;
    }

    // No more nodes to evaluate
    if (this.nodeQueue.length === 0) {
      this.executionState.isComplete = true;
      return this.executionState;
    }

    const { node, env, path } = this.nodeQueue.shift()!;
    let step: EvaluationStep | null = null;

    try {
      step = this.evaluateStepwise(node, env, path);
    } catch (error) {
      // Handle runtime errors
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.executionState.output.push({
        value: `Runtime Error: ${errorMessage}`,
        type: "error",
        timestamp: Date.now(),
      });
      this.executionState.isComplete = true;
      return this.executionState;
    }

    if (step) {
      this.steps.push(step);
      this.currentStepIndex++;
      this.executionState.currentStep = step;

      // Check for return values at the top level (program result)
      if (
        step.result &&
        utils.isReturnValue(step.result) &&
        this.nodeQueue.length === 0
      ) {
        const returnValue = step.result.value;
        this.executionState.output.push({
          value: `Program returned: ${returnValue.inspect()}`,
          type: "return",
          timestamp: Date.now(),
        });
      }
    }

    return this.executionState;
  }

  /**
   * Go back to the previous execution step
   *
   * @returns The previous execution state or null if at the beginning
   */
  public previousStep(): ExecutionState | null {
    if (this.currentStepIndex <= 1) return null;

    this.currentStepIndex -= 2;
    const step = this.steps[this.currentStepIndex++];
    this.executionState.currentStep = step;
    this.executionState.isComplete = false;

    return this.executionState;
  }

  /**
   * Run the program to completion and return the final state
   *
   * @returns The final execution state
   */
  public runToCompletion(): ExecutionState {
    while (!this.executionState.isComplete) {
      this.nextStep();
    }
    return this.executionState;
  }

  /**
   * Create a snapshot of the current environment
   *
   * @param env The environment to snapshot
   * @returns A snapshot of the environment
   */
  private createEnvironmentSnapshot(
    env: objects.Environment
  ): EnvironmentSnapshot {
    const variables: Variable[] = [];

    // Get all variables in current environment
    env.store().forEach((value, name) => {
      variables.push({
        name,
        value: value.inspect(),
        type: value.type(),
        isConstant: env.isConstant(name),
      });
    });

    const snapshot: EnvironmentSnapshot = {
      variables,
      isBlockScope: env.isBlockScope(),
    };

    // Recursively capture parent environments
    if (env.outer()) {
      snapshot.parentEnvironment = this.createEnvironmentSnapshot(env.outer()!);
    }

    return snapshot;
  }

  /**
   * Get position information from a node
   *
   * @param node The AST node
   * @returns Line and column information
   */
  private getNodePosition(node: ast.Node): { line: number; column: number } {
    if ("token" in node) {
      const token = node.token as Token;
      if (token?.position) {
        return {
          line: token.position.line,
          column: token.position.column,
        };
      }
    }

    return { line: 0, column: 0 };
  }

  /**
   * Get a human-readable description of a node operation
   *
   * @param node The AST node
   * @returns A human-readable description
   */
  private getNodeDescription(node: ast.Node): string {
    switch (node.constructor.name) {
      case "Program":
        return "Program execution started";

      case "LetStatement": {
        const letStmt = node as statements.LetStatement;
        return `Declaring variable '${letStmt.name.value}'`;
      }

      case "ConstStatement": {
        const constStmt = node as statements.ConstStatement;
        return `Declaring constant '${constStmt.name.value}'`;
      }

      case "ReturnStatement":
        return "Returning a value from function";

      case "ExpressionStatement":
        return "Evaluating expression";

      case "BlockStatement":
        return "Entering code block";

      case "WhileStatement":
        return "Evaluating while loop condition";

      case "BreakStatement":
        return "Breaking out of loop";

      case "ContinueStatement":
        return "Continuing to next loop iteration";

      case "InfixExpression": {
        const infixExpr = node as expressions.InfixExpression;
        return `Evaluating operation: ${infixExpr.left.toString()} ${
          infixExpr.operator
        } ${infixExpr.right.toString()}`;
      }

      case "PrefixExpression": {
        const prefixExpr = node as expressions.PrefixExpression;
        return `Evaluating operation: ${
          prefixExpr.operator
        }${prefixExpr.right.toString()}`;
      }

      case "IfExpression":
        return "Evaluating if condition";

      case "CallExpression": {
        const callExpr = node as expressions.CallExpression;
        let funcName = "anonymous function";
        if (callExpr.func instanceof ast.Identifier) {
          funcName = callExpr.func.value;
        }
        return `Calling function '${funcName}' with ${callExpr.args.length} arguments`;
      }

      case "AssignmentExpression": {
        const assignExpr = node as expressions.AssignmentExpression;
        return `Assigning value to variable '${assignExpr.name.value}'`;
      }

      case "Identifier": {
        const identifier = node as ast.Identifier;
        return `Looking up variable '${identifier.value}'`;
      }

      case "IntegerLiteral": {
        const intLiteral = node as literals.IntegerLiteral;
        return `Integer literal: ${intLiteral.value}`;
      }

      case "StringLiteral": {
        const strLiteral = node as literals.StringLiteral;
        return `String literal: "${strLiteral.value}"`;
      }

      case "BooleanExpression": {
        const boolExpr = node as expressions.BooleanExpression;
        return `Boolean literal: ${boolExpr.value}`;
      }

      case "FunctionLiteral":
        return "Creating function";

      case "ArrayLiteral":
        return "Creating array";

      case "HashLiteral":
        return "Creating hash object";

      case "IndexExpression": {
        return `Accessing element by index`;
      }

      default:
        return `Evaluating ${node.constructor.name}`;
    }
  }

  /**
   * Evaluate a node and create a step
   *
   * @param node The AST node to evaluate
   * @param env The environment to evaluate in
   * @param path The path to the node in the AST
   * @returns An evaluation step
   */
  private evaluateStepwise(
    node: ast.Node,
    env: objects.Environment,
    path: string
  ): EvaluationStep {
    const { line, column } = this.getNodePosition(node);
    const description = this.getNodeDescription(node);

    // Update call stack
    this.updateCallStack(node, env);

    // Handle special node types for visualization purposes
    if (node instanceof statements.BlockStatement) {
      // Create a new block scope environment
      const blockEnv = env.newBlockScope();

      // Queue up each statement in the block (in proper order)
      for (let i = 0; i < node.statements.length; i++) {
        this.nodeQueue.unshift({
          node: node.statements[i],
          env: blockEnv,
          path: `${path}.statements[${i}]`,
        });
      }
    } else if (node instanceof expressions.IfExpression) {
      // Evaluate the condition before branching
      this.handleIfExpression(node, env, path);
    } else if (node instanceof statements.WhileStatement) {
      // Handle while loop specially for visualization
      this.handleWhileStatement(node, env, path);
    } else if (node instanceof expressions.CallExpression) {
      // Handle function calls specially
      this.handleCallExpression(node, env, path);
    }

    // Perform the actual evaluation
    const result = super.evaluate(node, env);

    // Handle console output for built-in functions
    if (this.isConsoleOutput(node)) {
      const output = result.inspect();
      this.executionState.output.push({
        value: output,
        type: "log",
        timestamp: Date.now(),
      });
    }

    // Create the step
    const step: EvaluationStep = {
      node,
      description,
      environment: this.createEnvironmentSnapshot(env),
      result,
      lineNumber: line,
      columnNumber: column,
      depth: this.callDepth,
      nodePath: path,
    };

    return step;
  }

  /**
   * Check if a node evaluation produces console output
   */
  private isConsoleOutput(node: ast.Node): boolean {
    // In a real implementation, this would check for calls to console.log or similar
    // For now, this is a simplified version
    if (node instanceof expressions.CallExpression) {
      const callExpr = node;
      if (callExpr.func instanceof ast.Identifier) {
        const funcName = callExpr.func.value;
        return (
          funcName === "puts" || funcName === "print" || funcName === "console"
        );
      }
    }
    return false;
  }

  /**
   * Handle if expression evaluation for visualization
   */
  private handleIfExpression(
    node: expressions.IfExpression,
    env: objects.Environment,
    path: string
  ): void {
    // First, evaluate the condition
    const condition = node.conditions[0];
    const conditionResult = super.evaluate(condition, env);

    if (this.truthy(conditionResult)) {
      // If condition is true, queue up the consequence
      this.nodeQueue.unshift({
        node: node.consequences[0],
        env: env,
        path: `${path}.consequences[0]`,
      });
    } else if (node.alternative) {
      // If condition is false and there's an alternative, queue it
      this.nodeQueue.unshift({
        node: node.alternative,
        env: env,
        path: `${path}.alternative`,
      });
    }
  }

  /**
   * Handle while statement evaluation for visualization
   */
  private handleWhileStatement(
    node: statements.WhileStatement,
    env: objects.Environment,
    path: string
  ): void {
    // First, evaluate the condition
    const conditionResult = super.evaluate(node.condition, env);

    if (this.truthy(conditionResult)) {
      // If condition is true, queue up the body followed by the while statement again
      this.nodeQueue.unshift({
        node: node, // Re-queue the while statement itself
        env: env,
        path: path,
      });

      this.nodeQueue.unshift({
        node: node.body,
        env: env.newBlockScope(),
        path: `${path}.body`,
      });
    }
  }

  /**
   * Handle call expression evaluation for visualization
   */
  private handleCallExpression(
    node: expressions.CallExpression,
    env: objects.Environment,
    path: string
  ): void {
    const func = super.evaluate(node.func, env);

    if (utils.isFunction(func)) {
      // Evaluate arguments
      const args: objects.BaseObject[] = [];
      for (const arg of node.args) {
        const evaluatedArg = super.evaluate(arg, env);
        args.push(evaluatedArg);
      }

      // Create a new environment for the function call
      const funcEnv = this.extendFunctionEnv(func, args);

      // Increment call depth for visualization
      this.callDepth++;

      // Add function body to the queue
      this.nodeQueue.unshift({
        node: func.body,
        env: funcEnv,
        path: `${path}.function.body`,
      });

      // Add the function to the call stack for visualization
      this.updateCallStack(node, env, args);
    }
  }

  /**
   * Update the call stack visualization
   */
  private updateCallStack(
    node: ast.Node,
    env: objects.Environment,
    args?: objects.BaseObject[]
  ): void {
    if (node instanceof expressions.CallExpression) {
      // Function call - push to stack
      const callExpr = node;
      let funcName = "anonymous";

      if (callExpr.func instanceof ast.Identifier) {
        funcName = callExpr.func.value;
      }

      const position = this.getNodePosition(node);
      const argStrings = args ? args.map((arg) => arg.inspect()) : [];

      this.executionState.callStack.push({
        functionName: funcName,
        args: argStrings,
        startLine: position.line,
        startColumn: position.column,
      });
    } else if (node instanceof statements.ReturnStatement) {
      // Function return - pop from stack
      if (this.executionState.callStack.length > 0) {
        const frame = this.executionState.callStack.pop();
        if (frame) {
          const returnValue = super.evaluate(node.returnValue, env);
          this.callDepth--;

          // Log the return for visualization
          this.executionState.output.push({
            value: `Function '${
              frame.functionName
            }' returned: ${returnValue.inspect()}`,
            type: "return",
            timestamp: Date.now(),
          });
        }
      }
    }
  }
}
