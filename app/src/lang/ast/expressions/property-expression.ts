import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * 🔗 PropertyExpression - Property Access AST Node 🔗
 *
 * Represents accessing a property or method of an object using dot notation.
 *
 * From first principles, property access involves:
 * - An object expression (what we're accessing on)
 * - A property name (what we're accessing)
 * - Resolution of the property in the object's class hierarchy
 *
 * Examples:
 * ```
 * dog.name // Access instance variable
 * dog.speak() // Method call (parsed as property access + call)
 * this.energy // Access property on current instance
 * super.speak() // Access parent class method
 * ```
 */
export class PropertyExpression extends Expression {
  readonly object: Expression; // 🎯 Object being accessed
  readonly property: Expression; // 🏷️ Property name

  constructor(token: Token, object: Expression, property: Expression) {
    super(token);
    this.object = object;
    this.property = property;
  }

  toString() {
    return `${this.object.toString()}.${this.property.toString()}`;
  }

  whatIam() {
    return {
      name: "PropertyExpression",
      description:
        "The `.` operator is used to access properties or methods of an object.",
    };
  }
}
