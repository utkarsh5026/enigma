/**
 * Utility functions for working with AST nodes
 */

/**
 * Maps node types to descriptions for better readability in the UI
 */
export const nodeDescriptions: Record<string, string> = {
  Program: "Root program node containing all statements",
  LetStatement: "Variable declaration with 'let' keyword",
  ConstStatement: "Constant declaration with 'const' keyword",
  ReturnStatement: "Return statement to exit functions with a value",
  ExpressionStatement: "A statement consisting of a single expression",
  BlockStatement: "Block of statements within braces {}",
  WhileStatement: "Loop that executes while a condition is true",
  ForStatement: "Loop with initialization, condition and increment",
  BreakStatement: "Statement to exit a loop early",
  ContinueStatement: "Statement to skip to the next loop iteration",
  Identifier: "Variable or function name",
  IntegerLiteral: "Numeric integer value",
  StringLiteral: "Text string enclosed in quotes",
  BooleanExpression: "Boolean value (true/false)",
  ArrayLiteral: "Array of expressions [item1, item2, ...]",
  HashLiteral: "Key-value collection {key: value, ...}",
  PrefixExpression: "Operation applied before an expression (!x, -y)",
  InfixExpression: "Operation between two expressions (a + b)",
  IfExpression: "Conditional execution based on a condition",
  FunctionLiteral: "Function definition with parameters and body",
  CallExpression: "Function invocation with arguments",
  IndexExpression: "Array/hash element access by index/key",
  AssignmentExpression: "Assignment of a value to a variable",
};

/**
 * Returns a simplified, user-friendly representation of a node
 * focusing on the most important properties
 */
export const getNodeSummary = (node: any): string => {
  if (!node) return "";

  const nodeType = node.constructor.name;

  switch (nodeType) {
    case "Identifier":
      return node.value || "";
    case "IntegerLiteral":
      return node.value?.toString() || "";
    case "StringLiteral":
      return `"${node.value || ""}"`;
    case "BooleanExpression":
      return node.value?.toString() || "";
    case "PrefixExpression":
      return node.operator || "";
    case "InfixExpression":
      return node.operator || "";
    case "LetStatement":
    case "ConstStatement":
      return node.name?.value || "";
    case "FunctionLiteral":
      const paramNames =
        node.parameters?.map((p: any) => p.value).join(", ") || "";
      return `fn(${paramNames})`;
    case "CallExpression":
      const funcName =
        node.func?.value || node.func?.constructor.name || "anonymous";
      return funcName;
    case "IfExpression":
      return "if/else";
    case "WhileStatement":
      return "while loop";
    case "ForStatement":
      return "for loop";
    case "ArrayLiteral":
      return `array[${node.elements?.length || 0}]`;
    case "HashLiteral":
      return `hash{${node.pairs?.size || 0}}`;
    case "IndexExpression":
      const indexedName = node.left?.value || "value";
      return `${indexedName}[...]`;
    case "AssignmentExpression":
      return `${node.name?.value || ""} =`;
    default:
      return nodeType;
  }
};

/**
 * Check if a node is a statement that introduces a new variable
 */
export const isDeclaration = (nodeType: string): boolean => {
  return ["LetStatement", "ConstStatement"].includes(nodeType);
};

/**
 * Check if a node is a control flow statement
 */
export const isControlFlow = (nodeType: string): boolean => {
  return [
    "IfExpression",
    "WhileStatement",
    "ForStatement",
    "ReturnStatement",
    "BreakStatement",
    "ContinueStatement",
  ].includes(nodeType);
};

/**
 * Get appropriate icon name for a node type
 */
export const getNodeIcon = (nodeType: string): string => {
  if (isDeclaration(nodeType)) return "Variable";
  if (isControlFlow(nodeType)) return "GitBranch";

  const iconMap: Record<string, string> = {
    Program: "Code",
    ExpressionStatement: "Terminal",
    BlockStatement: "Braces",
    Identifier: "Tag",
    IntegerLiteral: "Hash",
    StringLiteral: "Quote",
    BooleanExpression: "ToggleLeft",
    ArrayLiteral: "List",
    HashLiteral: "Database",
    PrefixExpression: "ArrowRight",
    InfixExpression: "ArrowLeftRight",
    FunctionLiteral: "Function",
    CallExpression: "Play",
    IndexExpression: "IndexCard",
    AssignmentExpression: "Equal",
  };

  return iconMap[nodeType] || "Circle";
};

/**
 * Get examples of each node type for documentation
 */
export const nodeExamples: Record<string, string> = {
  LetStatement: "let x = 5;",
  ConstStatement: "const PI = 3.14;",
  ReturnStatement: "return result;",
  ExpressionStatement: "someFunction();",
  BlockStatement: "{ statement1; statement2; }",
  WhileStatement: "while (count < 10) { count = count + 1; }",
  ForStatement: "for (let i = 0; i < 10; i = i + 1) { print(i); }",
  BreakStatement: "break;",
  ContinueStatement: "continue;",
  Identifier: "variableName",
  IntegerLiteral: "42",
  StringLiteral: '"Hello, world!"',
  BooleanExpression: "true or false",
  ArrayLiteral: "[1, 2, 3, 4]",
  HashLiteral: '{"key": "value", "name": "John"}',
  PrefixExpression: "-x or !condition",
  InfixExpression: "a + b or x == y",
  IfExpression: "if (x > 5) { return true; } else { return false; }",
  FunctionLiteral: "fn(x, y) { return x + y; }",
  CallExpression: "add(5, 10)",
  IndexExpression: 'myArray[0] or myHash["key"]',
  AssignmentExpression: "x = 42",
};
