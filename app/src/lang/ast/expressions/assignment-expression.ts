import { Token } from "@/lang/token/token";
import { Expression } from "../ast";
import { AstValidator } from "../validate";

/**
 * 📝 AssignmentExpression - Value Assignment AST Node
 *
 * Represents assignment operations that store values into variables, array
 * elements, or object properties. Handles both simple variable assignments
 * and complex indexed assignments with proper target validation.
 *
 * @example
 * - Variable assignments: userName = "Alice", score = 95
 * - Array assignments: numbers[0] = 42, matrix[i][j] = value
 * - Object assignments: person["age"] = 30, config["timeout"] = 5000
 * - Complex assignments: users[currentIndex].name = newName
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

  public isPropertyAssignment(): boolean {
    return AstValidator.isPropertyExpression(this.name);
  }
}
