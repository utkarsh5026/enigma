import { Expression, Identifier } from "./ast";
import { BlockStatement } from "./statement.ts";
import { Token } from "../token/token";

/**
 * Represents a string literal in the AST.
 */
export class StringLiteral implements Expression {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
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
   * Returns a string representation of the StringLiteral.
   * @returns The literal value of the token.
   */
  toString(): string {
    return this.token.literal;
  }
}

/**
 * Represents an array literal in the AST.
 */
export class ArrayLiteral implements Expression {
  token: Token;
  elements: Expression[];

  constructor(token: Token, elements: Expression[]) {
    this.token = token;
    this.elements = elements;
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
   * Returns a string representation of the ArrayLiteral.
   * @returns A string representation of the array, with elements separated by commas.
   */
  toString(): string {
    const elements = this.elements.map((e) => e.toString()).join(", ");
    return `[${elements}]`;
  }
}

/**
 * Represents a hash literal (key-value pairs) in the AST.
 */
export class HashLiteral implements Expression {
  token: Token;
  pairs: Map<Expression, Expression>;

  constructor(token: Token, pairs: Map<Expression, Expression>) {
    this.token = token;
    this.pairs = pairs;
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
   * Returns a string representation of the HashLiteral.
   * @returns A string representation of the hash, with key-value pairs separated by commas.
   */
  toString(): string {
    const pairs = Array.from(this.pairs.entries())
      .map(([key, value]) => {
        const keyStr = key.toString();
        const valueStr = value.toString();
        return `${keyStr}:${valueStr}`;
      })
      .join(", ");
    return `{${pairs}}`;
  }
}

/**
 * Represents an integer literal in the AST.
 */
export class IntegerLiteral implements Expression {
  token: Token;
  value: number;

  /**
   * Creates a new IntegerLiteral instance.
   * @param token The token associated with this literal.
   * @param value The numeric value of the integer.
   */
  constructor(token: Token, value: number) {
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
   * Returns a string representation of the IntegerLiteral.
   * @returns A string representation of the integer value.
   */
  toString(): string {
    return this.value.toString();
  }
}

/**
 * Represents a function literal in the AST.
 */
export class FunctionLiteral implements Expression {
  token: Token;
  parameters: Identifier[];
  body: BlockStatement;

  /**
   * Creates a new FunctionLiteral instance.
   * @param token The token associated with this literal.
   * @param parameters An array of Identifier objects representing the function parameters.
   * @param body The BlockStatement representing the function body.
   */
  constructor(token: Token, parameters: Identifier[], body: BlockStatement) {
    this.token = token;
    this.parameters = parameters;
    this.body = body;
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
   * Returns a string representation of the FunctionLiteral.
   * @returns A string representation of the function, including parameters and body.
   */
  toString(): string {
    const params = this.parameters.map((p) => p.toString()).join(", ");
    return `${this.tokenLiteral()}(${params}) ${this.body.toString()}`;
  }
}
