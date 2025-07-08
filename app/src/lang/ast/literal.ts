import { Expression, Identifier } from "./ast";
import { BlockStatement } from "./statement.ts";
import { Token } from "../token/token";

/**
 * Represents a string literal in the AST.
 */
export class StringLiteral extends Expression {
  value: string;

  constructor(token: Token, value: string) {
    super(token);
    this.value = value;
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
export class ArrayLiteral extends Expression {
  elements: Expression[];

  constructor(token: Token, elements: Expression[]) {
    super(token);
    this.elements = elements;
  }

  toString(): string {
    const elements = this.elements.map((e) => e.toString()).join(", ");
    return `[${elements}]`;
  }
}

/**
 * Represents a hash literal (key-value pairs) in the AST.
 */
export class HashLiteral extends Expression {
  pairs: Map<Expression, Expression>;

  constructor(token: Token, pairs: Map<Expression, Expression>) {
    super(token);
    this.pairs = pairs;
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
export class IntegerLiteral extends Expression {
  value: number;

  /**
   * Creates a new IntegerLiteral instance.
   * @param token The token associated with this literal.
   * @param value The numeric value of the integer.
   */
  constructor(token: Token, value: number) {
    super(token);
    this.value = value;
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
export class FunctionLiteral extends Expression {
  parameters: Identifier[];
  body: BlockStatement;

  /**
   * Creates a new FunctionLiteral instance.
   * @param token The token associated with this literal.
   * @param parameters An array of Identifier objects representing the function parameters.
   * @param body The BlockStatement representing the function body.
   */
  constructor(token: Token, parameters: Identifier[], body: BlockStatement) {
    super(token);
    this.parameters = parameters;
    this.body = body;
  }

  /**
   * Returns a string representation of the FunctionLiteral.
   * @returns A string representation of the function, including parameters and body.
   */
  toString(): string {
    const params = this.parameters.map((p) => p.toString()).join(", ");
    return `${this.tokenLiteral()}(${params}) ${this.body.toString()}`;
  }

  functionSignature(): string {
    const params = this.parameters.map((p) => p.toString()).join(", ");
    return `${this.tokenLiteral()}(${params})`;
  }
}

export class FStringLiteral extends Expression {
  value: string;

  constructor(token: Token, value: string) {
    super(token);
    this.value = value;
  }

  toString(): string {
    return this.token.literal;
  }
}
