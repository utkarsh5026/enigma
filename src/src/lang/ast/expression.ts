import { Expression } from "./ast.ts";
import { Token } from "../token/token.ts";

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
