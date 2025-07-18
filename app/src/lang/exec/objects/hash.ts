import { BaseObject, ObjectType } from "../core/base";

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

  /**
   * 🔧 Sets or updates a key-value pair in this hash
   */
  public set(key: string, value: BaseObject): BaseObject {
    this.pairs.set(key, value);
    return value;
  }

  /**
   * 🔍 Gets a value by key, returning null if not found
   */
  public get(key: string): BaseObject | null {
    return this.pairs.get(key) ?? null;
  }

  /**
   * ❓ Checks if a key exists in this hash
   */
  public hasKey(key: string): boolean {
    return this.pairs.has(key);
  }

  /**
   * 📊 Gets the number of key-value pairs in this hash
   */
  public size(): number {
    return this.pairs.size;
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
