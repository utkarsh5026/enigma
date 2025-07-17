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
  pairs: Map<string, Expression>;

  constructor(token: Token, pairs: Map<string, Expression>) {
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
    const statements = this.body.statements.map((s) => s.toString()).join("\n");
    return `${this.functionSignature()} { \n${statements}\n}`;
  }

  functionSignature(): string {
    const params = this.parameters.map((p) => p.toString()).join(", ");
    return `${this.tokenLiteral()}(${params})`;
  }
}

export class NullLiteral extends Expression {
  constructor(token: Token) {
    super(token);
  }

  toString(): string {
    return "null";
  }
}

/**
 * Represents a f-string literal in the AST.
 * like f"Hello my name is {name}"
 */
export class FStringLiteral extends Expression {
  constructor(
    token: Token,
    public readonly actualStrings: string[],
    public readonly expressions: Expression[]
  ) {
    super(token);
  }

  toString(): string {
    if (this.expressions.length === 0) {
      return `f"${this.actualStrings[0]}"`;
    }
    const parts: string[] = [];

    for (let i = 0; i < this.expressions.length; i++) {
      parts.push(this.actualStrings[i]);
      parts.push(`{${this.expressions[i].toString()}}`);
    }

    parts.push(this.actualStrings[this.actualStrings.length - 1]);
    parts.push('"');

    return parts.join("");
  }

  public isOnlyStaticString(): boolean {
    return this.expressions.length === 0 && this.actualStrings.length === 1;
  }
}

/**
 * Represents a float literal in the AST.
 */
export class FloatLiteral extends Expression {
  constructor(token: Token, public readonly value: number) {
    super(token);
  }

  public isWholeNumber(): boolean {
    return this.value == Math.floor(this.value);
  }

  toString(): string {
    if (Number.isNaN(this.value)) {
      return "NaN";
    }
    if (!Number.isFinite(this.value)) {
      return this.value > 0 ? "Infinity" : "-Infinity";
    }
    let str = this.value.toString();

    if (
      this.isWholeNumber() &&
      !str.includes(".") &&
      !str.includes("E") &&
      !str.includes("e")
    ) {
      str += ".0";
    }

    return str;
  }
}
