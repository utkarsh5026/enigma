import { Expression, Statement, Identifier } from "./ast";
import { Token } from "../token/token";

/**
 * Represents a let statement in the AST.
 */
export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode(): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the LetStatement.
   * @returns A string in the format "let <name> = <value>;"
   */
  toString(): string {
    const varName = this.name.toString();
    const value = this.value.toString();
    return `${this.tokenLiteral()} ${varName} = ${value};`;
  }
}

/**
 * Represents a return statement in the AST.
 */
export class ReturnStatement implements Statement {
  token: Token;
  returnValue: Expression;

  constructor(token: Token, returnValue: Expression) {
    this.token = token;
    this.returnValue = returnValue;
  }

  statementNode(): void {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the ReturnStatement.
   * @returns A string in the format "return <value>;"
   */
  toString(): string {
    const value = this.returnValue.toString();
    return `${this.tokenLiteral()} ${value};`;
  }
}

/**
 * Represents an expression statement in the AST.
 */
export class ExpressionStatement implements Statement {
  token: Token;
  expression: Expression;

  constructor(token: Token, expression: Expression) {
    this.token = token;
    this.expression = expression;
  }

  statementNode(): void {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the ExpressionStatement.
   * @returns A string representation of the contained expression.
   */
  toString(): string {
    return this.expression.toString();
  }
}

/**
 * Represents a block statement in the AST.
 */
export class BlockStatement implements Statement {
  token: Token;
  statements: Statement[];

  constructor(token: Token, statements: Statement[]) {
    this.token = token;
    this.statements = statements;
  }

  statementNode() {}

  /**
   * Returns the literal value of the token.
   * @returns The literal value of the token.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the BlockStatement.
   * @returns A concatenated string of all contained statements.
   */
  toString(): string {
    return this.statements.map((s) => s.toString()).join("");
  }
}
