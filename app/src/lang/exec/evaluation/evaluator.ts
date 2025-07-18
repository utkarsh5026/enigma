import { EvaluationContext, LoopContext } from "../core";
import * as statements from "./statements";
import * as expressions from "./expressions";
import * as literals from "./literals";
import * as ast from "@/lang/ast/ast";
import * as statement from "@/lang/ast/statement";
import * as expression from "@/lang/ast/expression";
import * as literal from "@/lang/ast/literal";
import {
  Environment,
  BaseObject,
  ErrorObject,
  NullObject,
  ReturnValueObject,
} from "../objects";
import { ObjectValidator } from "../core/validate";
import {
  type CallStackFrame,
  ExecutionState,
  type OutputEntry,
  type StepStorage,
  type StepType,
} from "../steps/step-info";
import { DefaultStepStorage } from "../steps/step-storage";
import { Position } from "@/lang/token/token";
import { FrameType, StackFrame, CallStack } from "../debug";

export class LanguageEvaluator implements EvaluationContext {
  private loopContext: LoopContext;
  private evaluationStack: string[] = [];
  private evaluationDepth: number = 0;
  private readonly stepStorage: StepStorage;
  private executionComplete: boolean = false;

  private callStack: CallStack | null = null;
  private readonlysourceLines: string[] = [];

  // Individual evaluator instances
  private readonly letEvaluator = new statements.LetEvaluator();
  private readonly constEvaluator = new statements.ConstEvaluator();
  private readonly returnEvaluator = new statements.ReturnStatementEvaluator();
  private readonly blockEvaluator = new statements.BlockEvaluator();
  private readonly whileEvaluator: statements.WhileStatementEvaluator;
  private readonly forEvaluator: statements.ForStatementEvaluator;
  private readonly breakEvaluator = new statements.BreakStatementEvaluator();
  private readonly continueEvaluator =
    new statements.ContinueStatementEvaluator();

  private readonly callEvaluator = new expressions.CallExpressionEvaluator();
  private readonly ifEvaluator = new expressions.IfExpressionEvaluator();
  private readonly expressionEvaluator = new statements.ExpressionEvaluator();
  private readonly prefixEvaluator =
    new expressions.PrefixExpressionEvaluator();
  private readonly infixEvaluator = new expressions.InfixExpressionEvaluator();
  private readonly identifierEvaluator = new expressions.IndentifierEvaluator();
  private readonly assignmentEvaluator =
    new expressions.AssignmentExpressionEvaluator();
  private readonly indexEvaluator = new expressions.IndexExpressionEvaluator();

  private readonly stringEvaluator = new literals.StringLiteralEvaluator();
  private readonly integerEvaluator = new literals.IntegerLiteralEvaluator();
  private readonly booleanEvaluator = new literals.BooleanLiteralEvaluator();
  private readonly arrayEvaluator = new literals.ArrayLiteralEvaluator();
  private readonly hashEvaluator = new literals.HashLiteralEvaluator();
  private readonly functionEvaluator = new literals.FunctionLiteralEvaluator();
  private readonly nullEvaluator = new literals.NullLiteralEvaluator();
  private readonly fstringEvaluator = new literals.FStringLiteralEvaluator();

  constructor(stepStorage?: StepStorage) {
    this.loopContext = new LoopContext(0);
    this.whileEvaluator = new statements.WhileStatementEvaluator(
      this.loopContext
    );
    this.forEvaluator = new statements.ForStatementEvaluator(this.loopContext);
    this.stepStorage = stepStorage || new DefaultStepStorage();
  }

  public getStepStorage(): StepStorage {
    return this.stepStorage;
  }

  /**
   * 🏗️ Creates new scopes for blocks, functions, loops etc.
   */
  public newScope(parent: Environment, isBlockScope: boolean): Environment {
    return new Environment(parent, isBlockScope);
  }

  /**
   * 📋 Evaluates a list of expressions (for function arguments, array elements, etc.)
   */
  public evaluateExpressions(
    expressions: ast.Node[],
    env: Environment
  ): BaseObject[] {
    const results: BaseObject[] = [];

    for (const expr of expressions) {
      const result = this.evaluate(expr, env);
      if (ObjectValidator.isError(result)) {
        return [result];
      }
      results.push(result);
    }

    return results;
  }

  /**
   * 🎯 Main evaluation method - uses switch for fast dispatch
   */
  public evaluate(node: ast.Node, env: Environment): BaseObject {
    if (node == null) {
      return new ErrorObject("Cannot evaluate null node");
    }

    switch (node.constructor) {
      // Statements
      case statement.LetStatement:
        return this.letEvaluator.evaluate(
          node as statement.LetStatement,
          env,
          this
        );

      case statement.ConstStatement:
        return this.constEvaluator.evaluate(
          node as statement.ConstStatement,
          env,
          this
        );

      case statement.ReturnStatement:
        return this.returnEvaluator.evaluate(
          node as statement.ReturnStatement,
          env,
          this
        );

      case statement.BlockStatement:
        return this.blockEvaluator.evaluate(
          node as statement.BlockStatement,
          env,
          this
        );

      case statement.WhileStatement:
        return this.whileEvaluator.evaluate(
          node as statement.WhileStatement,
          env,
          this
        );

      case statement.ForStatement:
        return this.forEvaluator.evaluate(
          node as statement.ForStatement,
          env,
          this
        );

      case statement.BreakStatement:
        return this.breakEvaluator.evaluate(
          node as statement.BreakStatement,
          env,
          this
        );

      case statement.ContinueStatement:
        return this.continueEvaluator.evaluate(
          node as statement.ContinueStatement,
          env,
          this
        );

      case statement.ExpressionStatement:
        return this.expressionEvaluator.evaluate(
          node as statement.ExpressionStatement,
          env,
          this
        );

      // Expressions
      case expression.CallExpression:
        return this.callEvaluator.evaluate(
          node as expression.CallExpression,
          env,
          this
        );

      case expression.IfExpression:
        return this.ifEvaluator.evaluate(
          node as expression.IfExpression,
          env,
          this
        );

      case expression.PrefixExpression:
        return this.prefixEvaluator.evaluate(
          node as expression.PrefixExpression,
          env,
          this
        );

      case expression.InfixExpression:
        return this.infixEvaluator.evaluate(
          node as expression.InfixExpression,
          env,
          this
        );

      case expression.AssignmentExpression:
        return this.assignmentEvaluator.evaluate(
          node as expression.AssignmentExpression,
          env,
          this
        );

      case expression.IndexExpression:
        return this.indexEvaluator.evaluate(
          node as expression.IndexExpression,
          env,
          this
        );

      case expression.BooleanExpression:
        return this.booleanEvaluator.evaluate(
          node as expression.BooleanExpression,
          env,
          this
        );

      // Literals
      case literal.StringLiteral:
        return this.stringEvaluator.evaluate(
          node as literal.StringLiteral,
          env,
          this
        );

      case literal.IntegerLiteral:
        return this.integerEvaluator.evaluate(
          node as literal.IntegerLiteral,
          env,
          this
        );

      case literal.ArrayLiteral:
        return this.arrayEvaluator.evaluate(
          node as literal.ArrayLiteral,
          env,
          this
        );

      case literal.HashLiteral:
        return this.hashEvaluator.evaluate(
          node as literal.HashLiteral,
          env,
          this
        );

      case literal.FunctionLiteral:
        return this.functionEvaluator.evaluate(
          node as literal.FunctionLiteral,
          env,
          this
        );

      case literal.NullLiteral:
        return this.nullEvaluator.evaluate(
          node as literal.NullLiteral,
          env,
          this
        );

      case literal.FStringLiteral:
        return this.fstringEvaluator.evaluate(
          node as literal.FStringLiteral,
          env,
          this
        );

      // Special case for Identifier (from ast.ts)
      case ast.Identifier:
        return this.identifierEvaluator.evaluate(
          node as ast.Identifier,
          env,
          this
        );

      default:
        return new ErrorObject(
          `No evaluator found for node type: ${node.constructor.name}`
        );
    }
  }

  /**
   * 🚀 Public entry point for evaluating programs
   */
  public evaluateProgram(program: ast.Program, env: Environment): BaseObject {
    this.addOutput("Program execution started", "log");
    let result: BaseObject = NullObject.INSTANCE;

    for (const stmt of program.getStatements()) {
      result = this.evaluate(stmt, env);

      if (ObjectValidator.isReturnValue(result)) {
        this.addOutput(
          `Program returned: ${(result as ReturnValueObject).value.inspect()}`,
          "return"
        );
        this.markExecutionComplete();
        return (result as ReturnValueObject).value;
      }
      if (ObjectValidator.isError(result)) {
        this.addOutput(`Program error: ${result.message}`, "error");
        this.markExecutionComplete();
        return result;
      }
    }

    this.addOutput("Program execution completed", "log");
    this.markExecutionComplete();
    return result;
  }

  /**
   * 🔄 **Before Step - Before Spotter**
   *
   * Adds a before step to the evaluation context
   *
   */
  addBeforeStep(node: ast.Node, env: Environment, description: string): void {
    this.addStep(node, env, description, "Before");
  }

  /**
   * 🔄 **After Step - After Spotter**
   *
   * Adds an after step to the evaluation context
   *
   */
  addAfterStep(
    node: ast.Node,
    env: Environment,
    result: BaseObject,
    description?: string
  ): void {
    this.addStep(
      node,
      env,
      description || `Completed: ${result.inspect()}`,
      "After",
      result
    );
  }

  /**
   * 🔄 **During Step - During Spotter**
   *
   * Adds a during step to the evaluation context
   *
   */
  addDuringStep(
    node: ast.Node,
    env: Environment,
    description: string,
    data?: unknown
  ): void {
    this.addStep(node, env, description, "During", undefined, data);
  }

  /**
   * 🔄 **Step - Step Spotter**
   *
   * Adds a step to the evaluation context
   *
   */
  addStep(
    node: ast.Node,
    env: Environment,
    description: string,
    stepType: StepType,
    result?: BaseObject,
    customData?: unknown
  ): void {
    if (!this.stepStorage) return; // No-op if step storage not provided

    const enrichedStep = {
      node,
      env,
      description,
      stepType,
      result,
      customData,
      timestamp: Date.now(),
      evaluationPath: this.getCurrentEvaluationPath(),
      evaluationDepth: this.getEvaluationDepth(),
    };

    this.stepStorage.addStep(enrichedStep);
  }

  /**
   * 🔄 **Current Evaluation Path**
   *
   * Gets the current evaluation path
   *
   */
  getCurrentEvaluationPath(): string {
    return this.evaluationStack.join(" → ");
  }

  /**
   * 🔄 **Evaluation Depth**
   *
   * Gets the current evaluation depth
   *
   */
  getEvaluationDepth(): number {
    return this.evaluationDepth;
  }

  /**
   * 🔄 **Push Call Stack**
   *
   * Pushes a call stack frame to the evaluation context
   *
   */
  pushCallStack(
    functionName: string,
    args: BaseObject[],
    node: ast.Node
  ): void {
    if (!this.stepStorage) return;

    const { line, column } = node.position();
    const frame: CallStackFrame = {
      functionName,
      args: args.map((arg) => arg.inspect()),
      startLine: line,
      startColumn: column,
      isActive: true,
    };

    this.stepStorage.pushCallStack(frame);
  }

  /**
   * 🔄 **Pop Call Stack**
   *
   * Pops a call stack frame from the evaluation context
   *
   */
  popCallStack(returnValue?: BaseObject): void {
    if (!this.stepStorage) return;

    const frame = this.stepStorage.popCallStack();
    if (frame && returnValue) {
      // Update the frame with return value before it's fully removed
      frame.returnValue = returnValue.inspect();
    }
  }

  addOutput(value: string, type: OutputEntry["type"]): void {
    if (!this.stepStorage) return;

    const output: OutputEntry = {
      value,
      type,
      timestamp: Date.now(),
      stepNumber: 0, // Will be set by storage
    };

    this.stepStorage.addOutput(output);
  }

  getCurrentExecutionState(): ExecutionState {
    if (!this.stepStorage) {
      return new ExecutionState();
    }
    return this.stepStorage.getExecutionState();
  }

  isExecutionComplete(): boolean {
    return this.executionComplete;
  }

  markExecutionComplete(): void {
    this.executionComplete = true;
    if (this.stepStorage) {
      this.stepStorage.updateExecutionState({ isComplete: true });
    }
  }

  enterFunction(
    functionName: string,
    position: Position,
    frameType: FrameType
  ): void {
    if (!this.callStack) return;
    const frame = new StackFrame(functionName, position, frameType);
    this.callStack.push(frame);
  }

  exitFunction(): void {
    if (!this.callStack) return;
    this.callStack.pop();
  }

  /**
   * 🔴 Creates an error object with source context and stack trace
   */
  createError(message: string, position: Position): ErrorObject {
    const sourceContext = this.extractSourceContext(position);

    if (this.callStack) {
      return ErrorObject.withStackTrace(
        message,
        this.callStack,
        position,
        sourceContext
      );
    } else {
      return new ErrorObject(message, position, null, sourceContext);
    }
  }

  /**
   * 📝 Extracts source context around the error position
   * Get the one line above and one line below the text
   */
  private extractSourceContext(position: Position): string | null {
    if (!this.readonlysourceLines || !position) {
      return null;
    }

    const line = position.line;
    const column = position.column;

    if (line < 1 || line > this.readonlysourceLines.length) {
      return null;
    }

    const context: string[] = [];

    const startLine = Math.max(1, line - 1);
    const endLine = Math.min(this.readonlysourceLines.length, line + 1);

    // Calculate the maximum width needed for the box
    const maxLineNumWidth = endLine.toString().length;
    let maxContentWidth = 0;

    // First pass: calculate max content width
    for (let i = startLine; i <= endLine; i++) {
      const lineContent = this.readonlysourceLines[i - 1];
      const contentWidth = `  ${i
        .toString()
        .padStart(maxLineNumWidth, " ")}  ${lineContent}`.length;
      maxContentWidth = Math.max(maxContentWidth, contentWidth);
    }

    // Ensure minimum width for the box
    maxContentWidth = Math.max(maxContentWidth, 50);

    // Top border
    context.push(`┌${"─".repeat(maxContentWidth + 2)}┐\n`);
    context.push(`│ ${"Source Context".padEnd(maxContentWidth + 1)}│\n`);
    context.push(`├${"─".repeat(maxContentWidth + 2)}┤\n`);

    for (let i = startLine; i <= endLine; i++) {
      const lineContent = this.readonlysourceLines[i - 1];
      const lineNumStr = i.toString().padStart(maxLineNumWidth, " ");

      if (i === line) {
        // Error line with arrow
        const content = ` → ${lineNumStr}  ${lineContent}`;
        context.push(`│ ${content.padEnd(maxContentWidth + 1)}│\n`);

        // Add pointer line if column is specified
        if (column > 0) {
          let pointer = "   ";
          pointer += " ".repeat(maxLineNumWidth);
          pointer += "  ";
          pointer += " ".repeat(column - 1);
          pointer += "^";
          context.push(`│ ${pointer.padEnd(maxContentWidth + 1)}│\n`);
        }
      } else {
        // Regular context line
        const content = `   ${lineNumStr}  ${lineContent}`;
        context.push(`│ ${content.padEnd(maxContentWidth + 1)}│\n`);
      }
    }

    // Bottom border
    context.push(`└${"─".repeat(maxContentWidth + 2)}┘\n`);

    return context.join("");
  }
}
