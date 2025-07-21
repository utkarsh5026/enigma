import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * 🗂️ IndexExpression - Collection Access AST Node
 *
 * Represents indexed access operations for retrieving elements from arrays
 * or values from hash tables. Handles both numeric indexing for arrays and
 * string key access for hash/object structures with bounds checking.
 *
 * @example
 * - Array indexing: numbers[0], items[length-1], grid[row][col]
 * - Hash access: person["name"], settings["theme"], data["results"]
 * - Dynamic access: users[currentIndex], config[keyName]
 * - Nested access: company.employees[0].salary, matrix[i][j]
 */
export class IndexExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly index: Expression,
    endToken: Token | null
  ) {
    super(token, endToken);
  }

  toString(): string {
    return `(${this.left.toString()}[${this.index.toString()}])`;
  }

  whatIam() {
    return {
      name: "IndexExpression",
      description:
        "An index expression is an expression that is used to access an element of an array or a property of an object.",
    };
  }
}
