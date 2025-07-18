import { BaseObject, ObjectType } from "../core";

/**
 * 🌊 FloatObject - Runtime Floating-Point Number Object 🌊
 *
 * Represents floating-point values during program execution.
 */
export class FloatObject implements BaseObject {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  /**
   * Returns the object type identifier
   */
  type(): ObjectType {
    return ObjectType.FLOAT;
  }

  /**
   * 📝 Returns string representation of this float
   *
   * From first principles, float-to-string conversion should:
   * - Show decimal point for whole numbers (2.0 not 2)
   * - Use scientific notation for very large/small numbers
   * - Handle special values appropriately
   * - Remove unnecessary trailing zeros where appropriate
   *
   * @return String representation of the float value
   */
  inspect(): string {
    if (Number.isNaN(this.value)) {
      return "NaN";
    }
    if (!Number.isFinite(this.value)) {
      return this.value > 0 ? "Infinity" : "-Infinity";
    }

    let str = this.value.toString();

    const isWholeNumber =
      Number.isFinite(this.value) && this.value === Math.floor(this.value);
    if (
      isWholeNumber &&
      !str.includes(".") &&
      !str.includes("E") &&
      !str.includes("e")
    ) {
      str += ".0";
    }

    return str;
  }

  /**
   * ✅ Determines truthiness of this float
   *
   * From first principles, floating-point truthiness rules:
   * - 0.0 is falsy
   * - -0.0 is falsy (IEEE 754 has both +0.0 and -0.0)
   * - NaN is falsy (represents invalid/undefined values)
   * - Infinity is falsy (represents unbounded values)
   * - All other finite non-zero values are truthy
   *
   * @return true if this float should be considered true in boolean context
   */
  isTruthy(): boolean {
    if (Number.isNaN(this.value) || !Number.isFinite(this.value)) {
      return false;
    }

    return this.value !== 0.0;
  }

  toString(): string {
    return this.inspect();
  }
}
