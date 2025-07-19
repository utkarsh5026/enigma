import { Token } from "@/lang/token/token";
import { Expression } from "../ast";
import { AstValidator } from "../validate";

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
