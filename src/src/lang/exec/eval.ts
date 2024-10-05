import * as ast from "../ast/ast.ts";
import * as objects from "./objects.ts";
import { ErrorObject } from "./objects.ts";
import { ObjectType } from "./type.ts";
import * as statement from "../ast/statement.ts";
import * as expression from "../ast/expression.ts";
import * as literal from "../ast/literal.ts";
import * as utils from "./utils.ts";

const MAX_ITERATIONS = 1000000;
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
  private readonly TRUE = new objects.BooleanObject(true);
  private readonly FALSE = new objects.BooleanObject(false);
  private readonly NULL = new objects.NullObject();
  private readonly BREAK = new objects.BreakObject();
  private readonly CONTINUE = new objects.ContinueObject();
  private loopDepth: number = 0;

  /**
   * Evaluates an AST node
   *
   * This is the primary method that evaluates any AST node. It uses a switch
   * statement to determine the type of node and calls the appropriate evaluation method.
   *
   * @param node - The AST node to evaluate
   * @param env - The current environment (scope)
   * @returns The result of the evaluation as a BaseObject
   *
   * @example
   * const evaluator = new Evaluator();
   * const result = evaluator.evaluate(astNode, environment);
   * console.log(result.inspect()); // Outputs the result
   */
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
        return this.evalIdentifier(node as ast.Identifier, env);

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

  /**
   * Evaluates a program (the root of the AST)
   *
   * @param program - The program node
   * @param env - The current environment
   * @returns The result of the last statement in the program
   *
   * @example
   * const programNode = new ast.Program([
   *   new statement.LetStatement(new ast.Identifier("x"),
   *   new literal.IntegerLiteral(5)),
   *   new statement.ReturnStatement(new ast.Identifier("x"))
   * ]);
   * const result = evaluator.evaluate(programNode, environment);
   * console.log(result.inspect()); // Outputs: 5
   */
  private evalProgram(
    program: ast.Program,
    env: objects.Environment
  ): objects.BaseObject {
    let result: objects.BaseObject = this.NULL;

    for (const statement of program.statements) {
      result = this.evaluate(statement, env);

      if (result instanceof objects.ReturnValue) return result.value;
      else if (result instanceof objects.ErrorObject) return result;
    }

    return result;
  }

  /**
   * Evaluates a block statement
   *
   * @param block - The block statement node
   * @param env - The current environment
   * @returns The result of the last statement in the block
   *
   * @example
   * const blockNode = new statement.BlockStatement([
   *   new statement.LetStatement(new ast.Identifier("y"),
   *   new literal.IntegerLiteral(10)),
   *   new statement.ReturnStatement(new ast.Identifier("y"))
   * ]);
   * const result = evaluator.evaluate(blockNode, environment);
   * console.log(result.inspect()); // Outputs: 10
   */
  private evalBlockStatement(
    block: statement.BlockStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const blockEnv = env.newBlockScope();
    let result: objects.BaseObject = this.NULL;

    for (const statement of block.statements) {
      result = this.evaluate(statement, blockEnv);

      if (
        result instanceof objects.ReturnValue ||
        result instanceof objects.ErrorObject ||
        result instanceof objects.BreakObject ||
        result instanceof objects.ContinueObject
      )
        return result;
    }

    console.log(objects.dumpScopeChain(blockEnv));
    return result;
  }

  /**
   * Evaluates a prefix expression
   *
   * @param node - The prefix expression node
   * @param env - The current environment
   * @returns The result of applying the prefix operator
   *
   * @example
   * // Evaluate !true
   * const notTrue = new expression.PrefixExpression("!",
   * new literal.BooleanLiteral(true));
   * const result1 = evaluator.evaluate(notTrue, environment);
   * console.log(result1.inspect()); // Outputs: false
   *
   * // Evaluate -5
   * const negFive = new expression.PrefixExpression("-", new literal.IntegerLiteral(5));
   * const result2 = evaluator.evaluate(negFive, environment);
   * console.log(result2.inspect()); // Outputs: -5
   */
  private evalPrefixExpression(
    node: expression.PrefixExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const right = this.evaluate(node.right, env);

    if (right instanceof objects.ErrorObject) return right;

    switch (node.operator) {
      case "!":
        return this.evalLogicalNotOperator(right);

      case "-":
        return this.evalNegationOperator(right);

      default:
        return new objects.ErrorObject(`Unknown operator: ${node.operator}`);
    }
  }

  /**
   * Evaluates an infix expression
   *
   * @param node - The infix expression node
   * @param env - The current environment
   * @returns The result of applying the infix operator
   *
   * @example
   * // Evaluate 5 + 3
   * const addExpr = new expression.InfixExpression(
   *   new literal.IntegerLiteral(5),
   *   "+",
   *   new literal.IntegerLiteral(3)
   * );
   * const result = evaluator.evaluate(addExpr, environment);
   * console.log(result.inspect()); // Outputs: 8
   */
  private evalInfixExpression(
    node: expression.InfixExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const left = this.evaluate(node.left, env);
    if (utils.isError(left)) return left;

    const right = this.evaluate(node.right, env);
    if (utils.isError(right)) return right;

    switch (true) {
      case utils.isInteger(left) && utils.isInteger(right):
        return this.evalIntegerInfixExpression(
          left as objects.IntegerObject,
          right as objects.IntegerObject,
          node.operator
        );

      case utils.isString(left) && utils.isString(right):
        return this.evalStringInfixExpression(
          left as objects.StringObject,
          right as objects.StringObject,
          node.operator
        );

      case node.operator === "==":
        return this.toBool(left === right);

      case node.operator === "!=":
        return this.toBool(left !== right);

      case node.operator === "&&":
        return this.evalAndExpression(left, right);

      case node.operator === "||":
        return this.evalOrExpression(left, right);

      default:
        if (left.type() !== right.type()) {
          return new objects.ErrorObject(
            `Type mismatch: ${left.type()} ${node.operator} ${right.type()}`
          );
        }
        return new objects.ErrorObject(
          `Unknown operator: ${left.type()} ${node.operator} ${right.type()}`
        );
    }
  }

  /**
   * Evaluates an infix expression with integer operands
   *
   * @param left - The left operand (integer)
   * @param right - The right operand (integer)
   * @param operator - The operator
   * @returns The result of applying the operator to the operands
   *
   * @example
   * // This method is called internally by evalInfixExpression
   * // e.g., when evaluating 5 + 3, 10 - 7, etc.
   */
  private evalIntegerInfixExpression(
    left: objects.IntegerObject,
    right: objects.IntegerObject,
    operator: string
  ): objects.BaseObject {
    const leftVal = left.value;
    const rightVal = right.value;

    switch (operator) {
      case "+":
        return new objects.IntegerObject(leftVal + rightVal);
      case "-":
        return new objects.IntegerObject(leftVal - rightVal);
      case "*":
        return new objects.IntegerObject(leftVal * rightVal);
      case "/":
        return new objects.IntegerObject(leftVal / rightVal);
      case "%":
        return new objects.IntegerObject(leftVal % rightVal);

      case "<":
        return this.toBool(leftVal < rightVal);
      case ">":
        return this.toBool(leftVal > rightVal);
      case "==":
        return this.toBool(leftVal === rightVal);
      case "!=":
        return this.toBool(leftVal !== rightVal);

      default:
        return new objects.ErrorObject(
          `Unknown operator: ${left.type()} (${operator}) ${right.type()}`
        );
    }
  }

  /**
   * Evaluates an infix expression with string operands
   *
   * @param left - The left operand (string)
   * @param right - The right operand (string)
   * @param operator - The operator
   * @returns The result of applying the operator to the operands
   *
   * @example
   * // This method is called internally by evalInfixExpression
   * // e.g., when evaluating "Hello" + " World"
   */
  private evalStringInfixExpression(
    left: objects.StringObject,
    right: objects.StringObject,
    operator: string
  ): objects.BaseObject {
    if (operator === "+")
      return new objects.StringObject(left.value + right.value);

    return new objects.ErrorObject(
      `Unknown operator: ${left.type()} (${operator}) ${right.type()}`
    );
  }

  /**
   * Evaluates the logical NOT operator
   *
   * @param right - The operand to negate
   * @returns The negated boolean value
   *
   * @example
   * // This method is called internally by evalPrefixExpression
   * // e.g., when evaluating !true, !false, !5, etc.
   */
  private evalLogicalNotOperator(
    right: objects.BaseObject
  ): objects.BaseObject {
    if (right === this.TRUE) return this.FALSE;
    else if (right === this.FALSE) return this.TRUE;
    else if (right === this.NULL) return this.TRUE;
    else return this.FALSE;
  }

  /**
   * Evaluates the negation operator
   *
   * @param right - The operand to negate
   * @returns The negated value
   *
   * @example
   * // This method is called internally by evalPrefixExpression
   * // e.g., when evaluating -5, -x, etc.
   */
  private evalNegationOperator(right: objects.BaseObject): objects.BaseObject {
    if (right.type() !== ObjectType.INTEGER)
      return new objects.ErrorObject(`Unknown operator: -${right.type()}`);

    const intObj = right as objects.IntegerObject;
    return new objects.IntegerObject(intObj.value * -1);
  }

  /**
   * Evaluates an if-else expression
   *
   * @param ifExp - The if-else expression node
   * @param env - The current environment
   * @returns The result of evaluating the appropriate branch
   *
   * @example
   * const ifExpr = new expression.IfExpression(
   *   new literal.BooleanLiteral(true),
   *   new statement.BlockStatement([new statement.ReturnStatement(new literal.IntegerLiteral(1))]),
   *   new statement.BlockStatement([new statement.ReturnStatement(new literal.IntegerLiteral(2))])
   * );
   * const result = evaluator.evaluate(ifExpr, environment);
   * console.log(result.inspect()); // Outputs: 1
   */
  private evalIfExpression(
    ifExp: expression.IfExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const condition = this.evaluate(ifExp.condition, env);
    if (utils.isError(condition)) return condition;

    if (this.truthy(condition)) return this.evaluate(ifExp.consequence, env);
    else if (ifExp.alternative) return this.evaluate(ifExp.alternative, env);

    return this.NULL;
  }

  /**
   * Evaluates a return statement
   *
   * @param rs - The return statement node
   * @param env - The current environment
   * @returns The return value wrapped in a ReturnValue object
   *
   * @example
   * const returnStmt = new statement.ReturnStatement(new literal.IntegerLiteral(42));
   * const result = evaluator.evaluate(returnStmt, environment);
   * console.log(result.inspect()); // Outputs: 42
   */
  private evalReturnStatement(
    rs: statement.ReturnStatement,
    env: objects.Environment
  ): objects.BaseObject {
    const value = this.evaluate(rs.returnValue, env);
    if (utils.isError(value)) return value;

    return new objects.ReturnValue(value);
  }

  /**
   * Evaluates a let statement
   *
   * @param ls - The let statement node
   * @param env - The current environment
   * @returns The value assigned to the variable
   *
   * @example
   * const letStmt = new statement.LetStatement(
   *   new ast.Identifier("z"),
   *   new literal.IntegerLiteral(100)
   * );
   * const result = evaluator.evaluate(letStmt, environment);
   * console.log(result.inspect()); // Outputs: 100
   * console.log(environment.get("z").inspect()); // Outputs: 100
   */
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
      return err(`Identifier ${identifier} already declared`);

    const value = this.evaluate(node.value, env);
    if (value instanceof objects.ErrorObject) return value;

    env.setConst(identifier, value);
    return value;
  }

  /**
   * Evaluates a while statement
   *
   * This method executes a while loop, repeatedly evaluating the condition
   * and executing the body until the condition becomes falsy or a return/break
   * statement is encountered. It also includes a safety check to prevent infinite loops.
   *
   * @param ws - The while statement node
   * @param env - The current environment
   * @returns The result of the last executed statement in the loop body,
   *          or NULL if the loop never executed
   *
   * @example
   * const whileStmt = new statement.WhileStatement(
   *   new BooleanExpression(true),
   *   new statement.BlockStatement([
   *     new statement.ExpressionStatement(new literal.IntegerLiteral(1))
   *   ])
   * );
   * const result = evaluator.evaluateWhileStatement(whileStmt, environment);
   * console.log(result.inspect()); // Outputs: 1 (assuming MAX_ITERATIONS is not reached)
   */
  private evaluateWhileStatement(
    ws: statement.WhileStatement,
    env: objects.Environment
  ): objects.BaseObject {
    let result: objects.BaseObject = this.NULL;
    let loopCount = 0;
    this.loopDepth++;

    while (true) {
      const condition = this.evaluate(ws.condition, env);
      if (utils.isError(condition)) return condition;

      if (!this.truthy(condition)) break;

      result = this.evalBlockStatement(ws.body, env);
      if (utils.isError(result)) return result;

      if (utils.isBreak(result)) break;
      else if (utils.isContinue(result)) continue;

      if (utils.isReturnValue(result)) {
        this.loopDepth--;
        return result;
      }

      loopCount++;
      if (loopCount > MAX_ITERATIONS)
        return new objects.ErrorObject("Loop limit exceeded");
    }

    this.loopDepth--;
    return utils.isBreak(result) || utils.isContinue(result)
      ? this.NULL
      : result;
  }

  /**
   * Evaluates an identifier
   *
   * @param node - The identifier node
   * @param env - The current environment
   * @returns The value associated with the identifier
   *
   * @example
   * // Assuming "x" is already defined in the environment with value 5
   * const identifier = new ast.Identifier("x");
   * const result = evaluator.evaluate(identifier, environment);
   * console.log(result.inspect()); // Outputs: 5
   */
  private evalIdentifier(
    node: ast.Identifier,
    env: objects.Environment
  ): objects.BaseObject {
    const value = env.get(node.value);
    if (value) return value;

    return new objects.ErrorObject(`Identifier not found: ${node.value}`);
  }

  /**
   * Evaluates a function literal
   *
   * @param node - The function literal node
   * @param env - The current environment
   * @returns A FunctionObject representing the function
   *
   * @example
   * const fnLiteral = new literal.FunctionLiteral(
   *   [new ast.Identifier("x")],
   *   new statement.BlockStatement([
   *     new statement.ReturnStatement(new ast.Identifier("x"))
   *   ])
   * );
   * const result = evaluator.evaluate(fnLiteral, environment);
   * console.log(result.type()); // Outputs: FUNCTION
   */
  private evalFunctionLiteral(
    node: literal.FunctionLiteral,
    env: objects.Environment
  ): objects.BaseObject {
    const params = node.parameters;
    const body = node.body;

    return new objects.FunctionObject(params, body, env);
  }

  /**
   * Evaluates an array literal
   *
   * @param node - The array literal node
   * @param env - The current environment
   * @returns An ArrayObject containing the evaluated elements
   *
   * @example
   * const arrayLiteral = new literal.ArrayLiteral([
   *   new literal.IntegerLiteral(1),
   *   new literal.IntegerLiteral(2),
   *   new literal.IntegerLiteral(3)
   * ]);
   * const result = evaluator.evaluate(arrayLiteral, environment);
   * console.log(result.inspect()); // Outputs: [1, 2, 3]
   */
  private evalArrayLiteral(
    node: literal.ArrayLiteral,
    env: objects.Environment
  ): objects.BaseObject {
    const elements = this.evalExpressions(node.elements, env);
    if (elements.length === 1 && utils.isError(elements[0])) return elements[0];

    return new objects.ArrayObject(elements);
  }

  /**
   * Evaluates a call expression
   *
   * @param ce - The call expression node
   * @param env - The current environment
   * @returns The result of calling the function
   *
   * @example
   * // Assuming we have a function "add(x, y)" defined in the environment
   * const callExpr = new expression.CallExpression(
   *   new ast.Identifier("add"),
   *   [new literal.IntegerLiteral(5), new literal.IntegerLiteral(3)]
   * );
   * const result = evaluator.evaluate(callExpr, environment);
   * console.log(result.inspect()); // Outputs: 8
   */
  private evalCallExpression(
    ce: expression.CallExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const functionObj = this.evaluate(ce.func, env);
    if (utils.isError(functionObj)) return functionObj;

    const args = this.evalExpressions(ce.args, env);
    if (args.length === 1 && utils.isError(args[0])) return args[0];

    return this.applyFunction(functionObj, args);
  }

  /**
   * Evaluates a logical AND expression
   *
   * @param left - The left operand
   * @param right - The right operand
   * @returns The result of the AND operation as a BooleanObject
   *
   * @example
   * // Evaluate true && false
   * const result = evaluator.evalAndExpression(evaluator.TRUE, evaluator.FALSE);
   * console.log(result.inspect()); // Outputs: false
   */
  private evalAndExpression(
    left: objects.BaseObject,
    right: objects.BaseObject
  ): objects.BaseObject {
    const leftVal = this.truthy(left);
    if (!leftVal) return this.toBool(leftVal);

    const rightVal = this.truthy(right);
    return this.toBool(rightVal);
  }

  /**
   * Evaluates a logical OR expression
   *
   * @param left - The left operand
   * @param right - The right operand
   * @returns The result of the OR operation as a BooleanObject
   *
   * @example
   * // Evaluate true || false
   * const result = evaluator.evalOrExpression(evaluator.TRUE, evaluator.FALSE);
   * console.log(result.inspect()); // Outputs: true
   */
  private evalOrExpression(
    left: objects.BaseObject,
    right: objects.BaseObject
  ): objects.BaseObject {
    const leftVal = this.truthy(left);
    if (leftVal) return this.toBool(leftVal);

    const rightVal = this.truthy(right);
    return this.toBool(rightVal);
  }

  /**
   * Evaluates an index expression
   *
   * @param node - The index expression node
   * @param env - The current environment
   * @returns The value at the specified index
   *
   * @example
   * // Assuming we have an array "arr" defined as [1, 2, 3] in the environment
   * const indexExpr = new expression.IndexExpression(
   *   new ast.Identifier("arr"),
   *   new literal.IntegerLiteral(1)
   * );
   * const result = evaluator.evaluate(indexExpr, environment);
   * console.log(result.inspect()); // Outputs: 2
   */
  private evalIndexExpression(
    node: expression.IndexExpression,
    env: objects.Environment
  ): objects.BaseObject {
    const left = this.evaluate(node.left, env);
    if (utils.isError(left)) return left;

    const index = this.evaluate(node.index, env);
    if (utils.isError(index)) return index;

    if (utils.isArray(left)) return this.evalArrayIndexExpression(left, index);
    else if (utils.isHash(left))
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
    const isHashable = utils.isString(index) || utils.isInteger(index);
    if (!isHashable)
      return new objects.ErrorObject("Index must be a string or an integer");

    const value = hash.pairs.get(index.inspect());
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
      if (utils.isError(evaluated)) return [evaluated];

      result.push(evaluated);
    }

    return result;
  }

  /**
   * Evaluates an assignment expression
   *
   * This method evaluates the right-hand side of an assignment expression,
   * then sets the value in the current environment using the identifier
   * on the left-hand side.
   *
   * @param node - The assignment expression node
   * @param env - The current environment
   * @returns The evaluated value that was assigned
   *
   * @example
   * // Assuming 'x' is already defined in the environment
   * const assignExpr = new expression.AssignmentExpression(
   *   new ast.Identifier("x"),
   *   new literal.IntegerLiteral(10)
   * );
   * const result = evaluator.evalAssignmentExpression(assignExpr, environment);
   * console.log(result.inspect()); // Outputs: 10
   * console.log(environment.get("x").inspect()); // Outputs: 10
   */
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
    if (value instanceof ErrorObject) return value;
    return definingScope.set(name, value);
  }

  /**
   * Applies a function to its arguments
   *
   * @param fn - The function object
   * @param args - The evaluated arguments
   * @returns The result of applying the function to its arguments
   *
   * @example
   * // This method is used internally when evaluating function calls
   * const fnObject = new objects.FunctionObject();
   * const args = [new objects.IntegerObject(5), new objects.IntegerObject(3)];
   * const result = evaluator.applyFunction(fnObject, args);
   */
  private applyFunction(
    fn: objects.BaseObject,
    args: objects.BaseObject[]
  ): objects.BaseObject {
    if (utils.isFunction(fn)) {
      const extendedEnv = this.extendFunctionEnv(fn, args);
      const evaluated = this.evaluate(fn.body, extendedEnv);
      if (utils.isError(evaluated)) return evaluated;

      return this.unWrapReturnValue(evaluated);
    }

    return new objects.ErrorObject(`Not a function: ${fn.type()}`);
  }

  /**
   * Extends the environment for a function call
   *
   * @param fn - The function object
   * @param args - The evaluated arguments
   * @returns A new environment with the function parameters bound to the arguments
   *
   * @example
   * // This method is used internally by applyFunction
   * const fnObject = new objects.FunctionObject();
   * const args = [new objects.IntegerObject(5), new objects.IntegerObject(3)];
   * const extendedEnv = evaluator.extendFunctionEnv(fnObject, args);
   * // extendedEnv will contain the function's parameters bound to the provided arguments
   */
  private extendFunctionEnv(
    fn: objects.FunctionObject,
    args: objects.BaseObject[]
  ): objects.Environment {
    const env = new objects.Environment(fn.env);

    for (let i = 0; i < fn.parameters.length; i++) {
      env.set(fn.parameters[i].value, args[i]);
    }

    return env;
  }

  /**
   * Unwraps a return value
   *
   * @param obj - The object to unwrap
   * @returns The unwrapped value if it's a ReturnValue, otherwise the original object
   *
   * @example
   * // This method is used internally to handle return statements in functions
   * const returnValue = new objects.ReturnValue(new objects.IntegerObject(42));
   * const unwrapped = evaluator.unWrapReturnValue(returnValue);
   * console.log(unwrapped.inspect()); // Outputs: 42
   */
  private unWrapReturnValue(obj: objects.BaseObject): objects.BaseObject {
    if (utils.isReturnValue(obj)) return obj.value;
    return obj;
  }

  /**
   * Determines if an object is truthy
   *
   * @param obj - The object to check
   * @returns true if the object is considered truthy, false otherwise
   *
   * @example
   * console.log(evaluator.truthy(evaluator.TRUE)); // Outputs: true
   * console.log(evaluator.truthy(evaluator.FALSE)); // Outputs: false
   * console.log(evaluator.truthy(evaluator.NULL)); // Outputs: false
   * console.log(evaluator.truthy(new objects.IntegerObject(1))); // Outputs: true
   */
  private truthy(obj: objects.BaseObject): boolean {
    switch (obj.constructor) {
      case objects.BooleanObject:
        return (obj as objects.BooleanObject).value;
      case objects.NullObject:
        return false;

      case objects.IntegerObject:
        return (obj as objects.IntegerObject).value !== 0;

      case objects.StringObject:
        return (obj as objects.StringObject).value.length > 0;

      case objects.ArrayObject:
        return (obj as objects.ArrayObject).elements.length > 0;

      case objects.HashObject:
        return (obj as objects.HashObject).pairs.size > 0;

      default:
        return true;
    }
  }

  /**
   * Converts a boolean value to a BooleanObject
   *
   * @param res - The boolean value to convert
   * @returns The corresponding BooleanObject (TRUE or FALSE)
   *
   * @example
   * console.log(evaluator.toBool(true).inspect()); // Outputs: true
   * console.log(evaluator.toBool(false).inspect()); // Outputs: false
   */
  private toBool(res: boolean): objects.BooleanObject {
    return res ? this.TRUE : this.FALSE;
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
