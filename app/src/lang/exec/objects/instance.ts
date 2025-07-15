import { BaseObject, ObjectType } from "./base";
import { ClassObject } from "./clas";

/**
 * Represents an instance object in the Mutant programming language.
 */
export class InstanceObject implements BaseObject {
  constructor(
    public classObject: ClassObject,
    public fields: Map<string, BaseObject>
  ) {}
  type() {
    return ObjectType.INSTANCE;
  }
  inspect() {
    return `instance of ${this.classObject.name}`;
  }

  isTruthy(): boolean {
    return true;
  }
}
