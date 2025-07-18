import { Position, Token } from "../token/token.ts";

/**
 * Represents a node in the Abstract Syntax Tree (AST).
 */
export interface Node {
  /**
   * Returns the literal value of the token associated with this node.
   * @returns {string} The token's literal value.
   */
  tokenLiteral(): string;

  /**
   * Returns a string representation of the node.
   * @returns {string} The string representation.
   */
  toString(): string;

  /**
   * Returns the position of the node in the source code.
   * @returns {Position} The position of the node.
   */
  position(): Position;
}

/**
 * Represents a statement in the AST.
 * A statement is a unit of code that performs an action.
 * Statements are used to control the flow of the program.
 *
 * Examples of statements include:
 * - let statements
 * - return statements
 * - expression statements
 * - if statements
 * - for statements
 * - while statements
 */
export class Statement implements Node {
  token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  position(): Position {
    return this.token.position;
  }
}

/**
 * Represents an expression in the AST
 * An expression is a unit of code that evaluates to a value.
 * Expressions are used to compute values.
 *
 * Examples of expressions include:
 * - identifiers
 * - literals
 * - operators
 * - function calls
 * - array literals
 *
 */
export class Expression implements Node {
  token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  expressionNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  position(): Position {
    return this.token.position;
  }
}

/**
 * Represents the root node of the AST.
 */
export class Program implements Node {
  /**
   * The list of statements in the program.
   */
  constructor(private readonly statements: Statement[]) {
    if (statements.length === 0) {
      throw new Error("Program must have at least one statement");
    }
  }

  /**
   * Returns the literal value of the first token in the program.
   * @returns {string} The token's literal value or an empty string if there are no statements.
   */
  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  /**
   * Returns a string representation of the entire program.
   * @returns {string} The string representation of all statements joined by newlines.
   */
  toString(): string {
    return this.statements.map((s) => s.toString()).join("\n");
  }

  position(): Position {
    return this.statements[0].position();
  }

  getStatements(): Statement[] {
    return this.statements;
  }
}

/**
 * Represents an identifier in the AST.
 */
export class Identifier implements Expression {
  /**
   * The token associated with this identifier.
   */
  token: Token;

  /**
   * The value of the identifier.
   */
  value: string;

  /**
   * Creates a new Identifier instance.
   * @param {Token} token - The token associated with this identifier.
   * @param {string} value - The value of the identifier.
   */
  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  /**
   * Marker method to identify this node as an expression.
   */
  expressionNode() {}

  /**
   * Returns the literal value of the token associated with this identifier.
   * @returns {string} The token's literal value.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the identifier.
   * @returns {string} The value of the identifier.
   */
  toString(): string {
    return this.value;
  }

  position(): Position {
    return this.token.position;
  }
}
