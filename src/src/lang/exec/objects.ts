import { ObjectType } from "./type";
import { Identifier } from "../ast/ast";
import { BlockStatement } from "../ast/statement";

/**
 * Represents an object in the Mutant programming language.
 */
export interface BaseObject {
  /** The type of the object. */
  type(): ObjectType;

  /**
   * Returns a string representation of the object.
   * @returns {string} A string representation of the object.
   */
  inspect(): string;
}

/**
 * Represents an environment for storing and retrieving variables.
 */
export class Environment {
  /** Stores the variables in the current environment. */
  store: Map<string, BaseObject>;
  /** Reference to the outer (enclosing) environment, if any. */
  outer: Environment | null;

  /**
   * Creates a new Environment.
   * @param {Environment | null} outer - The outer environment, if any.
   */
  constructor(outer: Environment | null = null) {
    this.store = new Map();
    this.outer = outer;
  }

  /**
   * Retrieves a variable from the environment.
   * @param {string} name - The name of the variable to retrieve.
   * @returns {BaseObject | null} The value of the variable, or null if not found.
   */
  get(name: string): BaseObject | null {
    const obj = this.store.get(name);
    if (obj === undefined && this.outer !== null) {
      return this.outer.get(name);
    }
    return obj || null;
  }

  /**
   * Sets a variable in the environment.
   * @param {string} name - The name of the variable to set.
   * @param {BaseObject} value - The value to assign to the variable.
   * @returns {BaseObject} The value that was set.
   */
  set(name: string, value: BaseObject): BaseObject {
    this.store.set(name, value);
    return value;
  }
}

/**
 * Represents an integer object in the Mutant programming language.
 */
export class IntegerObject implements BaseObject {
  /** The numeric value of the integer. */
  value: number;

  /**
   * Creates a new IntegerObject.
   * @param {number} value - The numeric value of the integer.
   */
  constructor(value: number) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }

  type(): ObjectType {
    return ObjectType.INTEGER;
  }
}

/**
 * Represents a boolean object in the Mutant programming language.
 */
export class BooleanObject implements BaseObject {
  /** The boolean value. */
  value: boolean;

  /**
   * Creates a new BooleanObject.
   * @param {boolean} value - The boolean value.
   */
  constructor(value: boolean) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }

  type(): ObjectType {
    return ObjectType.BOOLEAN;
  }
}

/**
 * Represents a null object in the Mutant programming language.
 */
export class NullObject implements BaseObject {
  inspect(): string {
    return "null";
  }

  type(): ObjectType {
    return ObjectType.NULL;
  }
}

/**
 * Represents an error object in the Mutant programming language.
 */
export class ErrorObject implements BaseObject {
  /** The error message. */
  message: string;

  /**
   * Creates a new ErrorObject.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    this.message = message;
  }

  inspect(): string {
    return `ERROR: ${this.message}`;
  }

  type(): ObjectType {
    return ObjectType.ERROR;
  }
}

/**
 * Represents a return value in the Mutant programming language.
 */
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
}

/**
 * Represents a function object in the Mutant programming language.
 */
export class FunctionObject implements BaseObject {
  /** The parameters of the function. */
  parameters: Identifier[];
  /** The body of the function. */
  body: BlockStatement;
  /** The environment in which the function was created. */
  env: Environment;

  /**
   * Creates a new FunctionObject.
   * @param {Identifier[]} parameters - The parameters of the function.
   * @param {BlockStatement} body - The body of the function.
   * @param {Environment} env - The environment in which the function was created.
   */
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
      ${this.body.toString()}
    }`;
  }

  type(): ObjectType {
    return ObjectType.FUNCTION;
  }
}

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

/**
 * Represents a hash object in the Mutant programming language.
 */
export class HashObject implements BaseObject {
  pairs: Map<BaseObject, BaseObject>;

  /**
   * Creates a new HashObject.
   * @param {Map<BaseObject, BaseObject>} pairs - The key-value pairs of the hash.
   */
  constructor(pairs: Map<BaseObject, BaseObject>) {
    this.pairs = pairs;
  }

  inspect(): string {
    const pairs = Array.from(this.pairs).map(
      ([key, value]) => `${key.inspect()}: ${value.inspect()}`
    );
    return `{${pairs.join(", ")}}`;
  }

  type(): ObjectType {
    return ObjectType.HASH;
  }
}

/**
 * Represents a string object in the Mutant programming language.
 */
export class StringObject implements BaseObject {
  value: string;

  /**
   * Creates a new StringObject.
   * @param {string} value - The string value.
   */
  constructor(value: string) {
    this.value = value;
  }

  inspect(): string {
    return this.value;
  }

  type(): ObjectType {
    return ObjectType.STRING;
  }
}

export const isError = (obj: BaseObject): obj is ErrorObject =>
  obj instanceof ErrorObject;

export const isArray = (obj: BaseObject): obj is ArrayObject =>
  obj instanceof ArrayObject;

export const isHash = (obj: BaseObject): obj is HashObject =>
  obj instanceof HashObject;

export const isString = (obj: BaseObject): obj is StringObject =>
  obj instanceof StringObject;

export const isInteger = (obj: BaseObject): obj is IntegerObject =>
  obj instanceof IntegerObject;

export const isBoolean = (obj: BaseObject): obj is BooleanObject =>
  obj instanceof BooleanObject;

export const isNull = (obj: BaseObject): obj is NullObject =>
  obj instanceof NullObject;

export const isFunction = (obj: BaseObject): obj is FunctionObject =>
  obj instanceof FunctionObject;

export const isReturnValue = (obj: BaseObject): obj is ReturnValue =>
  obj instanceof ReturnValue;
