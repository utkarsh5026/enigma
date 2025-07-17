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
import { StepStorage, StepType } from "../steps/step-info";
import { DefaultStepStorage } from "../steps/step-storage";

export class LanguageEvaluator implements EvaluationContext {
  private loopContext: LoopContext;
  private evaluationStack: string[] = [];
  private evaluationDepth: number = 0;
  private readonly stepStorage?: StepStorage;

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

  constructor(stepStorage?: StepStorage) {
    this.loopContext = new LoopContext(0);
    this.whileEvaluator = new statements.WhileStatementEvaluator(
      this.loopContext
    );
    this.forEvaluator = new statements.ForStatementEvaluator(this.loopContext);
    this.stepStorage = stepStorage || new DefaultStepStorage();
  }

  public getStepStorage(): StepStorage | undefined {
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
    let result: BaseObject = NullObject.INSTANCE;

    for (const stmt of program.getStatements()) {
      result = this.evaluate(stmt, env);

      if (ObjectValidator.isReturnValue(result)) {
        return (result as ReturnValueObject).value;
      }
      if (ObjectValidator.isError(result)) {
        return result;
      }
    }

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

  getCurrentEvaluationPath(): string {
    return this.evaluationStack.join(" → ");
  }

  getEvaluationDepth(): number {
    return this.evaluationDepth;
  }
}
