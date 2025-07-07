import * as ast from "@/lang/ast/ast";
import { Evaluator, ObjectValidator } from "@/lang/exec/evaluation";
import * as objects from "@/lang/exec/objects";
import * as statements from "@/lang/ast/statement";
import * as expressions from "@/lang/ast/expression";
import * as literals from "@/lang/ast/literal";
import {
  evaluateInfix,
  evaluatePrefix,
  toBool,
} from "../evaluation/expression";
import {
  type EvaluationStep,
  ExecutionState,
  type EnvironmentSnapshot,
  type Variable,
  type OutputEntry,
  type StepType,
} from "./types";
import { getAfterDescription, getBeforeDescription } from "./description";
import { truthy } from "../evaluation";

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

    this.globalEnv = new objects.Environment();

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
    this.addStep(node, env, getBeforeDescription(node), path, "before");

    let result: objects.BaseObject;

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

      case expressions.IfExpression:
        result = this.executeIfExpression(
          node as expressions.IfExpression,
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

    this.addStep(
      node,
      env,
      getAfterDescription(node, result),
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

    this.addStep(
      stmt.value,
      env,
      `Evaluating expression for variable '${identifier}'`,
      `${path}.value`,
      "before"
    );

    const value = this.executeStepByStep(stmt.value, env, `${path}.value`);

    if (ObjectValidator.isError(value)) return value;

    if (env.has(identifier)) {
      const error = new objects.ErrorObject(
        `Identifier ${identifier} already declared`,
        stmt.position()
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

    if (ObjectValidator.isError(value)) return value;

    if (env.isConstant(identifier)) {
      const error = new objects.ErrorObject(
        `Identifier ${identifier} already declared`,
        stmt.position()
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
    this.addStep(
      expr.left,
      env,
      `Evaluating left operand: ${expr.left.toString()}`,
      `${path}.left`,
      "before"
    );
    const left = this.executeStepByStep(expr.left, env, `${path}.left`);

    if (ObjectValidator.isError(left)) return left;

    this.addStep(
      expr.right,
      env,
      `Evaluating right operand: ${expr.right.toString()}`,
      `${path}.right`,
      "before"
    );
    const right = this.executeStepByStep(expr.right, env, `${path}.right`);

    if (ObjectValidator.isError(right)) return right;

    this.addStep(
      expr,
      env,
      `Applying operator '${
        expr.operator
      }' to ${left.inspect()} and ${right.inspect()}`,
      path,
      "during"
    );

    const result = evaluateInfix(left, right, expr.operator);

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

    if (ObjectValidator.isError(value)) return value;

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
        ObjectValidator.isReturnValue(result) ||
        ObjectValidator.isError(result) ||
        ObjectValidator.isBreak(result) ||
        ObjectValidator.isContinue(result)
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

    if (ObjectValidator.isError(functionObj)) return functionObj;

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
      if (ObjectValidator.isError(arg)) return arg;
      args.push(arg);
    }

    // Step 3: Call the function
    if (ObjectValidator.isFunction(functionObj)) {
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

    if (ObjectValidator.isError(right)) return right;

    this.addStep(
      prefix,
      env,
      `Applying prefix operator '${prefix.operator}' to ${right.inspect()}`,
      path,
      "during"
    );

    const result = evaluatePrefix(prefix.operator, right);

    this.addOutput(
      `${prefix.operator}${right.inspect()} = ${result.inspect()}`,
      "operation"
    );

    return result;
  }

  /**
   * Execute an if expression step by step
   */
  private executeIfExpression(
    ifExp: expressions.IfExpression,
    env: objects.Environment,
    path: string
  ): objects.BaseObject {
    const conditions = ifExp.conditions.length;

    for (let i = 0; i < conditions; i++) {
      const ifCond = ifExp.conditions[i];

      this.addStep(
        ifCond,
        env,
        `Evaluating condition ${i + 1} of ${conditions}`,
        `${path}.conditions[${i}]`,
        "before"
      );

      const condition = this.executeStepByStep(
        ifCond,
        env,
        `${path}.conditions[${i}]`
      );

      if (ObjectValidator.isError(condition)) return condition;

      const isTruthy = truthy(condition);

      this.addStep(
        ifCond,
        env,
        `Condition ${i + 1} evaluated to: ${condition.inspect()} (${
          isTruthy ? "truthy" : "falsy"
        })`,
        `${path}.conditions[${i}]`,
        "after",
        condition
      );

      this.addOutput(
        `If condition ${i + 1}: ${condition.inspect()} is ${
          isTruthy ? "true" : "false"
        }`,
        "operation"
      );

      if (isTruthy) {
        this.addStep(
          ifExp.consequences[i],
          env,
          `Executing consequence ${i + 1} (condition was true)`,
          `${path}.consequences[${i}]`,
          "before"
        );

        const result = this.executeStepByStep(
          ifExp.consequences[i],
          env,
          `${path}.consequences[${i}]`
        );

        this.addOutput(
          `If branch ${i + 1} executed, result: ${result.inspect()}`,
          "log"
        );

        return result;
      }
    }

    if (ifExp.alternative !== null) {
      this.addStep(
        ifExp.alternative,
        env,
        "All conditions were false, executing else block",
        `${path}.alternative`,
        "before"
      );

      const result = this.executeStepByStep(
        ifExp.alternative,
        env,
        `${path}.alternative`
      );

      this.addOutput(`Else block executed, result: ${result.inspect()}`, "log");

      return result;
    }

    this.addOutput(
      "All conditions were false and no else block provided",
      "log"
    );
    return new objects.NullObject();
  }

  /**
   * Add a step to the execution history
   */
  private addStep(
    node: ast.Node,
    env: objects.Environment,
    description: string,
    path: string,
    stepType: StepType,
    result?: objects.BaseObject
  ): void {
    const { line, column } = node.position();
    const depth = this.executionState.callStack.length;

    console.log(description, path, stepType, result, env);

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
    const { line, column } = node.position();

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
}
