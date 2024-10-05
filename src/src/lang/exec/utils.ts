import * as objects from "./objects";

function isError(obj: objects.BaseObject): obj is objects.ErrorObject {
  return obj instanceof objects.ErrorObject;
}

function isArray(obj: objects.BaseObject): obj is objects.ArrayObject {
  return obj instanceof objects.ArrayObject;
}

function isHash(obj: objects.BaseObject): obj is objects.HashObject {
  return obj instanceof objects.HashObject;
}

function isString(obj: objects.BaseObject): obj is objects.StringObject {
  return obj instanceof objects.StringObject;
}

function isInteger(obj: objects.BaseObject): obj is objects.IntegerObject {
  return obj instanceof objects.IntegerObject;
}

function isFunction(obj: objects.BaseObject): obj is objects.FunctionObject {
  return obj instanceof objects.FunctionObject;
}

function isReturnValue(obj: objects.BaseObject): obj is objects.ReturnValue {
  return obj instanceof objects.ReturnValue;
}

function isBreak(obj: objects.BaseObject): obj is objects.BreakObject {
  return obj instanceof objects.BreakObject;
}

function isContinue(obj: objects.BaseObject): obj is objects.ContinueObject {
  return obj instanceof objects.ContinueObject;
}

export {
  isError,
  isArray,
  isHash,
  isString,
  isInteger,
  isFunction,
  isReturnValue,
  isBreak,
  isContinue,
};
