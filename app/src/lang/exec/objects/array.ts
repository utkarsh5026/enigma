import { BaseObject, ObjectType } from "./base";

/**
 * Represents an array object in the Mutant programming language.
 */
export class ArrayObject implements BaseObject {
  elements: BaseObject[];

  /**
   * Creates a new ArrayObject.
   * @param {BaseObject[]} elements - The elements of the array.
   */
  constructor(elements: BaseObject[]) {
    this.elements = elements;
  }

  inspect(): string {
    return `[${this.elements.map((e) => e.inspect()).join(", ")}]`;
  }

  type(): ObjectType {
    return ObjectType.ARRAY;
  }
}
