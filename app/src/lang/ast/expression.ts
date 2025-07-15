import { Expression } from "./ast.ts";
import { Operator, Token } from "../token/token.ts";
import { BlockStatement } from "./statement.ts";
import { AstValidator } from "./validate.ts";

/**
 * Represents a prefix expression in the AST.
 */
export class PrefixExpression extends Expression {
  operator: string;
  right: Expression;

  /**
   * Creates a new PrefixExpression instance.
   * @param token The token associated with this expression.
   * @param operator The prefix operator.
   * @param right The expression to the right of the operator.
   */
  constructor(token: Token, operator: string, right: Expression) {
    super(token);
    this.operator = operator;
    this.right = right;
  }

  /**
   * Returns a string representation of the PrefixExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return `(${this.operator}${this.right.toString()})`;
  }
}

/**
 * Represents an infix expression in the AST.
 */
export class InfixExpression extends Expression {
  left: Expression;
  operator: Operator;
  right: Expression;

  /**
   * Creates a new InfixExpression instance.
   * @param token The token associated with this expression.
   * @param left The expression to the left of the operator.
   * @param operator The infix operator.
   * @param right The expression to the right of the operator.
   */
  constructor(
    token: Token,
    left: Expression,
    operator: Operator,
    right: Expression
  ) {
    super(token);
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  /**
   * Returns a string representation of the InfixExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    const left = this.left.toString();
    const right = this.right.toString();
    return `(${left} ${this.operator} ${right})`;
  }
}

/**
 * Represents a boolean expression in the AST.
 */
export class BooleanExpression extends Expression {
  value: boolean;

  /**
   * Creates a new BooleanExpression instance.
   * @param token The token associated with this expression.
   * @param value The boolean value of the expression.
   */
  constructor(token: Token, value: boolean) {
    super(token);
    this.value = value;
  }

  /**
   * Returns a string representation of the BooleanExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return this.token.literal;
  }
}

/**
 * Represents an if-else expression in the AST.
 */
export class IfExpression extends Expression {
  conditions: Expression[];
  consequences: BlockStatement[];
  alternative: BlockStatement | null;

  /**
   * Creates a new IfExpression instance.
   * @param token The token associated with this expression.
   * @param conditions The conditions of the if statement.
   * @param consequences The blocks to execute if the condition is true.
   * @param alternative The optional block to execute if the condition is false.
   */
  constructor(
    token: Token,
    conditions: Expression[],
    consequences: BlockStatement[],
    alternative: BlockStatement | null
  ) {
    super(token);
    this.conditions = conditions;
    this.consequences = consequences;
    this.alternative = alternative;
  }

  /**
   * Returns a string representation of the IfExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    let out = `if ${this.conditions[0].toString()} ${this.consequences[0].toString()}`;
    for (let i = 1; i < this.conditions.length; i++) {
      out += `elif ${this.conditions[i].toString()} ${this.consequences[
        i
      ].toString()}`;
    }
    if (this.alternative !== null) {
      out += `else ${this.alternative.toString()}`;
    }
    return out;
  }
}

/**
 * Represents an index expression in the AST.
 * This is used for accessing elements in arrays or other indexable structures.
 */
export class IndexExpression extends Expression {
  left: Expression;
  index: Expression;

  /**
   * Creates a new IndexExpression instance.
   * @param token The token associated with this expression.
   * @param left The expression being indexed (e.g., an array).
   * @param index The expression representing the index.
   */
  constructor(token: Token, left: Expression, index: Expression) {
    super(token);
    this.left = left;
    this.index = index;
  }

  /**
   * Returns a string representation of the IndexExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return `(${this.left.toString()}[${this.index.toString()}])`;
  }
}

/**
 * Represents a function call expression in the AST.
 */
export class CallExpression extends Expression {
  func: Expression;
  args: Expression[];

  /**
   * Creates a new CallExpression instance.
   * @param token The token associated with this expression.
   * @param func The expression representing the function being called.
   * @param args An array of expressions representing the arguments to the function.
   */
  constructor(token: Token, func: Expression, args: Expression[]) {
    super(token);
    this.func = func;
    this.args = args;
  }

  /**
   * Returns a string representation of the CallExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    const args = this.args.map((a) => a.toString()).join(", ");
    return `${this.func.toString()}(${args})`;
  }
}

/**
 * Represents an assignment expression in the AST.
 */
export class AssignmentExpression extends Expression {
  /**
   * Creates a new AssignmentExpression instance.
   * @param token The token associated with this expression.
   * @param name The identifier being assigned to.
   * @param value The expression representing the value being assigned.
   */
  constructor(token: Token, public name: Expression, public value: Expression) {
    super(token);
  }

  /**
   * Returns a string representation of the AssignmentExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return `${this.name.toString()} = ${this.value.toString()}`;
  }

  /**
   * Checks if this assignment targets a simple identifier
   */
  public isIdentifierAssignment(): boolean {
    return AstValidator.isIdentifier(this.name);
  }

  /**
   * Checks if this assignment targets an index expression (array[i] or
   * hash["key"])
   */
  public isIndexAssignment(): boolean {
    return AstValidator.isIndexExpression(this.name);
  }
}
