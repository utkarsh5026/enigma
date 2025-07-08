import { BUILTINS } from "./functions";
import { BuiltinObject } from "../objects/builtin";

export function isBuiltin(name: string): boolean {
  return BUILTINS.has(name);
}

export function getBuiltin(name: string): BuiltinObject | null {
  return BUILTINS.get(name) || null;
}

export function getAllBuiltinNames(): string[] {
  return Array.from(BUILTINS.keys()).sort();
}

export function getBuiltinsByCategory(): Record<string, string[]> {
  return {
    "Core Data": ["len", "type", "str", "int", "bool"],
    "Array Operations": [
      "first",
      "last",
      "rest",
      "push",
      "pop",
      "slice",
      "concat",
      "reverse",
      "join",
    ],
    "String Operations": [
      "split",
      "replace",
      "trim",
      "upper",
      "lower",
      "substr",
      "indexOf",
      "contains",
    ],
    "Math Operations": [
      "abs",
      "max",
      "min",
      "round",
      "floor",
      "ceil",
      "pow",
      "sqrt",
      "random",
    ],
    "I/O Operations": ["print", "println"],
    Utilities: ["range", "keys", "values"],
    "Error Handling": ["error", "assert"],
  };
}
