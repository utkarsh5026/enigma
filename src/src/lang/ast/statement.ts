import { Expression, Identifier, Statement } from "./ast";
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

/**
 * Represents a while statement in the AST.
 */
export class WhileStatement implements Statement {
  token: Token;
  condition: Expression;
  body: BlockStatement;

  constructor(token: Token, condition: Expression, body: BlockStatement) {
    this.token = token;
    this.condition = condition;
    this.body = body;
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
   * Returns a string representation of the WhileStatement.
   * @returns A string representation of the while loop.
   */
  toString(): string {
    const condition = this.condition.toString();
    let body = "";

    for (const statement of this.body.statements) {
      body += `\t${statement.toString()};\n`;
    }

    return `while (${condition}) {\n${body}\n}`;
  }
}

/**
 * Represents a break statement in the AST.
 */
export class BreakStatement implements Statement {
  token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  statementNode() {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return "break;";
  }
}

/**
 * Represents a continue statement in the AST.
 */
export class ContinueStatement implements Statement {
  token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}

  toString(): string {
    return "continue;";
  }
}

/**
 * Represents a for statement in the AST.
 */
export class ForStatement implements Statement {
  token: Token;
  initializer: Statement;
  condition: Expression;
  increment: Expression;
  body: BlockStatement;

  /**
   * Creates a new ForStatement instance.
   * @param token The token associated with this statement.
   * @param initializer The statement to initialize the loop.
   * @param condition The expression to evaluate as the loop condition.
   * @param increment The expression to evaluate as the loop increment.
   * @param body The block statement to execute as the loop body.
   */
  constructor(
    token: Token,
    initializer: Statement,
    condition: Expression,
    increment: Expression,
    body: BlockStatement
  ) {
    this.token = token;
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }

  statementNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `for (${this.initializer.toString()}; ${this.condition.toString()}; ${this.increment.toString()}) {\n${this.body.toString()}\n}`;
  }
}

/**
 * Represents a const statement in the AST.
 */
export class ConstStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  /**
   * Creates a new ConstStatement instance.
   * @param token The token associated with this statement.
   * @param name The identifier being assigned to.
   * @param value The expression representing the value being assigned.
   */
  constructor(token: Token, name: Identifier, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode() {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `const ${this.name.toString()} = ${this.value.toString()};`;
  }
}
