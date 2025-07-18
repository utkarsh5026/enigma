export const keywords = [
  "fn",
  "let",
  "const",
  "if",
  "elif",
  "else",
  "while",
  "for",
  "break",
  "continue",
  "return",
  "true",
  "false",
  "null",
  "class",
  "extends",
  "super",
  "this",
  "new",
];

export const builtinFunctions = [
  "len",
  "type",
  "str",
  "int",
  "bool",
  "first",
  "last",
  "rest",
  "push",
  "pop",
  "slice",
  "concat",
  "reverse",
  "join",
  "split",
  "replace",
  "trim",
  "upper",
  "lower",
  "substr",
  "indexOf",
  "contains",
  "abs",
  "max",
  "min",
  "round",
  "floor",
  "ceil",
  "pow",
  "sqrt",
  "random",
  "print",
  "println",
  "range",
  "keys",
  "values",
  "error",
  "assert",
];

export const operators = [
  "=",
  "+",
  "-",
  "!",
  "*",
  "/",
  "%",
  "<",
  ">",
  "==",
  "!=",
  "<=",
  ">=",
  "+=",
  "-=",
  "*=",
  "/=",
  "&&",
  "||",
  "&",
  "|",
  "^",
  "~",
  "<<",
  ">>",
];

// Helper functions for documentation
export const getKeywordDocumentation = (keyword: string): string => {
  const docs: Record<string, string> = {
    fn: "Declares a function with parameters and return value",
    let: "Declares a mutable variable",
    const: "Declares an immutable constant",
    if: "Conditional statement for branching logic",
    else: "Alternative branch for if statements",
    elif: "Additional condition for if statements",
    while: "Loop that executes while condition is true",
    for: "Loop with initialization, condition, and increment",
    return: "Returns a value from a function",
    break: "Exits from a loop",
    continue: "Skips to next iteration of a loop",
    true: "Boolean true value",
    false: "Boolean false value",
    null: "Represents absence of value",
  };
  return docs[keyword] || "";
};

export const getBuiltinSignature = (func: string): string => {
  const signatures: Record<string, string> = {
    len: "len(obj) → int",
    type: "type(obj) → string",
    str: "str(obj) → string",
    print: "print(...args) → null",
    println: "println(...args) → null",
    push: "push(array, element) → array",
    pop: "pop(array) → array",
    first: "first(array) → any",
    last: "last(array) → any",
  };
  return signatures[func] || `${func}(...)`;
};

export const getBuiltinDocumentation = (func: string): string => {
  const docs: Record<string, string> = {
    len: "Returns the length of arrays, strings, or hash objects",
    type: "Returns the type of an object as a string",
    str: "Converts any value to its string representation",
    print: "Prints values to console without newline",
    println: "Prints values to console with newline",
    push: "Adds element to end of array, returns new array",
    pop: "Removes last element from array, returns new array",
  };
  return docs[func] || `Built-in function: ${func}`;
};

export const getHoverDocumentation = (word: string): string | null => {
  const keywordDoc = getKeywordDocumentation(word);
  if (keywordDoc) return keywordDoc;

  const builtinDoc = getBuiltinDocumentation(word);
  if (builtinDoc !== `Built-in function: ${word}`) return builtinDoc;

  return null;
};
