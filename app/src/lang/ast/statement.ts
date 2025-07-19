import { Expression, Identifier, Statement } from "./ast";
import { Token } from "../token/token";

/**
 * Represents a let statement in the AST.
 */
export class LetStatement extends Statement {
  readonly name: Identifier;
  readonly value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  toString(): string {
    const varName = this.name.toString();
    const value = this.value.toString();
    return `${this.tokenLiteral()} ${varName} = ${value};`;
  }
}

/**
 * Represents a return statement in the AST.
 */
export class ReturnStatement extends Statement {
  returnValue: Expression;

  constructor(token: Token, returnValue: Expression) {
    super(token);
    this.returnValue = returnValue;
  }

  toString(): string {
    const value = this.returnValue.toString();
    return `${this.tokenLiteral()} ${value};`;
  }
}

/**
 * Represents an expression statement in the AST.
 */
export class ExpressionStatement extends Statement {
  expression: Expression;

  constructor(token: Token, expression: Expression) {
    super(token);
    this.expression = expression;
  }

  toString(): string {
    return this.expression.toString();
  }
}

/**
 * Represents a block statement in the AST.
 */
export class BlockStatement extends Statement {
  statements: Statement[];

  constructor(token: Token, statements: Statement[]) {
    super(token);
    this.statements = statements;
  }

  toString(): string {
    return this.statements.map((s) => s.toString()).join("");
  }
}

/**
 * Represents a while statement in the AST.
 */
export class WhileStatement extends Statement {
  readonly condition: Expression;
  readonly body: BlockStatement;

  constructor(token: Token, condition: Expression, body: BlockStatement) {
    super(token);
    this.condition = condition;
    this.body = body;
  }

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
export class BreakStatement extends Statement {
  constructor(token: Token) {
    super(token);
    this.token = token;
  }

  toString(): string {
    return "break;";
  }
}

/**
 * Represents a continue statement in the AST.
 */
export class ContinueStatement extends Statement {
  constructor(token: Token) {
    super(token);
  }

  toString(): string {
    return "continue;";
  }
}

/**
 * Represents a for statement in the AST.
 */
export class ForStatement extends Statement {
  readonly initializer: Statement;
  readonly condition: Expression;
  readonly increment: Expression;
  readonly body: BlockStatement;

  constructor(
    token: Token,
    initializer: Statement,
    condition: Expression,
    increment: Expression,
    body: BlockStatement
  ) {
    super(token);
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }

  toString(): string {
    return `for (${this.initializer.toString()}; ${this.condition.toString()}; ${this.increment.toString()}) {\n${this.body.toString()}\n}`;
  }
}

/**
 * Represents a const statement in the AST.
 */
export class ConstStatement extends Statement {
  readonly name: Identifier;
  readonly value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  toString(): string {
    return `const ${this.name.toString()} = ${this.value.toString()};`;
  }
}
