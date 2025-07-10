import * as ast from "../../ast/ast.ts";
import * as statement from "../../ast/statement.ts";
import * as expression from "../../ast/expression.ts";
import * as literal from "../../ast/literal.ts";
import { ObjectValidator } from "./validate";
import * as objects from "../objects/index.ts";
import { truthy } from "./utils";
import { evalIdentifier, evaluateInfix } from "./expression";
import { evalLogicalNotOperator, evalNegationOperator } from "./operator";

const validate = ObjectValidator;

/**
 * Evaluator class
 *
 * This class is responsible for evaluating the Abstract Syntax Tree (AST)
 * generated from the parsed code. It interprets the AST and executes the program,
 * producing the final output.
 *
 * Key features:
 * - Evaluates various types of expressions and statements
 * - Handles arithmetic and logical operations
 * - Supports function calls and closures
 * - Implements control flow (if-else statements)
 * - Manages variable assignments and scoping
 */
export default class Evaluator {
  protected readonly TRUE = new objects.BooleanObject(true);
  private readonly FALSE = new objects.BooleanObject(false);
  protected readonly NULL = new objects.NullObject();
  private readonly BREAK = new objects.BreakObject();
  private readonly CONTINUE = new objects.ContinueObject();
  protected loopDepth: number = 0;

  protected readonly MAX_ITERATIONS: number = 1000000;

  public evaluate(
    node: ast.Node,
    env: objects.Environment
  ): objects.BaseObject {
    switch (node.constructor) {
      case ast.Program:
        return this.evalProgram(node as ast.Program, env);

      case statement.BlockStatement:
        return this.evalBlockStatement(node as statement.BlockStatement, env);

      case statement.LetStatement:
        return this.evalLetStatement(node as statement.LetStatement, env);

      case statement.ReturnStatement:
        return this.evalReturnStatement(node as statement.ReturnStatement, env);

      case statement.ExpressionStatement:
        return this.evaluate(
          (node as statement.ExpressionStatement).expression,
          env
        );

      case statement.WhileStatement:
        return this.evaluateWhileStatement(
          node as statement.WhileStatement,
          env
        );

      case statement.ConstStatement:
        return this.evalConstStatement(node as statement.ConstStatement, env);

      case statement.ForStatement:
        return this.evalForStatement(node as statement.ForStatement, env);

      case statement.BreakStatement:
        return this.BREAK;

      case statement.ContinueStatement:
        return this.CONTINUE;

      case expression.PrefixExpression:
        return this.evalPrefixExpression(
          node as expression.PrefixExpression,
          env
        );

      case expression.InfixExpression:
        return this.evalInfixExpression(
          node as expression.InfixExpression,
          env
        );

      case expression.IfExpression:
        return this.evalIfExpression(node as expression.IfExpression, env);

      case expression.CallExpression:
        return this.evalCallExpression(node as expression.CallExpression, env);

      case expression.IndexExpression:
        return this.evalIndexExpression(
          node as expression.IndexExpression,
          env
        );

      case expression.BooleanExpression:
        return this.toBool((node as expression.BooleanExpression).value);

      case expression.AssignmentExpression:
        return this.evalAssignmentExpression(
          node as expression.AssignmentExpression,
          env
        );

      case ast.Identifier:
        return evalIdentifier(node as ast.Identifier, env);

      case literal.FunctionLiteral:
        return this.evalFunctionLiteral(node as literal.FunctionLiteral, env);

      case literal.ArrayLiteral:
        return this.evalArrayLiteral(node as literal.ArrayLiteral, env);

      case literal.IntegerLiteral:
        return new objects.IntegerObject(
          (node as literal.IntegerLiteral).value
        );

      case literal.StringLiteral:
        return new objects.StringObject((node as literal.StringLiteral).value);

      default:
        return new objects.ErrorObject(
          `Unknown node type: ${node.constructor.name}`
        );
    }
  }

  private evalProgram(
    program: ast.Program,
    env: objects.Environment
  ): objects.BaseObject {
    let result: objects.BaseObject = this.NULL;

    for (const statement of program.statements) {
      result = this.evaluate(statement, env);

      if (result instanceof objects.ReturnValueObject) return result.value;
      else if (result instanceof objects.ErrorObject) return result;
    }

    return result;
  }

  private evalBlockStatement(
    block: statement.BlockStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const blockEnv = env.newBlockScope();
    let result: objects.BaseObject = this.NULL;

    for (const statement of block.statements) {
      result = this.evaluate(statement, blockEnv);

      if (
        ObjectValidator.isReturnValue(result) ||
        ObjectValidator.isError(result) ||
        ObjectValidator.isBreak(result) ||
        ObjectValidator.isContinue(result)
      )
        return result;
    }

    console.log(objects.FunctionObject.dumpScopeChain(blockEnv));
    return result;
  }

  private evalPrefixExpression(
    node: expression.PrefixExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const right = this.evaluate(node.right, env);

    if (right instanceof objects.ErrorObject) return right;

    switch (node.operator) {
      case "!":
        return evalLogicalNotOperator(right);

      case "-":
        return evalNegationOperator(right);

      default:
        return new objects.ErrorObject(`Unknown operator: ${node.operator}`);
    }
  }

  private evalInfixExpression(
    node: expression.InfixExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const left = this.evaluate(node.left, env);
    if (validate.isError(left)) return left;

    const right = this.evaluate(node.right, env);
    if (validate.isError(right)) return right;

    return evaluateInfix(left, right, node.operator);
  }

  private evalIfExpression(
    ifExp: expression.IfExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const conditions = ifExp.conditions.length;
    for (let i = 0; i < conditions; i++) {
      const condition = this.evaluate(ifExp.conditions[i], env);
      if (ObjectValidator.isError(condition)) return condition;

      const isTruthy = truthy(condition);
      if (isTruthy) return this.evaluate(ifExp.consequences[i], env);
    }

    if (ifExp.alternative !== null)
      return this.evaluate(ifExp.alternative, env);

    return this.NULL;
  }

  private evalReturnStatement(
    rs: statement.ReturnStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const value = this.evaluate(rs.returnValue, env);
    if (validate.isError(value)) return value;

    return new objects.ReturnValueObject(value);
  }

  private evalLetStatement(
    ls: statement.LetStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const identifier = ls.name.value;
    if (env.has(identifier))
      return err(`Identifier ${identifier} already declared`);

    const value = this.evaluate(ls.value, env);
    if (value instanceof objects.ErrorObject) return value;

    env.set(identifier, value);
    return value;
  }

  private evalConstStatement(
    node: statement.ConstStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const identifier = node.name.value;
    if (env.has(identifier))
      return err(`Identifier "${identifier}" already declared`);

    const value = this.evaluate(node.value, env);
    if (validate.isError(value)) return value;

    env.setConst(identifier, value);
    return value;
  }

  private evaluateWhileStatement(
    ws: statement.WhileStatement,
    env: objects.Environment
  ): objects.BaseObject {
    let result: objects.BaseObject = this.NULL;
    let loopCount = 0;
    this.loopDepth++;

    try {
      while (true) {
        const condition = this.evaluate(ws.condition, env);
        if (validate.isError(condition)) {
          return condition;
        }

        if (!truthy(condition)) break;

        result = this.evalBlockStatement(ws.body, env);

        if (validate.isError(result)) {
          return result;
        }

        if (validate.isReturnValue(result)) {
          return result;
        }

        if (validate.isBreak(result)) break;
        if (validate.isContinue(result)) continue;

        loopCount++;
        if (loopCount > this.MAX_ITERATIONS) {
          return new objects.ErrorObject("Loop limit exceeded");
        }
      }
    } finally {
      this.loopDepth--;
    }

    return this.processLoopResult(result);
  }

  private evalForStatement(
    forLoop: statement.ForStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const loopEnv = new objects.Environment(env);
    const initResult = this.evaluate(forLoop.initializer, loopEnv);
    if (validate.isError(initResult)) return initResult;

    let result: objects.BaseObject = this.NULL;
    let loopCount = 0;
    this.loopDepth++;

    try {
      while (true) {
        const condition = this.evaluate(forLoop.condition, loopEnv);
        if (validate.isError(condition)) {
          return condition;
        }

        if (!truthy(condition)) break;

        result = this.evaluate(forLoop.body, loopEnv);

        if (validate.isReturnValue(result) || validate.isError(result)) {
          return result;
        }

        if (validate.isBreak(result)) break;

        // 🔧 CRITICAL FIX: Execute increment BEFORE continue check
        const incrementResult = this.evaluate(forLoop.increment, loopEnv);
        if (validate.isError(incrementResult)) {
          return incrementResult;
        }

        // Now handle continue (after increment has executed)
        if (validate.isContinue(result)) continue;

        loopCount++;
        if (loopCount > this.MAX_ITERATIONS) {
          return new objects.ErrorObject("Loop limit exceeded");
        }
      }
    } finally {
      // 🔧 FIX: Always cleanup loop depth
      this.loopDepth--;
    }

    return this.processLoopResult(result);
  }

  private evalFunctionLiteral(
    node: literal.FunctionLiteral,
    env: objects.Environment
  ): objects.BaseObject {
    const params = node.parameters;
    const body = node.body;

    return new objects.FunctionObject(params, body, env);
  }

  private evalArrayLiteral(
    node: literal.ArrayLiteral,
    env: objects.Environment
  ): objects.BaseObject {
    const elements = this.evalExpressions(node.elements, env);
    if (elements.length === 1 && validate.isError(elements[0]))
      return elements[0];

    return new objects.ArrayObject(elements);
  }

  private evalCallExpression(
    ce: expression.CallExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const functionObj = this.evaluate(ce.func, env);
    if (validate.isError(functionObj)) return functionObj;

    const args = this.evalExpressions(ce.args, env);
    if (args.length === 1 && validate.isError(args[0])) return args[0];

    return this.applyFunction(functionObj, args);
  }

  private evalIndexExpression(
    node: expression.IndexExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const left = this.evaluate(node.left, env);
    if (validate.isError(left)) return left;

    const index = this.evaluate(node.index, env);
    if (validate.isError(index)) return index;

    console.log("left", left);
    console.log("index", index);

    if (validate.isArray(left))
      return this.evalArrayIndexExpression(left, index);
    else if (validate.isHash(left))
      return this.evalHashIndexExpression(left, index);

    return new objects.ErrorObject(
      `Index operator not supported: ${left.type()}`
    );
  }

  /**
   * Evaluates an array index expression
   *
   * @param left - The array object
   * @param index - The index object
   * @returns The value at the specified index in the array
   *
   * @example
   * // This method is called internally by evalIndexExpression
   * // e.g., when evaluating arr[1], where arr is [1, 2, 3]
   */
  private evalArrayIndexExpression(
    left: objects.ArrayObject,
    index: objects.BaseObject
  ): objects.BaseObject {
    const idx = (index as objects.IntegerObject).value;
    const max = left.elements.length;

    if (idx < 0 || idx >= max)
      return new objects.ErrorObject("Index out of bounds");

    return left.elements[idx];
  }

  /**
   * Evaluates a hash index expression
   *
   * @param hash - The hash object
   * @param index - The index object
   * @returns The value associated with the specified key in the hash
   *
   * @example
   * // This method is called internally by evalIndexExpression
   * // e.g., when evaluating hash["key"], where hash is {"key": 42}
   */
  private evalHashIndexExpression(
    hash: objects.HashObject,
    index: objects.BaseObject
  ): objects.BaseObject {
    const isHashable = validate.isString(index) || validate.isInteger(index);
    if (!isHashable)
      return new objects.ErrorObject("Index must be a string or an integer");

    const value = hash.pairs.get(index.inspect());

    console.log("value", value);
    if (!value) return this.NULL;

    return value;
  }

  /**
   * Evaluates a list of expressions
   *
   * @param args - The list of expression nodes
   * @param env - The current environment
   * @returns An array of evaluated objects
   *
   * @example
   * // This method is used internally, e.g., when evaluating function arguments
   * const expressions = [
   *   new literal.IntegerLiteral(1),
   *   new literal.StringLiteral("hello"),
   *   new ast.Identifier("x")
   * ];
   * const results = evaluator.evalExpressions(expressions, environment);
   * // results will contain the evaluated objects for each expression
   */
  private evalExpressions(
    args: ast.Expression[],
    env: objects.Environment
  ): objects.BaseObject[] {
    const result: objects.BaseObject[] = [];

    for (const arg of args) {
      const evaluated = this.evaluate(arg, env);
      if (validate.isError(evaluated)) return [evaluated];

      result.push(evaluated);
    }

    return result;
  }

  private evalAssignmentExpression(
    node: expression.AssignmentExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const name = node.name.value;
    const definingScope = env.getDefiningScope(name);

    if (!definingScope)
      return err(`Cannot assign to undeclared variable '${name}'.`);

    if (definingScope.isConstant(name))
      return err(`Cannot assign to constant variable '${name}'.`);

    const value = this.evaluate(node.value, env);
    if (validate.isError(value)) return value;
    return definingScope.set(name, value);
  }

  protected applyFunction(
    fn: objects.BaseObject,
    args: objects.BaseObject[]
  ): objects.BaseObject {
    if (validate.isBuiltin(fn)) {
      console.log(fn.fn(args));
      return fn.fn(args);
    }

    if (!validate.isFunction(fn)) {
      console.log(fn.type());
      return new objects.ErrorObject(`Not a function: ${fn.type()}`);
    }

    const extendFunctionEnv = () => {
      const env = new objects.Environment(fn.env);

      for (let i = 0; i < fn.parameters.length; i++) {
        env.set(fn.parameters[i].value, args[i]);
      }

      return env;
    };

    const extendedEnv = extendFunctionEnv();
    const evaluated = this.evaluate(fn.body, extendedEnv);
    if (validate.isError(evaluated)) return evaluated;

    return this.unWrapReturnValue(evaluated);
  }

  private unWrapReturnValue(obj: objects.BaseObject): objects.BaseObject {
    if (validate.isReturnValue(obj))
      return (obj as objects.ReturnValueObject).value;
    return obj;
  }

  private toBool(res: boolean): objects.BooleanObject {
    return res ? this.TRUE : this.FALSE;
  }

  protected processLoopResult(result: objects.BaseObject): objects.BaseObject {
    if (validate.isBreak(result)) return this.NULL;
    if (validate.isContinue(result)) return this.NULL;
    return result;
  }
}

/**
 * Creates an ErrorObject with the given message.
 * @param {string} message - The error message.
 * @returns {objects.ErrorObject} An ErrorObject with the specified message.
 */
function err(message: string): objects.ErrorObject {
  return new objects.ErrorObject(message);
}
