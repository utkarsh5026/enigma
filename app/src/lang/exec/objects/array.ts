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

  /**
   * ❓ Checks if an index is valid for this array
   */
  public isValidIndex(index: number): boolean {
    return index >= 0 && index < this.elements.length;
  }

  public set(index: number, value: BaseObject): BaseObject {
    if (index < 0 || index >= this.elements.length) {
      throw new Error(
        `Index ${index} out of bounds for array of size ${this.elements.length}`
      );
    }
    this.elements[index] = value;
    return value;
  }

  public get(index: number): BaseObject {
    if (index < 0 || index >= this.elements.length) {
      throw new Error(
        `Index ${index} out of bounds for array of size ${this.elements.length}`
      );
    }
    return this.elements[index];
  }

  public size(): number {
    return this.elements.length;
  }

  inspect(): string {
    return `[${this.elements.map((e) => e.inspect()).join(", ")}]`;
  }

  type(): ObjectType {
    return ObjectType.ARRAY;
  }

  isTruthy(): boolean {
    return this.elements.length > 0;
  }
}
