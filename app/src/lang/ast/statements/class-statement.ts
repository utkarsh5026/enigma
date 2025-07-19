import { Token } from "@/lang/token/token";
import { Statement, Identifier } from "@/lang/ast/ast";
import { FunctionLiteral } from "@/lang/ast/literals";

/**
 * 🏛️ ClassStatement - Class Definition AST Node 🏛️
 *
 * Represents a class definition in the Abstract Syntax Tree.
 *
 * From first principles, a class definition contains:
 * - Name of the class
 * - Optional parent class (for inheritance)
 * - Constructor method (special initialization function)
 * - Instance methods (functions that operate on instances)
 *
 * Examples:
 * ```
 * class Animal {
 * constructor(name) {
 * this.name = name;
 * }
 *
 * speak() {
 * return this.name + " makes a sound";
 * }
 * }
 *
 * class Dog extends Animal {
 * constructor(name, breed) {
 * super(name);
 * this.breed = breed;
 * }
 *
 * speak() {
 * return this.name + " barks";
 * }
 * }
 * ```
 */
export class ClassStatement extends Statement {
  readonly name: Identifier;
  readonly parentClass: Identifier | null;
  readonly classConstructor: FunctionLiteral | null;
  readonly methods: MethodDefinition[];

  constructor(
    token: Token,
    name: Identifier,
    parentClass: Identifier | null,
    classConstructor: FunctionLiteral | null,
    methods: MethodDefinition[]
  ) {
    super(token);
    this.name = name;
    this.parentClass = parentClass;
    this.classConstructor = classConstructor;
    this.methods = methods;
  }

  /**
   * 🔍 Finds a specific method by name
   */
  public getMethod(methodName: string): MethodDefinition | undefined {
    return this.methods.find((method) => method.name.value === methodName);
  }

  /**
   * ✅ Checks if this class has inheritance
   */
  public hasParentClass(): boolean {
    return this.parentClass !== null;
  }

  /**
   * ✅ Checks if this class has a constructor
   */
  public hasConstructor(): boolean {
    return this.classConstructor !== null;
  }

  public toString() {
    const parts = [];

    parts.push(`class ${this.name.toString()}`);
    if (this.parentClass) {
      parts.push(` extends ${this.parentClass.toString()}`);
    }

    parts.push(" {\n");
    if (this.classConstructor) {
      parts.push(`    constructor${this.classConstructor.toString()}\n`);
    }

    for (const method of this.methods) {
      parts.push(`    ${method.toString()}\n`);
    }
    parts.push("}");
    return parts.join("");
  }
}

/**
 * Represents a method definition in a class.
 * in the method hello() {return "hello"}
 */
class MethodDefinition {
  readonly name: Identifier;
  readonly function: FunctionLiteral;

  constructor(name: Identifier, functionLiteral: FunctionLiteral) {
    this.name = name;
    this.function = functionLiteral;
  }

  toString(): string {
    return `${this.name.toString()}${this.function.toString()}`;
  }
}
