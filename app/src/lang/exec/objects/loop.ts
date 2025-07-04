import { BaseObject, ObjectType } from "./base";

/**
 * Represents a break statement object in the Mutant programming language.
 * This object is used to signal a break in a loop or switch statement.
 */
export class BreakObject implements BaseObject {
  inspect(): string {
    return "break";
  }

  type(): ObjectType {
    return ObjectType.BREAK;
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
  inspect(): string {
    return "continue";
  }

  type(): ObjectType {
    return ObjectType.CONTINUE;
  }
}
