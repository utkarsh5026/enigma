/* eslint-disable @typescript-eslint/no-explicit-any */

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
 * Safely gets a value from an object property, handling undefined/null cases
 */
const safeGet = (obj: any, path: string, defaultValue: string = ""): string => {
  try {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    return result !== null && result !== undefined
      ? String(result)
      : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Gets the actual value from an AST node, trying multiple properties
 */
const getNodeValue = (node: any): string => {
  if (!node) return "";

  // Direct value property
  if (node.value !== undefined && node.value !== null) {
    return String(node.value);
  }

  // Try toString method
  if (typeof node.toString === "function") {
    try {
      const stringValue = node.toString();
      if (stringValue && stringValue !== "[object Object]") {
        return stringValue;
      }
    } catch {
      // Continue to other methods
    }
  }

  // Try tokenLiteral method
  if (typeof node.tokenLiteral === "function") {
    try {
      const literal = node.tokenLiteral();
      if (literal) return literal;
    } catch {
      // Continue to other methods
    }
  }

  // For identifiers, try the literal from token
  if (node.token && node.token.literal) {
    return node.token.literal;
  }

  return "";
};

/**
 * Returns a simplified, user-friendly representation of a node
 * focusing on the most important properties with actual values
 */
export const getNodeSummary = (node: any): string => {
  if (!node) return "";

  const nodeType = node.constructor.name;

  try {
    switch (nodeType) {
      case "Identifier": {
        const value = getNodeValue(node);
        return value || "identifier";
      }

      case "IntegerLiteral": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return String(value) || "0";
      }

      case "StringLiteral": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return `"${value}"` || '""';
      }

      case "BooleanExpression": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return String(value) || "false";
      }

      case "PrefixExpression": {
        const operator = node.operator || safeGet(node, "token.literal", "!");
        const operand = node.right ? getNodeValue(node.right) : "";
        return `${operator}${operand}`;
      }

      case "InfixExpression": {
        const left = node.left ? getNodeValue(node.left) : "";
        const operator = node.operator || safeGet(node, "token.literal", "+");
        const right = node.right ? getNodeValue(node.right) : "";
        return `${left} ${operator} ${right}`;
      }

      case "LetStatement":
      case "ConstStatement": {
        const varName = node.name ? getNodeValue(node.name) : "";
        const prefix = nodeType === "LetStatement" ? "let" : "const";
        return `${prefix} ${varName}`;
      }

      case "ReturnStatement": {
        const returnValue = node.returnValue
          ? getNodeValue(node.returnValue)
          : "";
        return `return ${returnValue}`;
      }

      case "FunctionLiteral": {
        const paramCount = node.parameters ? node.parameters.length : 0;
        const paramNames = node.parameters
          ? node.parameters.map((p: any) => getNodeValue(p)).join(", ")
          : "";
        return `fn(${paramNames}) [${paramCount} params]`;
      }

      case "CallExpression": {
        const funcName = node.func ? getNodeValue(node.func) : "function";
        const argCount = node.args ? node.args.length : 0;
        return `${funcName}(${argCount} args)`;
      }

      case "IfExpression": {
        const conditionCount = node.conditions ? node.conditions.length : 1;
        const hasElse = node.alternative ? " + else" : "";
        return `if-elif-else (${conditionCount} conditions${hasElse})`;
      }

      case "WhileStatement": {
        const condition = node.condition ? getNodeValue(node.condition) : "";
        return `while (${condition || "..."})`;
      }

      case "ForStatement": {
        return "for (...; ...; ...)";
      }

      case "ArrayLiteral": {
        const elemCount = node.elements ? node.elements.length : 0;
        return `[${elemCount} elements]`;
      }

      case "HashLiteral": {
        const pairCount = node.pairs
          ? node.pairs.size || Object.keys(node.pairs).length
          : 0;
        return `{${pairCount} pairs}`;
      }

      case "IndexExpression": {
        const container = node.left ? getNodeValue(node.left) : "";
        const index = node.index ? getNodeValue(node.index) : "";
        return `${container}[${index}]`;
      }

      case "AssignmentExpression": {
        const varName = node.name ? getNodeValue(node.name) : "";
        return `${varName} = ...`;
      }

      case "BlockStatement": {
        const stmtCount = node.statements ? node.statements.length : 0;
        return `{ ${stmtCount} statements }`;
      }

      case "ExpressionStatement": {
        const expr = node.expression ? getNodeValue(node.expression) : "";
        return expr || "expression";
      }

      case "Program": {
        const stmtCount = node.statements ? node.statements.length : 0;
        return `Program (${stmtCount} statements)`;
      }

      case "BreakStatement":
        return "break";

      case "ContinueStatement":
        return "continue";

      default:
        return nodeType;
    }
  } catch (error) {
    console.warn(`Error getting summary for ${nodeType}:`, error);
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
  WhileStatement: `while (count < 10) {
    count = count + 1;
  }`,
  ForStatement: `for (let i = 0; i < 10; i = i + 1) {
    print(i);
  }`,
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

/**
 * Extract meaningful text content from an AST node for search purposes
 */
export const extractSearchableText = (node: any): string[] => {
  const searchable: string[] = [];

  if (!node) return searchable;

  // Add node type
  searchable.push(node.constructor.name);

  // Add node summary
  const summary = getNodeSummary(node);
  if (summary) searchable.push(summary);

  // Add specific searchable properties
  const value = getNodeValue(node);
  if (value) searchable.push(value);

  return searchable.filter((text) => text.length > 0);
};
