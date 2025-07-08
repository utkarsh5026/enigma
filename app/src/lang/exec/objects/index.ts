import { ArrayObject } from "./array";
import {
  BooleanObject,
  IntegerObject,
  NullObject,
  StringObject,
} from "./literals";
import { BreakObject, ContinueObject } from "./loop";
import { ErrorObject } from "./error";
import {
  FunctionObject,
  ReturnValue as ReturnValueObject,
  Environment,
} from "./function";
import { HashObject } from "./hash";
import { ClassObject } from "./clas";
import { InstanceObject } from "./instance";
import { BaseObject, ObjectType } from "./base";
import { BuiltinObject } from "./builtin";

export {
  ArrayObject,
  BooleanObject,
  BreakObject,
  ContinueObject,
  ErrorObject,
  FunctionObject,
  ReturnValueObject,
  HashObject,
  IntegerObject,
  NullObject,
  BuiltinObject,
  StringObject,
  ClassObject,
  InstanceObject,
  type BaseObject,
  ObjectType,
  Environment,
};
