// Enhanced stepwise.ts - Simplified and more reliable step-by-step execution

import * as ast from "@/lang/ast/ast";
import Evaluator from "@/lang/exec/evaluation/eval";
import * as objects from "@/lang/exec/objects";
import * as statements from "@/lang/ast/statement";
import * as expressions from "@/lang/ast/expression";
import * as literals from "@/lang/ast/literal";
import * as utils from "@/lang/exec/evaluation/validate";
import { Token } from "@/lang/token/token";
import { toBool } from "../evaluation/expression";

/**
 * Represents a snapshot of an execution step during program evaluation
 */
export interface EvaluationStep {
  node: ast.Node;
  description: string;
  environment: EnvironmentSnapshot;
  result?: objects.BaseObject;
  lineNumber: number;
  columnNumber: number;
  depth: number;
  nodePath: string;
  stepType: "before" | "after" | "during";
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
  totalSteps: number = 0;
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

/**
 * Enhanced step-by-step evaluator with proper granular execution tracking
 */
export class StepwiseEvaluator extends Evaluator {
  private executionHistory: EvaluationStep[] = [];
  private currentStepIndex: number = 0;
  private globalEnv: objects.Environment;
  private executionState: ExecutionState = new ExecutionState();
  private program: ast.Program | null = null;
  private stepCounter: number = 0;

  constructor() {
    super();
    this.globalEnv = new objects.Environment();
  }

  /**
   * Prepare a program for step-by-step execution
   */
  public prepare(program: ast.Program): void {
    this.executionHistory = [];
    this.currentStepIndex = 0;
    this.stepCounter = 0;
    this.executionState = new ExecutionState();
    this.program = program;

    // Reset the environment
    this.globalEnv = new objects.Environment();

    // Pre-analyze the program to estimate total steps
    this.executionState.totalSteps = this.estimateSteps(program);

    // Create initial step
    this.addStep(
      program,
      this.globalEnv,
      "Program execution started",
      "program",
      "before"
    );
  }

  /**
   * Execute the next step in the program
   */
  public nextStep(): ExecutionState {
    // If we have cached steps, return the next one
    if (this.currentStepIndex < this.executionHistory.length) {
      const step = this.executionHistory[this.currentStepIndex++];
      this.executionState.currentStep = step;
      this.executionState.currentStepNumber = this.currentStepIndex;
      return this.executionState;
    }

    // If we've completed execution, mark as complete
    if (!this.program || this.executionState.isComplete) {
      this.executionState.isComplete = true;
      return this.executionState;
    }

    try {
      // Execute the program step by step
      if (this.currentStepIndex === 1) {
        // First real execution step
        this.executeStepByStep(this.program, this.globalEnv, "program");
      }

      // Get the next step if available
      if (this.currentStepIndex < this.executionHistory.length) {
        const step = this.executionHistory[this.currentStepIndex++];
        this.executionState.currentStep = step;
        this.executionState.currentStepNumber = this.currentStepIndex;
      } else {
        this.executionState.isComplete = true;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.addOutput(`Runtime Error: ${errorMessage}`, "error");
      this.executionState.isComplete = true;
    }

    return this.executionState;
  }

  /**
   * Go back to the previous execution step
   */
  public previousStep(): ExecutionState | null {
    if (this.currentStepIndex <= 1) return null;

    this.currentStepIndex--;
    const step = this.executionHistory[this.currentStepIndex - 1];
    this.executionState.currentStep = step;
    this.executionState.currentStepNumber = this.currentStepIndex;
    this.executionState.isComplete = false;

    return this.executionState;
  }

  /**
   * Enhanced step-by-step evaluation with proper granularity
   */
  private executeStepByStep(
    node: ast.Node,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    // Create a "before" step
    this.addStep(node, env, this.getBeforeDescription(node), path, "before");

    let result: objects.BaseObject;

    // Handle different node types with proper step granularity
    switch (node.constructor) {
      case ast.Program:
        result = this.executeProgram(node as ast.Program, env, path);
        break;

      case statements.LetStatement:
        result = this.executeLetStatement(
          node as statements.LetStatement,
          env,
          path
        );
        break;

      case statements.ConstStatement:
        result = this.executeConstStatement(
          node as statements.ConstStatement,
          env,
          path
        );
        break;

      case statements.ReturnStatement:
        result = this.executeReturnStatement(
          node as statements.ReturnStatement,
          env,
          path
        );
        break;

      case statements.ExpressionStatement:
        result = this.executeStepByStep(
          (node as statements.ExpressionStatement).expression,
          env,
          `${path}.expression`
        );
        break;

      case statements.BlockStatement:
        result = this.executeBlockStatement(
          node as statements.BlockStatement,
          env,
          path
        );
        break;

      case expressions.InfixExpression:
        result = this.executeInfixExpression(
          node as expressions.InfixExpression,
          env,
          path
        );
        break;

      case expressions.PrefixExpression:
        result = this.executePrefixExpression(
          node as expressions.PrefixExpression,
          env,
          path
        );
        break;

      case expressions.CallExpression:
        result = this.executeCallExpression(
          node as expressions.CallExpression,
          env,
          path
        );
        break;

      case expressions.AssignmentExpression:
        result = this.executeAssignmentExpression(
          node as expressions.AssignmentExpression,
          env,
          path
        );
        break;

      case ast.Identifier:
        result = this.executeIdentifier(node as ast.Identifier, env);
        break;

      case literals.IntegerLiteral:
        result = new objects.IntegerObject(
          (node as literals.IntegerLiteral).value
        );
        break;

      case literals.StringLiteral:
        result = new objects.StringObject(
          (node as literals.StringLiteral).value
        );
        break;

      case expressions.BooleanExpression:
        result = toBool((node as expressions.BooleanExpression).value);
        break;

      default:
        // Fall back to the base evaluator for other node types
        result = super.evaluate(node, env);
        break;
    }

    // Create an "after" step with the result
    this.addStep(
      node,
      env,
      this.getAfterDescription(node, result),
      path,
      "after",
      result
    );

    return result;
  }

  /**
   * Execute a program node step by step
   */
  private executeProgram(
    program: ast.Program,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    let result: objects.BaseObject = new objects.NullObject();

    for (let i = 0; i < program.statements.length; i++) {
      const statement = program.statements[i];
      this.addStep(
        statement,
        env,
        `Executing statement ${i + 1} of ${program.statements.length}`,
        `${path}.statements[${i}]`,
        "before"
      );

      result = this.executeStepByStep(
        statement,
        env,
        `${path}.statements[${i}]`
      );

      if (
        result instanceof objects.ReturnValueObject ||
        result instanceof objects.ErrorObject
      ) {
        break;
      }
    }

    return result;
  }

  /**
   * Execute a let statement step by step
   */
  private executeLetStatement(
    stmt: statements.LetStatement,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    const identifier = stmt.name.value;

    // Step 1: Show that we're about to evaluate the right-hand side
    this.addStep(
      stmt.value,
      env,
      `Evaluating expression for variable '${identifier}'`,
      `${path}.value`,
      "before"
    );

    // Step 2: Evaluate the value
    const value = this.executeStepByStep(stmt.value, env, `${path}.value`);

    if (value instanceof objects.ErrorObject) return value;

    // Step 3: Check if variable already exists
    if (env.has(identifier)) {
      const error = new objects.ErrorObject(
        `Identifier ${identifier} already declared`
      );
      this.addStep(
        stmt,
        env,
        `Error: Variable '${identifier}' already exists`,
        path,
        "after",
        error
      );
      return error;
    }

    // Step 4: Assign the value
    env.set(identifier, value);
    this.addOutput(
      `Variable '${identifier}' assigned value: ${value.inspect()}`,
      "assignment"
    );

    return value;
  }

  /**
   * Execute a const statement step by step
   */
  private executeConstStatement(
    stmt: statements.ConstStatement,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    const identifier = stmt.name.value;

    this.addStep(
      stmt.value,
      env,
      `Evaluating expression for constant '${identifier}'`,
      `${path}.value`,
      "before"
    );

    const value = this.executeStepByStep(stmt.value, env, `${path}.value`);

    if (value instanceof objects.ErrorObject) return value;

    if (env.has(identifier)) {
      const error = new objects.ErrorObject(
        `Identifier ${identifier} already declared`
      );
      this.addStep(
        stmt,
        env,
        `Error: Constant '${identifier}' already exists`,
        path,
        "after",
        error
      );
      return error;
    }

    env.setConst(identifier, value);
    this.addOutput(
      `Constant '${identifier}' assigned value: ${value.inspect()}`,
      "assignment"
    );

    return value;
  }

  /**
   * Execute an infix expression step by step
   */
  private executeInfixExpression(
    expr: expressions.InfixExpression,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    // Step 1: Evaluate left operand
    this.addStep(
      expr.left,
      env,
      `Evaluating left operand: ${expr.left.toString()}`,
      `${path}.left`,
      "before"
    );
    const left = this.executeStepByStep(expr.left, env, `${path}.left`);

    if (utils.isError(left)) return left;

    // Step 2: Evaluate right operand
    this.addStep(
      expr.right,
      env,
      `Evaluating right operand: ${expr.right.toString()}`,
      `${path}.right`,
      "before"
    );
    const right = this.executeStepByStep(expr.right, env, `${path}.right`);

    if (utils.isError(right)) return right;

    // Step 3: Apply the operator
    this.addStep(
      expr,
      env,
      `Applying operator '${
        expr.operator
      }' to ${left.inspect()} and ${right.inspect()}`,
      path,
      "during"
    );

    const result = this.applyInfixOperator(left, right, expr.operator);

    this.addOutput(
      `${left.inspect()} ${
        expr.operator
      } ${right.inspect()} = ${result.inspect()}`,
      "operation"
    );

    return result;
  }

  /**
   * Execute an identifier lookup step by step
   */
  private executeIdentifier(
    identifier: ast.Identifier,
    env: objects.Environment
  ): objects.BaseObject {
    const value = env.get(identifier.value);

    if (value) {
      this.addOutput(
        `Retrieved variable '${identifier.value}': ${value.inspect()}`,
        "log"
      );
      return value;
    }

    const error = new objects.ErrorObject(
      `Identifier not found: ${identifier.value}`
    );
    this.addOutput(`Error: Variable '${identifier.value}' not found`, "error");
    return error;
  }

  /**
   * Execute a return statement step by step
   */
  private executeReturnStatement(
    stmt: statements.ReturnStatement,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    this.addStep(
      stmt.returnValue,
      env,
      "Evaluating return value",
      `${path}.returnValue`,
      "before"
    );

    const value = this.executeStepByStep(
      stmt.returnValue,
      env,
      `${path}.returnValue`
    );

    if (utils.isError(value)) return value;

    this.addOutput(`Returning: ${value.inspect()}`, "return");

    return new objects.ReturnValueObject(value);
  }

  /**
   * Execute a block statement step by step
   */
  private executeBlockStatement(
    block: statements.BlockStatement,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    const blockEnv = env.newBlockScope();
    let result: objects.BaseObject = new objects.NullObject();

    this.addStep(block, blockEnv, "Entering new block scope", path, "before");

    for (let i = 0; i < block.statements.length; i++) {
      const statement = block.statements[i];
      result = this.executeStepByStep(
        statement,
        blockEnv,
        `${path}.statements[${i}]`
      );

      if (
        result instanceof objects.ReturnValueObject ||
        result instanceof objects.ErrorObject ||
        result instanceof objects.BreakObject ||
        result instanceof objects.ContinueObject
      ) {
        break;
      }
    }

    this.addStep(block, blockEnv, "Exiting block scope", path, "after");

    return result;
  }

  /**
   * Execute a call expression step by step
   */
  private executeCallExpression(
    call: expressions.CallExpression,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    // Step 1: Evaluate the function
    this.addStep(
      call.func,
      env,
      "Evaluating function to call",
      `${path}.func`,
      "before"
    );
    const functionObj = this.executeStepByStep(call.func, env, `${path}.func`);

    if (utils.isError(functionObj)) return functionObj;

    // Step 2: Evaluate arguments
    const args: objects.BaseObject[] = [];
    for (let i = 0; i < call.args.length; i++) {
      this.addStep(
        call.args[i],
        env,
        `Evaluating argument ${i + 1}`,
        `${path}.args[${i}]`,
        "before"
      );
      const arg = this.executeStepByStep(
        call.args[i],
        env,
        `${path}.args[${i}]`
      );
      if (utils.isError(arg)) return arg;
      args.push(arg);
    }

    // Step 3: Call the function
    if (utils.isFunction(functionObj)) {
      let funcName = "anonymous";
      if (call.func instanceof ast.Identifier) {
        funcName = call.func.value;
      }

      this.addCallStackFrame(funcName, args, call);
      this.addStep(
        call,
        env,
        `Calling function '${funcName}' with ${args.length} arguments`,
        path,
        "during"
      );

      const result = this.applyFunction(functionObj, args);

      this.removeCallStackFrame();
      this.addOutput(
        `Function '${funcName}' returned: ${result.inspect()}`,
        "return"
      );

      return result;
    }

    return new objects.ErrorObject(`Not a function: ${functionObj.type()}`);
  }

  /**
   * Execute an assignment expression step by step
   */
  private executeAssignmentExpression(
    assign: expressions.AssignmentExpression,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    const name = assign.name.value;
    const definingScope = env.getDefiningScope(name);

    if (!definingScope) {
      const error = new objects.ErrorObject(
        `Cannot assign to undeclared variable '${name}'.`
      );
      this.addStep(
        assign,
        env,
        `Error: Variable '${name}' not declared`,
        path,
        "after",
        error
      );
      return error;
    }

    if (definingScope.isConstant(name)) {
      const error = new objects.ErrorObject(
        `Cannot assign to constant variable '${name}'.`
      );
      this.addStep(
        assign,
        env,
        `Error: Cannot modify constant '${name}'`,
        path,
        "after",
        error
      );
      return error;
    }

    this.addStep(
      assign.value,
      env,
      `Evaluating new value for '${name}'`,
      `${path}.value`,
      "before"
    );
    const value = this.executeStepByStep(assign.value, env, `${path}.value`);

    if (value instanceof objects.ErrorObject) return value;

    definingScope.set(name, value);
    this.addOutput(
      `Variable '${name}' updated to: ${value.inspect()}`,
      "assignment"
    );

    return value;
  }

  /**
   * Execute a prefix expression step by step
   */
  private executePrefixExpression(
    prefix: expressions.PrefixExpression,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    this.addStep(
      prefix.right,
      env,
      `Evaluating operand for '${prefix.operator}'`,
      `${path}.right`,
      "before"
    );
    const right = this.executeStepByStep(prefix.right, env, `${path}.right`);

    if (utils.isError(right)) return right;

    this.addStep(
      prefix,
      env,
      `Applying prefix operator '${prefix.operator}' to ${right.inspect()}`,
      path,
      "during"
    );

    const result = this.applyPrefixOperator(prefix.operator, right);

    this.addOutput(
      `${prefix.operator}${right.inspect()} = ${result.inspect()}`,
      "operation"
    );

    return result;
  }

  /**
   * Helper method to apply infix operators
   */
  private applyInfixOperator(
    left: objects.BaseObject,
    right: objects.BaseObject,
    operator: string
  ): objects.BaseObject {
    return super.evaluate(
      {
        constructor: expressions.InfixExpression,
        left: { toString: () => left.inspect() },
        right: { toString: () => right.inspect() },
        operator: operator,
      } as unknown as expressions.InfixExpression,
      this.globalEnv
    );
  }

  /**
   * Helper method to apply prefix operators
   */
  private applyPrefixOperator(
    operator: string,
    operand: objects.BaseObject
  ): objects.BaseObject {
    // Use the parent class logic but simplified
    return super.evaluate(
      {
        constructor: expressions.PrefixExpression,
        operator: operator,
        right: { toString: () => operand.inspect() },
      } as unknown as expressions.PrefixExpression,
      this.globalEnv
    );
  }

  /**
   * Add a step to the execution history
   */
  private addStep(
    node: ast.Node,
    env: objects.Environment,
    description: string,
    path: string,
    stepType: "before" | "after" | "during",
    result?: objects.BaseObject
  ): void {
    const { line, column } = this.getNodePosition(node);
    const depth = this.executionState.callStack.length;

    const step: EvaluationStep = {
      node,
      description,
      environment: this.createEnvironmentSnapshot(env),
      result,
      lineNumber: line,
      columnNumber: column,
      depth,
      nodePath: path,
      stepType,
      executionPhase:
        stepType === "before"
          ? "evaluating"
          : stepType === "after"
          ? "completed"
          : "executing",
    };

    this.executionHistory.push(step);
    this.stepCounter++;
  }

  /**
   * Add output to the execution state
   */
  private addOutput(message: string, type: OutputEntry["type"]): void {
    this.executionState.output.push({
      value: message,
      type,
      timestamp: Date.now(),
      stepNumber: this.stepCounter,
    });
  }

  /**
   * Add a frame to the call stack
   */
  private addCallStackFrame(
    functionName: string,
    args: objects.BaseObject[],
    node: ast.Node
  ): void {
    const { line, column } = this.getNodePosition(node);

    this.executionState.callStack.push({
      functionName,
      args: args.map((arg) => arg.inspect()),
      startLine: line,
      startColumn: column,
      isActive: true,
    });
  }

  /**
   * Remove the top frame from the call stack
   */
  private removeCallStackFrame(): void {
    const frame = this.executionState.callStack.pop();
    if (frame) {
      frame.isActive = false;
    }
  }

  /**
   * Create a snapshot of the current environment
   */
  private createEnvironmentSnapshot(
    env: objects.Environment
  ): EnvironmentSnapshot {
    const variables: Variable[] = [];

    env.store().forEach((value, name) => {
      variables.push({
        name,
        value: value.inspect(),
        type: value.type(),
        isConstant: env.isConstant(name),
        isNew: false, // You can implement logic to detect new variables
      });
    });

    const snapshot: EnvironmentSnapshot = {
      variables,
      isBlockScope: env.isBlockScope(),
    };

    if (env.outer()) {
      snapshot.parentEnvironment = this.createEnvironmentSnapshot(env.outer()!);
    }

    return snapshot;
  }

  /**
   * Get position information from a node
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
   * Get description for "before" step
   */
  private getBeforeDescription(node: ast.Node): string {
    const nodeType = node.constructor.name;

    switch (nodeType) {
      case "LetStatement":
        return `About to declare variable '${
          (node as statements.LetStatement).name.value
        }'`;
      case "ConstStatement":
        return `About to declare constant '${
          (node as statements.ConstStatement).name.value
        }'`;
      case "ReturnStatement":
        return "About to return a value";
      case "InfixExpression": {
        const infix = node as expressions.InfixExpression;
        return `About to evaluate: ${infix.left.toString()} ${
          infix.operator
        } ${infix.right.toString()}`;
      }
      case "CallExpression": {
        const call = node as expressions.CallExpression;
        let funcName = "anonymous function";
        if (call.func instanceof ast.Identifier) {
          funcName = call.func.value;
        }
        return `About to call function '${funcName}'`;
      }
      case "Identifier":
        return `Looking up variable '${(node as ast.Identifier).value}'`;
      default:
        return `About to evaluate ${nodeType}`;
    }
  }

  /**
   * Get description for "after" step
   */
  private getAfterDescription(
    node: ast.Node,
    result: objects.BaseObject
  ): string {
    const nodeType = node.constructor.name;

    switch (nodeType) {
      case "LetStatement":
        return `Variable '${
          (node as statements.LetStatement).name.value
        }' declared with value: ${result.inspect()}`;
      case "ConstStatement":
        return `Constant '${
          (node as statements.ConstStatement).name.value
        }' declared with value: ${result.inspect()}`;
      case "ReturnStatement":
        return `Returned: ${result.inspect()}`;
      case "InfixExpression":
        return `Expression evaluated to: ${result.inspect()}`;
      case "CallExpression":
        return `Function call completed, result: ${result.inspect()}`;
      case "Identifier":
        return `Variable value: ${result.inspect()}`;
      default:
        return `${nodeType} evaluated to: ${result.inspect()}`;
    }
  }

  /**
   * Estimate the total number of steps for progress tracking
   */
  private estimateSteps(node: ast.Node): number {
    // This is a rough estimation - you can make it more accurate
    let count = 1;

    if (node instanceof ast.Program) {
      count += node.statements.length * 3; // Rough estimate
    }

    return Math.max(count, 10); // Minimum 10 steps
  }
}
