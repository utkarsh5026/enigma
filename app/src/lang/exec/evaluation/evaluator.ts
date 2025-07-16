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
import { ObjectValidator } from "./validate";

export class LanguageEvaluator implements EvaluationContext {
  private loopContext: LoopContext;

  // Individual evaluator instances
  private letEvaluator = new statements.LetEvaluator();
  private constEvaluator = new statements.ConstEvaluator();
  private returnEvaluator = new statements.ReturnStatementEvaluator();
  private blockEvaluator = new statements.BlockEvaluator();
  private whileEvaluator: statements.WhileStatementEvaluator;
  private forEvaluator: statements.ForStatementEvaluator;
  private breakEvaluator = new statements.BreakStatementEvaluator();
  private continueEvaluator = new statements.ContinueStatementEvaluator();

  private callEvaluator = new expressions.CallExpressionEvaluator();
  private ifEvaluator = new expressions.IfExpressionEvaluator();
  private expressionEvaluator = new statements.ExpressionEvaluator();
  private prefixEvaluator = new expressions.PrefixExpressionEvaluator();
  private infixEvaluator = new expressions.InfixExpressionEvaluator();
  private identifierEvaluator = new expressions.IndentifierEvaluator();
  private assignmentEvaluator = new expressions.AssignmentExpressionEvaluator();
  private indexEvaluator = new expressions.IndexExpressionEvaluator();

  private stringEvaluator = new literals.StringLiteralEvaluator();
  private integerEvaluator = new literals.IntegerLiteralEvaluator();
  private booleanEvaluator = new literals.BooleanLiteralEvaluator();
  private arrayEvaluator = new literals.ArrayLiteralEvaluator();
  private hashEvaluator = new literals.HashLiteralEvaluator();
  private functionEvaluator = new literals.FunctionLiteralEvaluator();
  private nullEvaluator = new literals.NullLiteralEvaluator();

  constructor() {
    this.loopContext = new LoopContext(0);
    // Initialize loop-dependent evaluators
    this.whileEvaluator = new statements.WhileStatementEvaluator(
      this.loopContext
    );
    this.forEvaluator = new statements.ForStatementEvaluator(this.loopContext);
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
        return this.breakEvaluator.evaluate();

      case statement.ContinueStatement:
        return this.continueEvaluator.evaluate();

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
          node as expression.BooleanExpression
        );

      // Literals
      case literal.StringLiteral:
        return this.stringEvaluator.evaluate(node as literal.StringLiteral);

      case literal.IntegerLiteral:
        return this.integerEvaluator.evaluate(node as literal.IntegerLiteral);

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
          env
        );

      case literal.NullLiteral:
        return this.nullEvaluator.evaluate();

      // Special case for Identifier (from ast.ts)
      case ast.Identifier:
        return this.identifierEvaluator.evaluate(node as ast.Identifier, env);

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
}
