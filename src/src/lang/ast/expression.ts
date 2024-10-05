import { Expression, Identifier } from "./ast.ts";
import { Token } from "../token/token.ts";
import { BlockStatement } from "./statement.ts";

/**
 * Represents a prefix expression in the AST.
 */
export class PrefixExpression implements Expression {
  token: Token;
  operator: string;
  right: Expression;

  /**
   * Creates a new PrefixExpression instance.
   * @param token The token associated with this expression.
   * @param operator The prefix operator.
   * @param right The expression to the right of the operator.
   */
  constructor(token: Token, operator: string, right: Expression) {
    this.token = token;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
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
export class InfixExpression implements Expression {
  token: Token;
  left: Expression;
  operator: string;
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
    operator: string,
    right: Expression
  ) {
    this.token = token;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
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
export class BooleanExpression implements Expression {
  token: Token;
  value: boolean;

  /**
   * Creates a new BooleanExpression instance.
   * @param token The token associated with this expression.
   * @param value The boolean value of the expression.
   */
  constructor(token: Token, value: boolean) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
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
export class IfExpression implements Expression {
  token: Token;
  condition: Expression;
  consequence: BlockStatement;
  alternative: BlockStatement | null;

  /**
   * Creates a new IfExpression instance.
   * @param token The token associated with this expression.
   * @param condition The condition of the if statement.
   * @param consequence The block to execute if the condition is true.
   * @param alternative The optional block to execute if the condition is false.
   */
  constructor(
    token: Token,
    condition: Expression,
    consequence: BlockStatement,
    alternative: BlockStatement | null
  ) {
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the IfExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    let out = `if ${this.condition.toString()} ${this.consequence.toString()}`;
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
export class IndexExpression implements Expression {
  token: Token;
  left: Expression;
  index: Expression;

  /**
   * Creates a new IndexExpression instance.
   * @param token The token associated with this expression.
   * @param left The expression being indexed (e.g., an array).
   * @param index The expression representing the index.
   */
  constructor(token: Token, left: Expression, index: Expression) {
    this.token = token;
    this.left = left;
    this.index = index;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
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
export class CallExpression implements Expression {
  token: Token;
  func: Expression;
  args: Expression[];

  /**
   * Creates a new CallExpression instance.
   * @param token The token associated with this expression.
   * @param func The expression representing the function being called.
   * @param args An array of expressions representing the arguments to the function.
   */
  constructor(token: Token, func: Expression, args: Expression[]) {
    this.token = token;
    this.func = func;
    this.args = args;
  }

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
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
export class AssignmentExpression implements Expression {
  /**
   * Creates a new AssignmentExpression instance.
   * @param token The token associated with this expression.
   * @param name The identifier being assigned to.
   * @param value The expression representing the value being assigned.
   */
  constructor(
    public token: Token,
    public name: Identifier,
    public value: Expression
  ) {}

  expressionNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the AssignmentExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return `${this.name.toString()} = ${this.value.toString()}`;
  }
}
