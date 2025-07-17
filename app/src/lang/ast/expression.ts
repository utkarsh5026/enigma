import { Expression } from "./ast.ts";
import { Operator, Token } from "../token/token.ts";
import { BlockStatement } from "./statement.ts";
import { AstValidator } from "./validate.ts";

/**
 * Represents a prefix expression in the AST.
 */
export class PrefixExpression extends Expression {
  operator: string;
  right: Expression;

  /**
   * Creates a new PrefixExpression instance.
   * @param token The token associated with this expression.
   * @param operator The prefix operator.
   * @param right The expression to the right of the operator.
   */
  constructor(token: Token, operator: string, right: Expression) {
    super(token);
    this.operator = operator;
    this.right = right;
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
export class InfixExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly operator: Operator,
    public readonly right: Expression
  ) {
    super(token);
  }

  toString(): string {
    const left = this.left.toString();
    const right = this.right.toString();
    return `(${left} ${this.operator} ${right})`;
  }
}

/**
 * Represents a boolean expression in the AST.
 */
export class BooleanExpression extends Expression {
  constructor(token: Token, public readonly value: boolean) {
    super(token);
  }

  toString(): string {
    return this.token.literal;
  }
}

/**
 * Represents an if-else expression in the AST.
 */
export class IfExpression extends Expression {
  constructor(
    token: Token,
    public readonly conditions: Expression[],
    public readonly consequences: BlockStatement[],
    public readonly alternative: BlockStatement | null
  ) {
    super(token);
  }

  toString(): string {
    let out = `if ${this.conditions[0].toString()} ${this.consequences[0].toString()}`;
    for (let i = 1; i < this.conditions.length; i++) {
      out += `elif ${this.conditions[i].toString()} ${this.consequences[
        i
      ].toString()}`;
    }
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
export class IndexExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly index: Expression
  ) {
    super(token);
  }

  toString(): string {
    return `(${this.left.toString()}[${this.index.toString()}])`;
  }
}

/**
 * Represents a function call expression in the AST.
 */
export class CallExpression extends Expression {
  constructor(
    token: Token,
    public readonly func: Expression,
    public readonly args: Expression[]
  ) {
    super(token);
  }

  toString(): string {
    const args = this.args.map((a) => a.toString()).join(", ");
    return `${this.func.toString()}(${args})`;
  }
}

/**
 * Represents an assignment expression in the AST.
 */
export class AssignmentExpression extends Expression {
  constructor(
    token: Token,
    public readonly name: Expression,
    public readonly value: Expression
  ) {
    super(token);
  }

  toString(): string {
    return `${this.name.toString()} = ${this.value.toString()}`;
  }

  public isIdentifierAssignment(): boolean {
    return AstValidator.isIdentifier(this.name);
  }

  public isIndexAssignment(): boolean {
    return AstValidator.isIndexExpression(this.name);
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
}
