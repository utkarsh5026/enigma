import { BaseObject, ObjectType } from "./base";
import { FunctionObject } from "./function";

export class ClassObject implements BaseObject {
  constructor(
    public name: string,
    public methods: Map<string, FunctionObject>,
    public constructorMethod: FunctionObject | null,
    public superclass: ClassObject | null
  ) {}
  type() {
    return ObjectType.CLASS;
  }
  inspect() {
    return `class ${this.name}`;
  }
}
