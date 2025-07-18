import { BaseObject } from "../objects";

/**
 * Environment represents a lexical scope for variable storage and retrieval.
 */
export class Environment {
  private readonly variableBindings: Map<string, BaseObject>;
  private readonly enclosingScope: Environment | null;
  private readonly immutableVariableNames: Set<string>;
  private readonly representsBlockScope: boolean;

  constructor(
    enclosingScope?: Environment | null,
    representsBlockScope: boolean = false
  ) {
    this.variableBindings = new Map();
    this.enclosingScope = enclosingScope ?? null;
    this.immutableVariableNames = new Set();
    this.representsBlockScope = representsBlockScope;
  }

  /**
   * Retrieves a variable from this environment or any parent environment.
   *
   * This implements the SCOPE RESOLUTION algorithm:
   * 1. Check current environment
   * 2. If not found and there's a parent, recursively check parent
   * 3. Return null if not found anywhere
   */
  resolveVariable(variableName: string): BaseObject | null {
    const value = this.variableBindings.get(variableName);

    if (value === undefined && this.enclosingScope !== null) {
      return this.enclosingScope.resolveVariable(variableName);
    }

    return value ?? null;
  }

  /**
   * Defines a variable in the current environment.
   */
  defineVariable(variableName: string, value: BaseObject): BaseObject {
    this.variableBindings.set(variableName, value);
    return value;
  }

  /**
   * Defines a constant variable (cannot be reassigned).
   */
  defineConstant(constantName: string, value: BaseObject): BaseObject {
    this.immutableVariableNames.add(constantName);
    return this.defineVariable(constantName, value);
  }

  /**
   * Checks if a variable exists in the current environment only (not parents).
   */
  containsVariableLocally(variableName: string): boolean {
    return this.variableBindings.has(variableName);
  }

  /**
   * Checks if a variable is marked as constant in this environment or any parent.
   */
  isVariableImmutable(variableName: string): boolean {
    if (this.immutableVariableNames.has(variableName)) {
      return true;
    }

    return (
      this.enclosingScope !== null &&
      this.enclosingScope.isVariableImmutable(variableName)
    );
  }

  /**
   * Finds the environment where a variable is defined.
   * This is used for assignment operations - we need to modify the variable
   * in the scope where it was originally declared.
   */
  findVariableDeclarationScope(variableName: string): Environment | null {
    if (this.variableBindings.has(variableName)) {
      return this;
    }

    if (this.enclosingScope !== null) {
      return this.enclosingScope.findVariableDeclarationScope(variableName);
    }

    return null;
  }

  /**
   * Creates a new block scope that inherits from this environment.
   * Block scopes are used for { } blocks in code.
   */
  createChildBlockScope(): Environment {
    return new Environment(this, true);
  }

  /**
   * Creates a new function scope that inherits from this environment.
   * Function scopes are used for function bodies.
   */
  createChildFunctionScope(): Environment {
    return new Environment(this, false);
  }

  /**
   * Checks if this environment represents a block scope.
   */
  isBlockScope(): boolean {
    return this.representsBlockScope;
  }

  /**
   * Gets the enclosing (parent) scope.
   */
  getEnclosingScope(): Environment | null {
    return this.enclosingScope;
  }

  /**
   * Gets a copy of the local variable bindings in this scope.
   */
  getLocalVariableBindings(): Map<string, BaseObject> {
    return new Map(this.variableBindings);
  }

  /**
   * Gets all variable names in this scope only.
   */
  getLocalVariableNames(): string[] {
    return Array.from(this.variableBindings.keys());
  }

  /**
   * Gets all constant names in this scope only.
   */
  getLocalConstantNames(): string[] {
    return Array.from(this.immutableVariableNames);
  }

  /**
   * Gets the total number of variables in this scope.
   */
  getLocalVariableCount(): number {
    return this.variableBindings.size;
  }

  /**
   * Checks if this scope has any variables defined.
   */
  hasLocalVariables(): boolean {
    return this.variableBindings.size > 0;
  }

  /**
   * Removes a variable from this scope (if it exists locally).
   * Returns true if the variable was removed, false if it didn't exist.
   */
  removeLocalVariable(variableName: string): boolean {
    this.immutableVariableNames.delete(variableName); // Remove from constants too
    return this.variableBindings.delete(variableName);
  }

  /**
   * Clears all variables from this scope.
   */
  clearLocalVariables(): void {
    this.variableBindings.clear();
    this.immutableVariableNames.clear();
  }

  /**
   * Creates a snapshot of the current environment state for debugging.
   */
  createSnapshot(): EnvironmentSnapshot {
    return {
      variables: new Map(this.variableBindings),
      constants: new Set(this.immutableVariableNames),
      isBlockScope: this.representsBlockScope,
      hasParent: this.enclosingScope !== null,
    };
  }
}

/**
 * Snapshot interface for environment state.
 */
export interface EnvironmentSnapshot {
  variables: Map<string, BaseObject>;
  constants: Set<string>;
  isBlockScope: boolean;
  hasParent: boolean;
}
