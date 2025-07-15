import { BaseObject, ObjectType } from "./base";

/**
 * Represents a hash object in the Mutant programming language.
 */
export class HashObject implements BaseObject {
  pairs: Map<string, BaseObject>;

  /**
   * Creates a new HashObject.
   * @param {Map<BaseObject, BaseObject>} pairs - The key-value pairs of the hash.
   */
  constructor(pairs: Map<string, BaseObject>) {
    this.pairs = pairs;
  }

  inspect(): string {
    const pairs = Array.from(this.pairs).map(
      ([key, value]) => `${key}: ${value.inspect()}`
    );
    return `{${pairs.join(", ")}}`;
  }

  type(): ObjectType {
    return ObjectType.HASH;
  }

  isTruthy(): boolean {
    return this.pairs.size > 0;
  }
}
