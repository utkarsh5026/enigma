import { BaseObject, ObjectType } from "../core/base";
import { Environment } from "../core/environment";
import { FunctionObject } from "./function";

/**
 * 🎭 InstanceObject - Runtime Instance Representation 🎭
 *
 * Represents an instance of a class during program execution.
 *
 * From first principles, an instance needs:
 * - Reference to its class (for method lookup)
 * - Instance variables (unique to this instance)
 * - Instance environment (for variable storage)
 * - Method binding (this pointer for method calls)
 *
 * Each instance is independent - they can have different values
 * for instance variables while sharing the same methods from their class.
 */
export class InstanceObject implements BaseObject {
  readonly classObject: ClassObject; // 🏛️ The class this is an instance of
  readonly properties: Map<string, BaseObject>; // 📦 Instance variables
  readonly instanceEnvironment: Environment; // 🌍 Instance-level environment

  public constructor(
    classObject: ClassObject,
    instanceEnvironment: Environment
  ) {
    this.classObject = classObject;
    this.properties = new Map();
    this.instanceEnvironment = instanceEnvironment;
    this.instanceEnvironment.defineVariable("this", this);
  }

  /**
   * 🔧 Sets an instance property
   *
   * Instance properties are specific to each object instance.
   * Setting a property only affects this instance, not others.
   */
  public setProperty(name: string, value: BaseObject) {
    this.properties.set(name, value);
    return value;
  }

  /**
   * 🔍 Gets an instance property
   *
   * Property lookup follows these steps:
   * 1. Check instance properties first
   * 2. If not found, could potentially check class for static properties
   * (not implemented in this basic version)
   */
  public getProperty(name: string) {
    return this.properties.get(name);
  }

  /**
   * ❓ Checks if this instance has a specific property
   */
  public hasProperty(name: string) {
    return this.properties.has(name);
  }

  /**
   * 📋 Gets all property names for this instance
   */
  public getPropertyNames() {
    return Array.from(this.properties.keys());
  }

  /**
   * 🔍 Finds a method in this instance's class hierarchy
   *
   * Method lookup delegates to the class object, which handles
   * the inheritance chain traversal.
   */
  public findMethod(methodName: string) {
    return this.classObject.findMethod(methodName);
  }

  /**
   * 🏗️ Gets the constructor for this instance's class
   */
  public getConstructor() {
    return this.classObject.classConstructor;
  }

  /**
   * ✅ Checks if this instance is of a specific class
   */
  public isInstanceOf(classObj: ClassObject) {
    return (
      this.classObject == classObj || this.classObject.isSubclassOf(classObj)
    );
  }

  public type(): ObjectType {
    return ObjectType.INSTANCE;
  }

  public inspect() {
    const sb = ["instance of ", this.classObject.name, " {"];

    let first = true;
    for (const [key, value] of this.properties.entries()) {
      if (!first) {
        sb.push(", ");
      }
      sb.push(key.toString(), ": ", value.inspect());
      first = false;
    }

    sb.push("}");
    return sb.join("");
  }

  public isTruthy() {
    return true; // Instances are always truthy
  }
}

/**
 * 🏛️ ClassObject - Runtime Class Representation 🏛️
 *
 * Represents a class during program execution. This is the runtime equivalent
 * of the ClassStatement AST node.
 *
 * From first principles, a class object needs to store:
 * - Class metadata (name, parent class)
 * - Constructor function
 * - Instance methods
 * - Class inheritance chain
 *
 * The class object serves as a template for creating instances and
 * provides method resolution for inheritance.
 */
export class ClassObject implements BaseObject {
  readonly name: string; // 🏷️ Class name
  readonly parentClass: ClassObject | null; // 🔗 Parent class for inheritance
  readonly classConstructor: FunctionObject | null; // 🏗️ Constructor function
  readonly methods: Map<string, FunctionObject>; // 📋 Instance methods
  readonly classEnvironment: Environment; // 🌍 Class-level environment

  public constructor(
    name: string,
    parentClass: ClassObject | null,
    classConstructor: FunctionObject | null,
    methods: Map<string, FunctionObject>,
    classEnvironment: Environment
  ) {
    this.name = name;
    this.parentClass = parentClass;
    this.classConstructor = classConstructor;
    this.methods = new Map(methods);
    this.classEnvironment = classEnvironment;
  }

  /**
   * 🔍 Finds a method in this class or parent classes (method resolution)
   *
   * From first principles, method resolution follows these steps:
   * 1. Check if method exists in current class
   * 2. If not found, check parent class recursively
   * 3. Continue up the inheritance chain until found or reach top
   *
   * This implements dynamic method dispatch for inheritance.
   */
  public findMethod(methodName: string): FunctionObject | null {
    const method = this.methods.get(methodName);
    if (method != null) {
      return method;
    }

    if (this.parentClass != null) {
      return this.parentClass.findMethod(methodName);
    }

    return null;
  }

  /**
   * ✅ Checks if this class inherits from another class
   */
  public hasParentClass() {
    return this.parentClass != null;
  }

  /**
   * ✅ Checks if this class has a constructor
   */
  public hasConstructor() {
    return this.classConstructor != null;
  }

  /**
   * 📜 Gets the complete inheritance chain
   *
   * Returns a list starting with this class and going up to the root.
   * Useful for debugging and reflection.
   */
  public getInheritanceChain() {
    const chain: ClassObject[] = [this];
    let current: ClassObject | null = this.parentClass;

    while (current != null) {
      chain.push(current);
      current = current.parentClass;
    }

    return chain;
  }

  /**
   * ✅ Checks if this class is a subclass of another class
   */
  public isSubclassOf(otherClass: ClassObject) {
    if (this == otherClass) {
      return false;
    }

    let current: ClassObject | null = this.parentClass;
    while (current != null) {
      if (current == otherClass) {
        return true;
      }
      current = current.parentClass;
    }

    return false;
  }

  /**
   * 🆕 Creates a new instance of this class
   *
   * From first principles, instance creation involves:
   * 1. Create a new InstanceObject
   * 2. Set up instance environment with class reference
   * 3. Instance is ready for constructor call
   */
  public createInstance() {
    return new InstanceObject(
      this,
      new Environment(this.classEnvironment, false)
    );
  }

  public type(): ObjectType {
    return ObjectType.CLASS;
  }

  public inspect() {
    const sb = ["class ", this.name];

    if (this.parentClass != null) {
      sb.push(" extends ", this.parentClass.name);
    }

    sb.push(" { ");

    if (this.classConstructor != null) {
      sb.push("constructor, ");
    }

    sb.push(this.methods.size.toString(), " methods }");

    return sb.toString();
  }

  public isTruthy() {
    return true;
  }
}
