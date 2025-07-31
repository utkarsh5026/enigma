import * as objects from "../objects";
import { BaseObject } from "./base";

/**
 * 🔍 ObjectValidator - Type Checker
 *
 * Validates and checks the type of objects.
 *
 * @example
 * - ObjectValidator.isError(obj) -> true if obj is an ErrorObject
 * - ObjectValidator.isNumeric(obj) -> true if obj is an IntegerObject or FloatObject
 * - ObjectValidator.isString(obj) -> true if obj is a StringObject
 */
export class ObjectValidator {
  /**
   * Checks if the object is an error object
   */
  static isError(obj: BaseObject): obj is objects.ErrorObject {
    return obj instanceof objects.ErrorObject;
  }

  /**
   * Checks if the object is an array object
   */
  static isArray(obj: BaseObject): obj is objects.ArrayObject {
    return obj instanceof objects.ArrayObject;
  }

  /**
   * Checks if the object is a hash/map object
   */
  static isHash(obj: BaseObject): obj is objects.HashObject {
    return obj instanceof objects.HashObject;
  }

  /**
   * Checks if the object is a string object
   */
  static isString(obj: BaseObject): obj is objects.StringObject {
    return obj instanceof objects.StringObject;
  }

  /**
   * Checks if the object is an integer object
   */
  static isInteger(obj: BaseObject): obj is objects.IntegerObject {
    return obj instanceof objects.IntegerObject;
  }

  /**
   * Checks if the object is a function object
   */
  static isFunction(obj: BaseObject): obj is objects.FunctionObject {
    return obj instanceof objects.FunctionObject;
  }

  /**
   * Checks if the object is a return value object
   */
  static isReturnValue(obj: BaseObject): obj is objects.ReturnValueObject {
    return obj instanceof objects.ReturnValueObject;
  }

  /**
   * Checks if the object is a break statement object
   */
  static isBreak(obj: BaseObject): obj is objects.BreakObject {
    return obj instanceof objects.BreakObject;
  }

  /**
   * Checks if the object is a continue statement object
   */
  static isContinue(obj: BaseObject): obj is objects.ContinueObject {
    return obj instanceof objects.ContinueObject;
  }

  /**
   * Checks if the object is a boolean object
   */
  static isBoolean(obj: BaseObject): obj is objects.BooleanObject {
    return obj instanceof objects.BooleanObject;
  }

  /**
   * Checks if the object is a null object
   */
  static isNull(obj: BaseObject): obj is objects.NullObject {
    return obj instanceof objects.NullObject;
  }

  /**
   * Checks if the object is a builtin function object
   */
  static isBuiltin(obj: BaseObject): obj is objects.BuiltinObject {
    return obj instanceof objects.BuiltinObject;
  }

  /**
   * Checks if the object is a float object
   */
  static isFloat(obj: BaseObject): obj is objects.FloatObject {
    return obj instanceof objects.FloatObject;
  }

  /**
   * Checks if the object is numeric (integer or float)
   */
  static isNumeric(obj: BaseObject): boolean {
    return ObjectValidator.isInteger(obj) || ObjectValidator.isFloat(obj);
  }

  /**
   * Checks if the object is a class object
   */
  static isClass(obj: BaseObject): obj is objects.ClassObject {
    return obj instanceof objects.ClassObject;
  }

  /**
   * Checks if the object is a class instance object
   */
  static isInstance(obj: BaseObject): obj is objects.InstanceObject {
    return obj instanceof objects.InstanceObject;
  }
}
