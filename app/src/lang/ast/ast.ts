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

  /**
   * Returns the name and description of the node.
   * @returns {Object} The name and description of the node.
   */
  whatIam(): { name: string; description: string };

  /**
   * Returns the type of the node.
   * @returns {string} The type of the node.
   */
  nodeRange(): { start: Position; end: Position };
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
  readonly startToken: Token;
  readonly endToken: Token;

  constructor(startToken: Token, endToken: Token) {
    this.startToken = startToken;
    this.endToken = endToken;
  }

  tokenLiteral(): string {
    return this.startToken.literal;
  }

  position(): Position {
    return this.startToken.position;
  }

  whatIam(): { name: string; description: string } {
    return {
      name: "Statement",
      description: "A statement is a unit of code that performs an action.",
    };
  }

  nodeRange(): { start: Position; end: Position } {
    return {
      start: this.startToken.start(),
      end: this.endToken.position,
    };
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

  whatIam(): { name: string; description: string } {
    return {
      name: "Expression",
      description: "An expression is a unit of code that evaluates to a value.",
    };
  }

  nodeRange(): { start: Position; end: Position } {
    const literal = this.tokenLiteral();
    const start = { column: literal.length, line: 0 };
    const end = { column: literal.length, line: 0 };
    return { start, end };
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

  whatIam(): { name: string; description: string } {
    return {
      name: "Program",
      description: "The root node of the AST.",
    };
  }

  nodeRange(): { start: Position; end: Position } {
    const literal = this.tokenLiteral();
    const start = { column: literal.length, line: 0 };
    const end = { column: literal.length, line: 0 };
    return { start, end };
  }
}
