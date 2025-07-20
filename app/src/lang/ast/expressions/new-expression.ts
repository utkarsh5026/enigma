import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * 🆕 NewExpression - Object Instantiation AST Node 🆕
 *
 * Represents creating a new instance of a class using the `new` keyword.
 *
 * From first principles, object instantiation involves:
 * - The class to instantiate
 * - Arguments to pass to the constructor
 * - Creation of a new object instance
 * - Calling the constructor with the provided arguments
 *
 * Examples:
 * ```
 * new Animal("Lion")
 * new Dog("Rex", "German Shepherd")
 * new Vehicle() // No arguments
 * ```
 */
export class NewExpression extends Expression {
  readonly className: Expression; // 🏷️ Class to instantiate
  readonly arguments: Expression[]; // 📋 Constructor arguments

  constructor(token: Token, className: Expression, args: Expression[]) {
    super(token);
    this.className = className;
    this.arguments = args;
  }

  /**
   * 🔢 Gets the number of arguments
   */
  public getArgumentCount(): number {
    return this.arguments.length;
  }

  /**
   * ✅ Checks if any arguments were provided
   */
  public hasArguments(): boolean {
    return this.arguments.length > 0;
  }

  public toString(): string {
    const args = this.arguments.map((arg) => arg.toString()).join(", ");
    return `new ${this.className.toString()}(${args})`;
  }

  whatIam() {
    return {
      name: "NewExpression",
      description:
        "The `new` keyword is used to create a new instance of a class.",
    };
  }
}
