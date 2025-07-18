import { BaseObject, ObjectType } from "../core/base";

/**
 * Represents a break statement object in the Mutant programming language.
 * This object is used to signal a break in a loop or switch statement.
 */
export class BreakObject implements BaseObject {
  public static readonly INSTANCE = new BreakObject();

  inspect(): string {
    return "break";
  }

  type(): ObjectType {
    return ObjectType.BREAK;
  }

  isTruthy(): boolean {
    return true;
  }
}

/**
 * Represents a class object in the Enigma programming language.
 */

/**
 * Represents a continue statement object in the Mutant programming language.
 * This object is used to signal the continuation to the next iteration in a loop.
 */
export class ContinueObject implements BaseObject {
  public static readonly INSTANCE = new ContinueObject();

  inspect(): string {
    return "continue";
  }

  type(): ObjectType {
    return ObjectType.CONTINUE;
  }

  isTruthy(): boolean {
    return true;
  }
}
