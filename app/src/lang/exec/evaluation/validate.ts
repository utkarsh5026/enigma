import * as objects from "../objects";

export class ObjectValidator {
  /**
   * 🚨 **Error Detector - Trouble Spotter**
   *
   * Checks if an object is an error - like a smoke detector for code problems!
   *
   *
   * Object → instanceof ErrorObject? → Yes: ✅ It's an error!
   *       → No: ❌ Not an error
   *
   *
   * @param obj 📦 The mysterious object to investigate
   * @returns 🎯 True if it's an ErrorObject, false otherwise
   */
  static isError(obj: objects.BaseObject): obj is objects.ErrorObject {
    return obj instanceof objects.ErrorObject;
  }

  /**
   * 📋 **Array Detector - List Hunter**
   *
   * Checks if an object is an array - like checking if a box contains a shopping list!
   *
   *
   * Object → instanceof ArrayObject? → Yes: ✅ It's an array!
   *       → No: ❌ Not an array
   *
   *
   * @param obj 📦 The object under investigation
   * @returns 🎯 True if it's an ArrayObject, false otherwise
   */
  static isArray(obj: objects.BaseObject): obj is objects.ArrayObject {
    return obj instanceof objects.ArrayObject;
  }

  /**
   * 🗂️ **Hash Detector - Dictionary Detective**
   *
   * Checks if an object is a hash/dictionary - like checking if something is a filing cabinet!
   *
   *
   *
   * Object → instanceof HashObject? → Yes: ✅ It's a hash!
   *       → No: ❌ Not a hash
   *
   *
   * @param obj 📦 The suspect object to examine
   * @returns 🎯 True if it's a HashObject, false otherwise
   */
  static isHash(obj: objects.BaseObject): obj is objects.HashObject {
    return obj instanceof objects.HashObject;
  }

  /**
   * 📝 **String Detector - Text Scout**
   *
   * Checks if an object is a string - like checking if something contains words!
   *
   *
   * ```
   * Object → instanceof StringObject? → Yes: ✅ It's a string!
   *       → No: ❌ Not a string
   * ```
   *
   * @param obj 📦 The object to check for stringiness
   * @returns 🎯 True if it's a StringObject, false otherwise
   */
  static isString(obj: objects.BaseObject): obj is objects.StringObject {
    return obj instanceof objects.StringObject;
  }

  /**
   * 🔢 **Integer Detector - Number Spotter**
   *
   * Checks if an object is an integer - like checking if something is a whole number!
   *
   *
   * ```
   * Object → instanceof IntegerObject? → Yes: ✅ It's an integer!
   *       → No: ❌ Not an integer
   * ```
   *
   * @param obj 📦 The object to test for numberness
   * @returns 🎯 True if it's an IntegerObject, false otherwise
   */
  static isInteger(obj: objects.BaseObject): obj is objects.IntegerObject {
    return obj instanceof objects.IntegerObject;
  }

  /**
   * ⚡ **Function Detector - Code Block Hunter**
   *
   * Checks if an object is a function - like checking if something is executable code!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof FunctionObject? → Yes: ✅ It's a function!
   *       → No: ❌ Not a function
   * ```
   *
   * @param obj 📦 The object to check for function-ness
   * @returns 🎯 True if it's a FunctionObject, false otherwise
   */
  static isFunction(obj: objects.BaseObject): obj is objects.FunctionObject {
    return obj instanceof objects.FunctionObject;
  }

  /**
   * 🔙 **Return Value Detector - Exit Signal Spotter**
   *
   * Checks if an object is a return value - like checking if someone is trying to leave early!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof ReturnValue? → Yes: ✅ It's a return value!
   *       → No: ❌ Not a return value
   * ```
   *
   * @param obj 📦 The object to check for return status
   * @returns 🎯 True if it's a ReturnValue, false otherwise
   */
  static isReturnValue(
    obj: objects.BaseObject
  ): obj is objects.ReturnValueObject {
    return obj instanceof objects.ReturnValueObject;
  }

  /**
   * 🛑 **Break Detector - Loop Escape Spotter**
   *
   * Checks if an object is a break statement - like checking if someone wants to exit a loop!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof BreakObject? → Yes: ✅ It's a break!
   *       → No: ❌ Not a break
   * ```
   *
   * @param obj 📦 The object to check for break-ness
   * @returns 🎯 True if it's a BreakObject, false otherwise
   */
  static isBreak(obj: objects.BaseObject): obj is objects.BreakObject {
    return obj instanceof objects.BreakObject;
  }

  /**
   * ⏭️ **Continue Detector - Loop Skip Spotter**
   *
   * Checks if an object is a continue statement - like checking if someone wants to skip to the next iteration!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof ContinueObject? → Yes: ✅ It's a continue!
   *       → No: ❌ Not a continue
   * ```
   *
   * @param obj 📦 The object to check for continue-ness
   * @returns 🎯 True if it's a ContinueObject, false otherwise
   */
  static isContinue(obj: objects.BaseObject): obj is objects.ContinueObject {
    return obj instanceof objects.ContinueObject;
  }

  /**
   * 🔄 **Boolean Detector - True/False Spotter**
   *
   * Checks if an object is a boolean - like checking if something is true or false!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof BooleanObject? → Yes: ✅ It's a boolean!
   *
   *
   */
  static isBoolean(obj: objects.BaseObject): obj is objects.BooleanObject {
    return obj instanceof objects.BooleanObject;
  }

  /**
   * 🔄 **Null Detector - Empty Spotter**
   *
   * Checks if an object is null - like checking if something is empty!
   *
   * **Flow Chart**:
   * ```
   * Object → instanceof NullObject? → Yes: ✅ It's null!
   *       → No: ❌ Not null
   * ```
   *
   * @param obj 📦 The object to check for null-ness
   * @returns 🎯 True if it's a NullObject, false otherwise
   */
  static isNull(obj: objects.BaseObject): obj is objects.NullObject {
    return obj instanceof objects.NullObject;
  }

  static isBuiltin(obj: objects.BaseObject): obj is objects.BuiltinObject {
    return obj instanceof objects.BuiltinObject;
  }
}
