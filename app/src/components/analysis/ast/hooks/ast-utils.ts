/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Maps node types to descriptions for better readability in the UI
 */
export const nodeDescriptions: Record<string, string> = {
  // Core Program Structure
  Program: "Root program node containing all statements",

  // Variable Declarations
  LetStatement: "Variable declaration with 'let' keyword",
  ConstStatement: "Constant declaration with 'const' keyword",

  // Control Flow Statements
  ReturnStatement: "Return statement to exit functions with a value",
  IfExpression:
    "Conditional execution based on a condition with optional elif/else",
  WhileStatement: "Loop that executes while a condition is true",
  ForStatement: "Loop with initialization, condition and increment",
  BreakStatement: "Statement to exit a loop early",
  ContinueStatement: "Statement to skip to the next loop iteration",

  // Statement Types
  ExpressionStatement: "A statement consisting of a single expression",
  BlockStatement: "Block of statements within braces {}",

  // Object-Oriented Programming
  ClassStatement: "Class definition with optional inheritance",
  NewExpression: "Object instantiation using 'new' keyword",
  PropertyExpression: "Property access using dot notation (obj.prop)",
  ThisExpression: "Reference to current object instance",
  SuperExpression: "Reference to parent class methods/constructor",

  // Basic Expressions
  Identifier: "Variable or function name",
  AssignmentExpression: "Assignment of a value to a variable or property",

  // Literal Values
  IntegerLiteral: "Numeric integer value",
  FloatLiteral: "Numeric floating-point value",
  StringLiteral: "Text string enclosed in quotes",
  FStringLiteral: "Formatted string with embedded expressions",
  BooleanExpression: "Boolean value (true/false)",
  NullExpression: "Null value representing absence of data",
  ArrayLiteral: "Array of expressions [item1, item2, ...]",
  HashLiteral: "Key-value collection {key: value, ...}",
  FunctionLiteral: "Function definition with parameters and body",

  // Operations
  PrefixExpression: "Unary operation applied before an expression (!x, -y)",
  InfixExpression: "Binary operation between two expressions (a + b, x == y)",
  CallExpression: "Function invocation with arguments",
  IndexExpression: "Array/hash element access by index/key",
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

      case "FloatLiteral": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return String(value) || "0.0";
      }

      case "StringLiteral": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return `"${value}"`;
      }

      case "BooleanExpression": {
        const value =
          node.value !== undefined ? node.value : getNodeValue(node);
        return String(value) || "false";
      }

      case "NullExpression": {
        return "null";
      }

      case "ThisExpression": {
        return "this";
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

      case "ClassStatement": {
        const className = node.name ? getNodeValue(node.name) : "";
        const parentClass = node.parentClass
          ? getNodeValue(node.parentClass)
          : "";
        const inheritance = parentClass ? ` extends ${parentClass}` : "";
        return `class ${className}${inheritance}`;
      }

      case "NewExpression": {
        const className = node.className ? getNodeValue(node.className) : "";
        const argCount = node.arguments ? node.arguments.length : 0;
        return `new ${className}(${argCount} args)`;
      }

      case "PropertyExpression": {
        const object = node.object ? getNodeValue(node.object) : "";
        const property = node.property ? getNodeValue(node.property) : "";
        return `${object}.${property}`;
      }

      case "SuperExpression": {
        const method = node.method ? getNodeValue(node.method) : "";
        const argCount = node.arguments ? node.arguments.length : 0;
        if (method) {
          return `super.${method}(${argCount} args)`;
        } else {
          return `super(${argCount} args)`;
        }
      }

      case "FStringLiteral": {
        const staticStrings = node.actualStrings || [];
        const expressions = node.expressions || [];
        const parts = [];

        for (
          let i = 0;
          i < Math.min(staticStrings.length, expressions.length);
          i++
        ) {
          parts.push(staticStrings[i]);
          parts.push(`{${getNodeValue(expressions[i])}}`);
        }

        if (staticStrings.length > expressions.length) {
          parts.push(staticStrings[staticStrings.length - 1]);
        }

        return `f"${parts.join("")}"`;
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
        const funcName = node.function
          ? getNodeValue(node.function)
          : "function";
        const argCount = node.arguments ? node.arguments.length : 0;
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
        const initializer = node.initializer
          ? getNodeValue(node.initializer)
          : "";
        const condition = node.condition ? getNodeValue(node.condition) : "";
        const increment = node.increment ? getNodeValue(node.increment) : "";
        return `for (${initializer}; ${condition}; ${increment})`;
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
        const target = node.target ? getNodeValue(node.target) : "";
        return `${target} = ...`;
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
  return ["LetStatement", "ConstStatement", "ClassStatement"].includes(
    nodeType
  );
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
 * Check if a node is object-oriented programming related
 */
export const isOOP = (nodeType: string): boolean => {
  return [
    "ClassStatement",
    "NewExpression",
    "PropertyExpression",
    "ThisExpression",
    "SuperExpression",
  ].includes(nodeType);
};

/**
 * Check if a node is a literal value
 */
export const isLiteral = (nodeType: string): boolean => {
  return [
    "IntegerLiteral",
    "FloatLiteral",
    "StringLiteral",
    "FStringLiteral",
    "BooleanExpression",
    "NullExpression",
    "ArrayLiteral",
    "HashLiteral",
    "FunctionLiteral",
  ].includes(nodeType);
};

/**
 * Get appropriate icon name for a node type
 */
export const getNodeIcon = (nodeType: string): string => {
  if (isDeclaration(nodeType)) return "Variable";
  if (isControlFlow(nodeType)) return "GitBranch";
  if (isOOP(nodeType)) return "Layers";
  if (isLiteral(nodeType)) return "Hash";

  const iconMap: Record<string, string> = {
    Program: "Code",
    ExpressionStatement: "Terminal",
    BlockStatement: "Braces",
    Identifier: "Tag",
    PrefixExpression: "ArrowRight",
    InfixExpression: "ArrowLeftRight",
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
  // Variable Declarations
  LetStatement: "let x = 5;",
  ConstStatement: "const PI = 3.14159;",

  // Control Flow
  ReturnStatement: "return result;",
  IfExpression:
    "if (x > 5) { return true; } elif (x == 0) { return false; } else { return null; }",
  WhileStatement: `while (count < 10) {
    count += 1;
  }`,
  ForStatement: `for (let i = 0; i < 10; i += 1) {
    print(i);
  }`,
  BreakStatement: "break;",
  ContinueStatement: "continue;",

  // Object-Oriented Programming
  ClassStatement: `class Animal {
    constructor(name) {
      this.name = name;
    }
    
    speak() {
      return this.name + " makes a sound";
    }
  }`,
  NewExpression: "let dog = new Animal('Rex');",
  PropertyExpression: "dog.name or person.age",
  ThisExpression: "this.name or this.method()",
  SuperExpression: "super(args) or super.method(args)",

  // Statements
  ExpressionStatement: "someFunction();",
  BlockStatement: "{ statement1; statement2; }",

  // Literals
  Identifier: "variableName",
  IntegerLiteral: "42",
  FloatLiteral: "3.14159 or 1.23e-4",
  StringLiteral: '"Hello, world!"',
  FStringLiteral: 'f"Hello, {name}! You are {age} years old."',
  BooleanExpression: "true or false",
  NullExpression: "null",
  ArrayLiteral: "[1, 2.5, 'hello', true, null]",
  HashLiteral: '{"name": "John", "age": 30, "active": true}',
  FunctionLiteral: "fn(x, y) { return x + y; }",

  // Operations
  PrefixExpression: "-x or !condition",
  InfixExpression: "a + b or x == y or name && active",
  CallExpression: "add(5, 10) or person.speak()",
  IndexExpression: 'myArray[0] or myHash["key"]',
  AssignmentExpression: "x = 42 or person.age = 25",
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

  // Add category information
  const nodeType = node.constructor.name;
  if (isDeclaration(nodeType)) searchable.push("declaration");
  if (isControlFlow(nodeType)) searchable.push("control flow");
  if (isOOP(nodeType)) searchable.push("object oriented", "oop");
  if (isLiteral(nodeType)) searchable.push("literal", "value");

  return searchable.filter((text) => text.length > 0);
};
