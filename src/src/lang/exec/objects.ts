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
  private readonly _store: Map<string, BaseObject>;
  /** Reference to the outer (enclosing) environment, if any. */
  private readonly _outer: Environment | null;
  /** A set of constant variables in the environment. */
  private constants: Set<string>;
  /** Indicates if the environment is a block scope. */
  private readonly _isBlockScope: boolean;

  /**
   * Creates a new Environment.
   * @param {Environment | null} outer - The outer environment, if any.
   */
  constructor(outer: Environment | null = null, isBlockScope: boolean = false) {
    this._store = new Map();
    this._outer = outer;
    this.constants = new Set();
    this._isBlockScope = isBlockScope;
  }

  /**
   * Retrieves a variable from the environment.
   * @param {string} name - The name of the variable to retrieve.
   * @returns {BaseObject | null} The value of the variable, or null if not found.
   */
  get(name: string): BaseObject | null {
    const obj = this._store.get(name);
    if (obj === undefined && this._outer !== null) {
      return this._outer.get(name);
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
    this._store.set(name, value);
    return value;
  }

  /**
   * Checks if a variable is a constant in the current or any outer environment.
   * @param {string} name - The name of the variable to check.
   * @returns {boolean} True if the variable is a constant, false otherwise.
   */
  isConstant(name: string): boolean {
    return (
      this.constants.has(name) ||
      (this._outer !== null && this._outer.isConstant(name))
    );
  }

  /**
   * Creates a new block scope environment.
   * @returns {Environment} A new Environment instance representing a block scope.
   */
  newBlockScope(): Environment {
    return new Environment(this, true);
  }

  /**
   * Checks if the current environment is a block scope.
   * @returns {boolean} True if the environment is a block scope, false otherwise.
   */
  isBlockScope(): boolean {
    return this._isBlockScope;
  }

  /**
   * Gets the outer environment.
   * @returns {Environment | null} The outer environment, or null if there isn't one.
   */
  outer(): Environment | null {
    return this._outer;
  }

  /**
   * Gets the store of variables in the current environment.
   * @returns {Map<string, BaseObject>} The map of variable names to their values.
   */
  store(): Map<string, BaseObject> {
    return this._store;
  }

  /**
   * Sets a constant variable in the environment.
   * @param {string} name - The name of the constant to set.
   * @param {BaseObject} value - The value to assign to the constant.
   * @returns {BaseObject} The value that was set.
   */
  setConst(name: string, value: BaseObject): BaseObject {
    this.constants.add(name);
    return this.set(name, value);
  }

  /**
   * Checks if a variable exists in the current environment.
   * @param {string} name - The name of the variable to check.
   * @returns {boolean} True if the variable exists, false otherwise.
   */
  has(name: string): boolean {
    return this._store.has(name);
  }

  /**
   * Finds the environment where a variable is defined.
   * @param {string} name - The name of the variable to find.
   * @returns {Environment | null} The environment where the variable is defined, or null if not found.
   */
  getDefiningScope(name: string): Environment | null {
    if (this.has(name)) return this;
    if (this._outer === null) return null;
    return this._outer.getDefiningScope(name);
  }

  /**
   * Sets a variable in the nearest scope where it's defined, or in the current scope if not found.
   * @param {string} name - The name of the variable to set.
   * @param {BaseObject} value - The value to assign to the variable.
   * @returns {BaseObject} The value that was set.
   */
  setInNearestScope(name: string, value: BaseObject): BaseObject {
    const definingScope = this.getDefiningScope(name);
    if (definingScope) {
      return definingScope.set(name, value);
    } else {
      // If not found in any outer scope, set in current scope
      return this.set(name, value);
    }
  }

  /**
   * Finds the nearest function scope environment.
   * @returns {Environment | null} The nearest function scope environment, or null if not found.
   */
  getNearestFunctionScope(): Environment | null {
    if (!this.isBlockScope) return this;
    if (this._outer) return this._outer.getNearestFunctionScope();
    return null;
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
  /** The bound instance for this function, if any. */
  boundInstance: InstanceObject | null;

  /**
   * Creates a new FunctionObject.
   * @param {Identifier[]} parameters - The parameters of the function.
   * @param {BlockStatement} body - The body of the function.
   * @param {Environment} env - The environment in which the function was created.
   */
  constructor(
    parameters: Identifier[],
    body: BlockStatement,
    env: Environment,
    boundInstance: InstanceObject | null = null
  ) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
    this.boundInstance = boundInstance;
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
}

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

/**
 * Dumps the scope chain of an environment.
 * @param {Environment} env - The environment to dump.
 * @returns {string} A string representation of the scope chain.
 */
export function dumpScopeChain(env: Environment): string {
  let scopeChain = "";
  let depth = 0;
  let currentEnv: Environment | null = env;

  while (currentEnv !== null) {
    scopeChain += `${" ".repeat(depth * 2)}Scope (${
      currentEnv.isBlockScope() ? "Block" : "Function"
    }):\n`;

    for (const [key, value] of currentEnv.store()) {
      scopeChain += `${" ".repeat(depth * 2 + 2)}${key}: ${value.inspect()}\n`;
    }

    currentEnv = currentEnv.outer();
    depth++;
  }

  return scopeChain;
}
