import {
  ArrowLeftRight,
  Code,
  Database,
  GitBranch,
  Variable,
  Play,
} from "lucide-react";

export const examplePrograms = [
  {
    title: "Fibonacci Sequence",
    description: "Calculate Fibonacci numbers recursively",
    code: `// Recursive Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);
`,
  },
  {
    title: "Array Manipulation",
    description: "Working with arrays and higher-order functions",
    code: `// Define an array
let numbers = [1, 2, 3, 4, 5];

// Map function
let map = fn(arr, f) {
  let iter = fn(arr, accumulated) {
    if (len(arr) == 0) {
      return accumulated;
    } else {
      return iter(rest(arr), push(accumulated, f(first(arr))));
    }
  };
  
  return iter(arr, []);
};

// Double each number
let doubled = map(numbers, fn(x) { return x * 2; });
`,
  },
  {
    title: "Hash Tables",
    description: "Using hash tables for key-value storage",
    code: `// Create a user record
let user = {
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true
};

// Access hash values
let name = user["name"];
let age = user["age"];

// Update a value
user["age"] = 31;

// Function that works with hashes
let greet = fn(person) {
  return "Hello, " + person["name"] + "!";
};

let greeting = greet(user);
`,
  },
  {
    title: "Control Flow",
    description: "Using if, else, and loops",
    code: `// Check number properties
let analyzeNumber = fn(num) {
  if (num < 0) {
    return "negative";
  } elif (num == 0) {
    return "zero";
  } else {
    if (num % 2 == 0) {
      return "positive even";
    } else {
      return "positive odd";
    }
  }
};

// While loop with break
let findDivisor = fn(num, start) {
  let i = start;
  while (i <= num / 2) {
    if (num % i == 0) {
      return i;
    }
    i = i + 1;
  }
  return num;
};

// Compound assignment
let counter = 0;
counter += 5;  // Same as: counter = counter + 5
`,
  },
  {
    title: "Closures",
    description: "Using closures to create factory functions",
    code: `// Function factory using closures
let makeAdder = fn(x) {
  return fn(y) { return x + y; };
};

let addFive = makeAdder(5);
let addTen = makeAdder(10);

let result1 = addFive(3);  // Returns 8
let result2 = addTen(3);   // Returns 13

// Counter factory
let makeCounter = fn() {
  let count = 0;
  return fn() {
    count = count + 1;
    return count;
  };
};

let counter = makeCounter();
let count1 = counter();  // Returns 1
let count2 = counter();  // Returns 2
`,
  },
];

export const languageFeatures = [
  {
    title: "Variables & Constants",
    icon: <Variable size={22} />,
    description:
      "Enigma supports dynamic typing with 'let' for variables and 'const' for constants that cannot be reassigned.",
    example: `let age = 25;
let name = "John";
const PI = 3.14159;`,
  },
  {
    title: "Functions",
    icon: <Code size={22} />,
    description:
      "First-class functions with closures that can be passed around as values and capture their environment.",
    example: `let add = fn(a, b) { 
  return a + b; 
};

// Anonymous function
let multiply = fn(x, y) { return x * y; };`,
  },
  {
    title: "Data Structures",
    icon: <Database size={22} />,
    description:
      "Built-in arrays and hash maps for structured data storage and manipulation.",
    example: `// Array
let numbers = [1, 2, 3, 4, 5];

// Hash map
let person = {"name": "Alice", "age": 30};`,
  },
  {
    title: "Control Flow",
    icon: <GitBranch size={22} />,
    description:
      "Conditional expressions and loops for controlling program execution flow.",
    example: `if (x > 10) {
  return "greater";
} elif (x < 0) {
  return "negative";
} else {
  return "small positive";
}

while (count < 10) {
  count += 1;
}`,
  },
  {
    title: "Operators",
    icon: <ArrowLeftRight size={22} />,
    description:
      "Arithmetic, comparison, logical, and compound assignment operators.",
    example: `// Arithmetic: +, -, *, /, %
let sum = 5 + 10;

// Comparison: ==, !=, <, >, <=, >=
let isEqual = (a == b);

// Logical: &&, ||, !
let logicalAnd = (x > 0 && y < 10);

// Compound: +=, -=, *=, /=
count += 1;  // Same as: count = count + 1`,
  },
  {
    title: "Higher-Order Functions",
    icon: <Play size={22} />,
    description:
      "Functions that take other functions as arguments or return functions as results.",
    example: `// Map implementation
let map = fn(arr, f) {
  let result = [];
  let i = 0;
  while (i < len(arr)) {
    result[i] = f(arr[i]);
    i += 1;
  }
  return result;
};

// Usage
let doubled = map([1, 2, 3], fn(x) { return x * 2; });`,
  },
];

export const keywords = [
  "let",
  "const",
  "fn",
  "if",
  "else",
  "elif",
  "return",
  "while",
  "true",
  "false",
];

export const operators = [
  "+",
  "-",
  "*",
  "/",
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "&&",
  "||",
  "!",
  "+=",
  "-=",
  "*=",
  "/=",
];

export const categories = {
  "Core Constructs": [
    "LetStatement",
    "ConstStatement",
    "FunctionLiteral",
    "ReturnStatement",
  ],
  "Control Flow": [
    "IfExpression",
    "WhileStatement",
    "ForStatement",
    "BreakStatement",
    "ContinueStatement",
  ],
  Expressions: [
    "InfixExpression",
    "PrefixExpression",
    "AssignmentExpression",
    "CallExpression",
  ],
  "Data Types": [
    "Identifier",
    "IntegerLiteral",
    "StringLiteral",
    "BooleanExpression",
    "ArrayLiteral",
    "HashLiteral",
    "IndexExpression",
  ],
  Structure: ["Program", "BlockStatement", "ExpressionStatement"],
};
