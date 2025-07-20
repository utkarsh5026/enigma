import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * 👆 ThisExpression - Current Instance Reference AST Node 👆
 *
 * Represents the `this` keyword which refers to the current object instance.
 *
 * From first principles, `this` provides:
 * - Reference to the current object instance
 * - Access to instance variables and methods
 * - Disambiguation when parameter names shadow instance variables
 * - Proper binding context for method calls
 *
 * Examples:
 * ```
 * this.name = name; // Set instance variable
 * this.speak(); // Call instance method
 * return this; // Return current instance (method chaining)
 * ```
 */
export class ThisExpression extends Expression {
  constructor(token: Token) {
    super(token);
  }

  toString() {
    return "this";
  }

  whatIam() {
    return {
      name: "ThisExpression",
      description: "The `this` keyword refers to the current object instance.",
    };
  }
}
