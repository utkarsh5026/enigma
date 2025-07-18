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
  static isError(obj: BaseObject): obj is objects.ErrorObject {
    return obj instanceof objects.ErrorObject;
  }

  static isArray(obj: BaseObject): obj is objects.ArrayObject {
    return obj instanceof objects.ArrayObject;
  }

  static isHash(obj: BaseObject): obj is objects.HashObject {
    return obj instanceof objects.HashObject;
  }

  static isString(obj: BaseObject): obj is objects.StringObject {
    return obj instanceof objects.StringObject;
  }

  static isInteger(obj: BaseObject): obj is objects.IntegerObject {
    return obj instanceof objects.IntegerObject;
  }

  static isFunction(obj: BaseObject): obj is objects.FunctionObject {
    return obj instanceof objects.FunctionObject;
  }

  static isReturnValue(obj: BaseObject): obj is objects.ReturnValueObject {
    return obj instanceof objects.ReturnValueObject;
  }

  static isBreak(obj: BaseObject): obj is objects.BreakObject {
    return obj instanceof objects.BreakObject;
  }

  static isContinue(obj: BaseObject): obj is objects.ContinueObject {
    return obj instanceof objects.ContinueObject;
  }

  static isBoolean(obj: BaseObject): obj is objects.BooleanObject {
    return obj instanceof objects.BooleanObject;
  }

  static isNull(obj: BaseObject): obj is objects.NullObject {
    return obj instanceof objects.NullObject;
  }

  static isBuiltin(obj: BaseObject): obj is objects.BuiltinObject {
    return obj instanceof objects.BuiltinObject;
  }

  static isFloat(obj: BaseObject): obj is objects.FloatObject {
    return obj instanceof objects.FloatObject;
  }

  static isNumeric(obj: BaseObject): boolean {
    return ObjectValidator.isInteger(obj) || ObjectValidator.isFloat(obj);
  }
}
