import { EvaluationContext, LoopContext } from "../core";
import * as statements from "./statements";
import * as expressions from "./expressions";
import * as literals from "./literals";
import * as ast from "@/lang/ast/ast";
import * as statement from "@/lang/ast/statements";
import * as expression from "@/lang/ast/expressions";
import * as literal from "@/lang/ast/literals";
import { ErrorObject, NullObject, ReturnValueObject } from "../objects";
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
import { ObjectValidator, Environment, BaseObject } from "../core";
import { ClassStatement } from "@/lang/ast";

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
  private readonly classEvaluator = new statements.ClassStatementEvaluator();

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
  private readonly floatEvaluator = new literals.FloatLiteralEvaluator();
  private readonly newEvaluator = new expressions.NewExpressionEvaluator();
  private readonly superEvaluator = new expressions.SuperExpressionEvaluator();
  private readonly thisEvaluator = new expressions.ThisExpressionEvaluator();
  private readonly propertyEvaluator =
    new expressions.PropertyExpressionEvaluator();

  constructor(
    enableStackTraces: boolean,
    sourceLines?: string[],
    stepStorage?: StepStorage
  ) {
    this.loopContext = new LoopContext(0);
    this.whileEvaluator = new statements.WhileStatementEvaluator(
      this.loopContext
    );
    this.forEvaluator = new statements.ForStatementEvaluator(this.loopContext);
    this.stepStorage = stepStorage || new DefaultStepStorage();
    this.callStack = enableStackTraces ? new CallStack() : null;
    this.readonlysourceLines = sourceLines || [];
  }

  public static withSourceCode(sourceCode: string, enableStackTraces: boolean) {
    const lines = sourceCode.split(/\r?\n|\r/);
    return new LanguageEvaluator(enableStackTraces, lines);
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
      return this.createError("Cannot evaluate null node", {
        line: 0,
        column: 0,
      });
    }

    this.addDuringStep(
      node,
      env,
      `Evaluating ${node.whatIam().name} '${node.toString()}'`
    );

    let result: BaseObject;

    switch (node.constructor) {
      case statement.LetStatement:
        result = this.letEvaluator.evaluate(
          node as statement.LetStatement,
          env,
          this
        );
        break;

      case statement.ConstStatement:
        result = this.constEvaluator.evaluate(
          node as statement.ConstStatement,
          env,
          this
        );
        break;

      case statement.ReturnStatement:
        result = this.returnEvaluator.evaluate(
          node as statement.ReturnStatement,
          env,
          this
        );
        break;

      case statement.BlockStatement:
        result = this.blockEvaluator.evaluate(
          node as statement.BlockStatement,
          env,
          this
        );
        break;

      case statement.WhileStatement:
        result = this.whileEvaluator.evaluate(
          node as statement.WhileStatement,
          env,
          this
        );
        break;

      case statement.ForStatement:
        result = this.forEvaluator.evaluate(
          node as statement.ForStatement,
          env,
          this
        );
        break;

      case statement.BreakStatement:
        result = this.breakEvaluator.evaluate();
        break;

      case statement.ContinueStatement:
        result = this.continueEvaluator.evaluate();
        break;

      case statement.ExpressionStatement:
        result = this.expressionEvaluator.evaluate(
          node as statement.ExpressionStatement,
          env,
          this
        );
        break;

      // Expressions
      case expression.CallExpression:
        result = this.callEvaluator.evaluate(
          node as expression.CallExpression,
          env,
          this
        );
        break;

      case expression.IfExpression:
        result = this.ifEvaluator.evaluate(
          node as expression.IfExpression,
          env,
          this
        );
        break;

      case expression.PrefixExpression:
        result = this.prefixEvaluator.evaluate(
          node as expression.PrefixExpression,
          env,
          this
        );
        break;

      case expression.InfixExpression:
        result = this.infixEvaluator.evaluate(
          node as expression.InfixExpression,
          env,
          this
        );
        break;

      case expression.AssignmentExpression:
        result = this.assignmentEvaluator.evaluate(
          node as expression.AssignmentExpression,
          env,
          this
        );
        break;

      case expression.IndexExpression:
        result = this.indexEvaluator.evaluate(
          node as expression.IndexExpression,
          env,
          this
        );
        break;

      case literal.BooleanLiteral:
        result = this.booleanEvaluator.evaluate(node as literal.BooleanLiteral);
        break;

      // Literals
      case literal.StringLiteral:
        result = this.stringEvaluator.evaluate(node as literal.StringLiteral);
        break;

      case literal.IntegerLiteral:
        result = this.integerEvaluator.evaluate(node as literal.IntegerLiteral);
        break;

      case literal.ArrayLiteral:
        result = this.arrayEvaluator.evaluate(
          node as literal.ArrayLiteral,
          env,
          this
        );
        break;

      case literal.HashLiteral:
        result = this.hashEvaluator.evaluate(
          node as literal.HashLiteral,
          env,
          this
        );
        break;

      case literal.FunctionLiteral:
        result = this.functionEvaluator.evaluate(
          node as literal.FunctionLiteral,
          env
        );
        break;

      case literal.NullLiteral:
        result = this.nullEvaluator.evaluate();
        break;

      case literal.FStringLiteral:
        result = this.fstringEvaluator.evaluate(
          node as literal.FStringLiteral,
          env,
          this
        );
        break;

      case literal.FloatLiteral:
        result = this.floatEvaluator.evaluate(node as literal.FloatLiteral);
        break;

      // Special case for Identifier (from ast.ts)
      case expression.Identifier:
        result = this.identifierEvaluator.evaluate(
          node as expression.Identifier,
          env,
          this
        );
        break;

      case expression.NewExpression:
        result = this.newEvaluator.evaluate(
          node as expression.NewExpression,
          env,
          this
        );
        break;

      case expression.SuperExpression:
        result = this.superEvaluator.evaluate(
          node as expression.SuperExpression,
          env,
          this
        );
        break;

      case expression.ThisExpression:
        result = this.thisEvaluator.evaluate(
          node as expression.ThisExpression,
          env,
          this
        );
        break;

      case expression.PropertyExpression:
        result = this.propertyEvaluator.evaluate(
          node as expression.PropertyExpression,
          env,
          this
        );
        break;

      case ClassStatement:
        result = this.classEvaluator.evaluate(
          node as ClassStatement,
          env,
          this
        );
        break;

      default:
        result = this.createError(
          `No evaluator found for node type: ${node.constructor.name}`,
          node.position()
        );
    }

    if (node instanceof ast.Expression) {
      this.addAfterStep(
        node,
        env,
        result,
        `Evaluated ${node.whatIam().name} '${result.inspect()}'`
      );
    }
    return result;
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

    // Constants for width management
    const MAX_DISPLAY_WIDTH = 100; // Maximum total display width
    const ELLIPSIS = "...";
    const maxLineNumWidth = endLine.toString().length;
    const prefixWidth = maxLineNumWidth + 6; // "123 | " or "123 → "
    const maxTextWidth = MAX_DISPLAY_WIDTH - prefixWidth;

    /**
     * Truncates a line of text intelligently based on error position
     */
    const truncateLine = (
      text: string,
      errorColumn?: number
    ): { content: string; adjustedColumn: number } => {
      if (text.length <= maxTextWidth) {
        return { content: text, adjustedColumn: errorColumn || 0 };
      }

      // If we have an error column, try to center the view around it
      if (errorColumn && errorColumn > 0) {
        const halfWidth = Math.floor(maxTextWidth / 2);
        let start = Math.max(0, errorColumn - halfWidth);
        const end = Math.min(
          text.length,
          start + maxTextWidth - ELLIPSIS.length
        );

        // Adjust start if we're near the end
        if (end - start < maxTextWidth - ELLIPSIS.length) {
          start = Math.max(0, end - maxTextWidth + ELLIPSIS.length);
        }

        let truncated = text.substring(start, end);
        let adjustedColumn = errorColumn - start;

        // Add ellipsis indicators
        if (start > 0) {
          truncated = ELLIPSIS + truncated;
          adjustedColumn += ELLIPSIS.length;
        }
        if (end < text.length) {
          truncated = truncated + ELLIPSIS;
        }

        return { content: truncated, adjustedColumn };
      } else {
        // No error column, just truncate from the start
        const truncated =
          text.substring(0, maxTextWidth - ELLIPSIS.length) + ELLIPSIS;
        return { content: truncated, adjustedColumn: 0 };
      }
    };

    // Header with context information
    context.push(`\n🔍 Source Context (line ${line}, column ${column}):\n\n`);

    for (let i = startLine; i <= endLine; i++) {
      const lineContent = this.readonlysourceLines[i - 1];
      const lineNumStr = i.toString().padStart(maxLineNumWidth, " ");

      if (i === line) {
        // Error line with arrow
        const { content: truncatedContent, adjustedColumn } = truncateLine(
          lineContent,
          column
        );

        context.push(`  ${lineNumStr} → ${truncatedContent}\n`);

        // Add pointer line if column is specified and within visible range
        if (
          column > 0 &&
          adjustedColumn > 0 &&
          adjustedColumn <= truncatedContent.length
        ) {
          const spaces = " ".repeat(maxLineNumWidth + 3 + adjustedColumn - 1);
          context.push(`  ${spaces}^ Error occurred here\n`);
        }
      } else {
        // Regular context line
        const { content: truncatedContent } = truncateLine(lineContent);
        const lineIndicator = i < line ? "↑" : "↓";
        context.push(`  ${lineNumStr} ${lineIndicator} ${truncatedContent}\n`);
      }
    }

    context.push(`\n`);

    return context.join("");
  }
}
