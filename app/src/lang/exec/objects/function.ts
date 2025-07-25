import { BlockStatement, Identifier } from "@/lang/ast";
import { BaseObject, ObjectType, Environment } from "@/lang/exec/core";

export class FunctionObject implements BaseObject {
  /** The parameters of the function. */
  readonly parameters: Identifier[];
  /** The body of the function. */
  readonly body: BlockStatement;
  /** The environment in which the function was created. */
  readonly env: Environment;
  constructor(
    parameters: Identifier[],
    body: BlockStatement,
    env: Environment
  ) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  inspect(): string {
    return `fn(${this.parameters.map((p) => p.toString()).join(", ")}) {
      ...
    }`;
  }

  type(): ObjectType {
    return ObjectType.FUNCTION;
  }

  isTruthy(): boolean {
    return true;
  }
}

export class ReturnValue implements BaseObject {
  /** The value being returned. */
  value: BaseObject;

  /**
   * Creates a new ReturnValue.
   * @param {BaseObject} value - The value being returned.
   */
  constructor(value: BaseObject) {
    this.value = value;
  }

  inspect(): string {
    return this.value.inspect();
  }

  type(): ObjectType {
    return this.value.type();
  }

  isTruthy(): boolean {
    return true;
  }
}
