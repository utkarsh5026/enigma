import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * ⬆️ SuperExpression - Parent Class Access AST Node ⬆️
 *
 * Represents accessing methods or properties from a parent class using `super`.
 *
 * From first principles, super access involves:
 * - Reference to the parent class
 * - Method name to call on parent
 * - Arguments for the parent method
 * - Proper `this` binding (current instance, parent method)
 *
 * Examples:
 * ```
 * super(name) // Call parent constructor
 * super.speak() // Call parent method
 * super.move(distance) // Call parent method with arguments
 * ```
 */
export class SuperExpression extends Expression {
  readonly method: Expression | null; // 🏷️ Method to call on parent
  readonly args: Expression[]; // 📋 Arguments for parent method

  constructor(
    token: Token,
    method: Expression | null,
    args: Expression[],
    endToken: Token | null
  ) {
    super(token, endToken);
    this.method = method;
    this.args = [...args];
  }

  /**
   * ✅ Checks if this is a constructor call (super() with no method)
   */
  public isConstructorCall() {
    return this.method == null;
  }

  toString() {
    const args = this.args
      .map((expression) => expression.toString())
      .join(", ");

    if (this.isConstructorCall()) {
      return `super(${args})`;
    } else {
      return `super.${this.method?.toString()}(${args})`;
    }
  }

  whatIam() {
    return {
      name: "SuperExpression",
      description:
        "The `super` keyword refers to the parent class. It is used to access methods or properties from the parent class.",
    };
  }
}
