import {
  ArrowLeftRight,
  Code,
  Database,
  GitBranch,
  Variable,
  Play,
  Layers,
  Zap,
  Type,
  Hash,
  FileText,
} from "lucide-react";

export const examplePrograms = [
  {
    title: "Object-Oriented Programming",
    description: "Classes, inheritance, and polymorphism",
    code: `// Base class
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }
  
  speak() {
    return this.name + " makes a sound";
  }
  
  move(distance) {
    this.energy -= distance * 2;
    return this.name + " moved " + distance + " units";
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Canine");
    this.breed = breed;
  }
  
  speak() {
    return this.name + " barks loudly!";
  }
  
  fetch() {
    return super.move(10) + " while fetching";
  }
}

// Create instances
let myDog = new Dog("Rex", "German Shepherd");
let sound = myDog.speak();
let action = myDog.fetch();`,
  },
  {
    title: "F-String Formatting",
    description: "String interpolation with embedded expressions",
    code: `let name = "Alice";
let age = 30;
let score = 95.5;

// Basic f-string interpolation
let greeting = f"Hello, {name}!";

// Expressions inside f-strings
let message = f"{name} is {age} years old";
let result = f"Score: {score * 100 / 100}%";

// Complex expressions
let calculation = f"{name}'s score of {score} is {score > 90 ? "excellent" : "good"}";

// Nested expressions
let items = ["apple", "banana", "cherry"];
let summary = f"We have {len(items)} items: {first(items)} and others";`,
  },
  {
    title: "Advanced Loops and Control",
    description: "For loops, break, continue, and enhanced flow control",
    code: `// For loops with initialization, condition, and increment
for (let i = 0; i < 10; i += 1) {
  if (i % 2 == 0) {
    continue;  // Skip even numbers
  }
  
  if (i > 7) {
    break;     // Exit loop early
  }
  
  print(f"Odd number: {i}");
}

// Nested loops with labeled break
let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
for (let i = 0; i < len(matrix); i += 1) {
  for (let j = 0; j < len(matrix[i]); j += 1) {
    if (matrix[i][j] == 5) {
      print("Found 5!");
      break;  // Breaks inner loop
    }
  }
}

// While loop with compound assignment
let counter = 0;
while (counter < 100) {
  counter *= 2;
  counter += 1;
  if (counter > 50) break;
}`,
  },
  {
    title: "Floating-Point Numbers",
    description: "Enhanced numeric support with floats",
    code: `// Float literals
let pi = 3.14159;
let temperature = -273.15;
let percentage = 0.95;
let scientific = 1.23e-4;

// Mixed integer and float operations
let radius = 5;
let area = pi * radius * radius;  // Auto-promotes to float
let circumference = 2.0 * pi * radius;

// Float-specific operations
let division = 7 / 3;        // Returns 2.333...
let intDivision = 7 // 3;    // Integer division: returns 2
let modulo = 7.5 % 2.5;      // Float modulo: returns 2.5

// Comparison with precision handling
let isClose = fn(a, b, tolerance) {
  return abs(a - b) < tolerance;
};

let equal = isClose(0.1 + 0.2, 0.3, 0.0001);`,
  },
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

// Memoized version for better performance
let fibMemo = fn() {
  let cache = {};
  return fn(n) {
    if (n < 2) return n;
    
    let key = str(n);
    if (cache[key] != null) {
      return cache[key];
    }
    
    cache[key] = fibMemo(n - 1) + fibMemo(n - 2);
    return cache[key];
  };
}();

// Calculate 10th Fibonacci number
let result = fibonacci(10);
let fastResult = fibMemo(40);  // Much faster for large numbers`,
  },
  {
    title: "Array Manipulation",
    description: "Working with arrays and higher-order functions",
    code: `// Define an array with mixed types
let numbers = [1, 2.5, 3, 4.7, 5];
let names = ["Alice", "Bob", "Charlie"];

// Map function implementation
let map = fn(arr, f) {
  let result = [];
  for (let i = 0; i < len(arr); i += 1) {
    result[i] = f(arr[i]);
  }
  return result;
};

// Filter function implementation
let filter = fn(arr, predicate) {
  let result = [];
  let index = 0;
  for (let i = 0; i < len(arr); i += 1) {
    if (predicate(arr[i])) {
      result[index] = arr[i];
      index += 1;
    }
  }
  return result;
};

// Usage examples
let doubled = map(numbers, fn(x) { return x * 2; });
let evens = filter(numbers, fn(x) { return x % 2 == 0; });
let longNames = filter(names, fn(name) { return len(name) > 3; });`,
  },
  {
    title: "Hash Tables & Property Access",
    description: "Using hash tables and object-like property access",
    code: `// Create a user record
let user = {
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "scores": [95, 87, 92],
  "metadata": {
    "created": "2024-01-01",
    "updated": "2024-07-20"
  }
};

// Traditional hash access
let name = user["name"];
let email = user["email"];

// Property-style access (if using objects)
// let name = user.name;
// let email = user.email;

// Update nested values
user["metadata"]["updated"] = "2024-07-21";
user["age"] += 1;  // Compound assignment

// Dynamic key access
let key = "scores";
let userScores = user[key];

// Function that works with hashes
let formatUser = fn(person) {
  return f"User: {person["name"]} ({person["age"]} years old)";
};

let description = formatUser(user);`,
  },
  {
    title: "Closures & Advanced Functions",
    description:
      "Using closures to create factory functions and stateful behavior",
    code: `// Function factory using closures
let makeAdder = fn(x) {
  return fn(y) { return x + y; };
};

let addFive = makeAdder(5);
let addTen = makeAdder(10);

// Counter factory with private state
let makeCounter = fn(initial) {
  let count = initial || 0;
  return {
    "increment": fn() {
      count += 1;
      return count;
    },
    "decrement": fn() {
      count -= 1;
      return count;
    },
    "get": fn() {
      return count;
    },
    "reset": fn() {
      count = initial || 0;
      return count;
    }
  };
};

// Usage
let counter = makeCounter(10);
let val1 = counter["increment"]();  // 11
let val2 = counter["increment"]();  // 12
let current = counter["get"]();     // 12
counter["reset"]();                 // 10

// Partial application
let multiply = fn(a, b) { return a * b; };
let double = fn(x) { return multiply(2, x); };
let triple = fn(x) { return multiply(3, x); };`,
  },
];

export const languageFeatures = [
  {
    title: "Variables & Constants",
    icon: <Variable size={22} />,
    description:
      "Dynamic typing with 'let' for mutable variables and 'const' for immutable constants that cannot be reassigned.",
    example: `let age = 25;
let name = "John";
let temperature = -15.5;
const PI = 3.14159;
const VERSION = "1.0.0";`,
  },
  {
    title: "Functions",
    icon: <Code size={22} />,
    description:
      "First-class functions with closures that can capture their environment and be passed around as values.",
    example: `let add = fn(a, b) { 
  return a + b; 
};

// Higher-order function
let compose = fn(f, g) {
  return fn(x) { return f(g(x)); };
};

// Anonymous function
let square = fn(x) { return x * x; };`,
  },
  {
    title: "Object-Oriented Programming",
    icon: <Layers size={22} />,
    description:
      "Full OOP support with classes, inheritance, constructors, methods, super calls, and object instantiation.",
    example: `class Shape {
  constructor(color) {
    this.color = color;
  }
  
  area() {
    return 0;  // Override in subclasses
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  area() {
    return 3.14159 * this.radius * this.radius;
  }
}

let circle = new Circle("red", 5);`,
  },
  {
    title: "Data Types",
    icon: <Type size={22} />,
    description:
      "Rich type system including integers, floats, strings, booleans, arrays, hash maps, and null values.",
    example: `// Primitive types
let integer = 42;
let float = 3.14159;
let text = "Hello, World!";
let flag = true;
let empty = null;

// Complex types
let numbers = [1, 2, 3, 4.5, 5.7];
let person = {"name": "Alice", "age": 30};`,
  },
  {
    title: "Data Structures",
    icon: <Database size={22} />,
    description:
      "Built-in arrays and hash maps with comprehensive manipulation capabilities and property access.",
    example: `// Arrays with mixed types
let mixed = [1, "hello", true, 3.14, null];
mixed[0] = 42;  // Index assignment

// Hash maps
let config = {
  "debug": true,
  "port": 8080,
  "features": ["auth", "logging"]
};
config["timeout"] = 30;  // Dynamic key assignment`,
  },
  {
    title: "Control Flow",
    icon: <GitBranch size={22} />,
    description:
      "Comprehensive control structures including if/elif/else, while loops, for loops, and break/continue statements.",
    example: `// Conditional with elif
if (score >= 90) {
  grade = "A";
} elif (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}

// For loops
for (let i = 0; i < 10; i += 1) {
  if (i == 5) continue;
  if (i == 8) break;
  print(i);
}

// While loops
while (count < 100) {
  count *= 2;
}`,
  },
  {
    title: "Operators",
    icon: <ArrowLeftRight size={22} />,
    description:
      "Comprehensive operator set including arithmetic, comparison, logical, compound assignment, and bitwise operators.",
    example: `// Arithmetic: +, -, *, /, //, %
let result = 15 / 4;    // 3.75 (float division)
let intDiv = 15 // 4;   // 3 (integer division)

// Compound assignment: +=, -=, *=, /=, %=
count += 5;
score *= 2;

// Comparison: ==, !=, <, >, <=, >=
let isValid = (age >= 18 && score > 75);

// Bitwise: &, |, ^, ~, <<, >>
let flags = 0b1010 | 0b0101;`,
  },
  {
    title: "String Interpolation",
    icon: <FileText size={22} />,
    description:
      "F-string support for embedding expressions directly in strings with automatic formatting.",
    example: `let name = "Alice";
let age = 30;
let score = 95.7;

// Basic interpolation
let greeting = f"Hello, {name}!";

// Expressions in f-strings
let message = f"{name} is {age} years old";
let report = f"Score: {score}% (Grade: {score > 90 ? "A" : "B"})";

// Complex expressions
let summary = f"Average: {(a + b + c) / 3:.2f}";`,
  },
  {
    title: "Higher-Order Functions",
    icon: <Play size={22} />,
    description:
      "Functions that take other functions as arguments or return functions, enabling functional programming patterns.",
    example: `// Map implementation
let map = fn(arr, f) {
  let result = [];
  for (let i = 0; i < len(arr); i += 1) {
    result[i] = f(arr[i]);
  }
  return result;
};

// Filter implementation
let filter = fn(arr, predicate) {
  let result = [];
  for (let item of arr) {
    if (predicate(item)) {
      push(result, item);
    }
  }
  return result;
};

// Usage
let doubled = map([1, 2, 3], fn(x) { return x * 2; });
let evens = filter([1, 2, 3, 4], fn(x) { return x % 2 == 0; });`,
  },
  {
    title: "Error Handling",
    icon: <Zap size={22} />,
    description:
      "Comprehensive error reporting with stack traces, source context, and detailed debugging information.",
    example: `// The interpreter provides detailed errors:
// - Syntax errors with line/column information
// - Runtime errors with stack traces
// - Type mismatch errors with suggestions
// - Source context showing problematic code

// Example: Division by zero
let result = 10 / 0;  // Error with context

// Example: Type error
let invalid = "hello" * true;  // Clear type mismatch error`,
  },
  {
    title: "Built-in Functions",
    icon: <Hash size={22} />,
    description:
      "Rich standard library with functions for array manipulation, string processing, type checking, and mathematical operations.",
    example: `// Array functions
let arr = [1, 2, 3, 4, 5];
let length = len(arr);
let firstItem = first(arr);
let lastItem = last(arr);
let remaining = rest(arr);

// String functions
let text = "Hello World";
let upper = upper(text);
let lower = lower(text);

// Type checking
let isNum = isNumber(42);
let isStr = isString("hello");

// Math functions
let absolute = abs(-5);
let maximum = max([1, 5, 3, 9, 2]);`,
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
  "for",
  "break",
  "continue",
  "true",
  "false",
  "null",
  "class",
  "extends",
  "super",
  "this",
  "new",
];

export const operators = [
  // Arithmetic
  "+",
  "-",
  "*",
  "/",
  "//",
  "%",
  // Assignment
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  // Comparison
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  // Logical
  "&&",
  "||",
  "!",
  // Bitwise
  "&",
  "|",
  "^",
  "~",
  "<<",
  ">>",
  // Other
  ".",
  "[",
  "]",
  "(",
  ")",
];

export const categories = {
  "Core Constructs": [
    "LetStatement",
    "ConstStatement",
    "FunctionLiteral",
    "ReturnStatement",
    "Program",
  ],
  "Object-Oriented": [
    "ClassStatement",
    "NewExpression",
    "PropertyExpression",
    "ThisExpression",
    "SuperExpression",
    "InstanceObject",
  ],
  "Control Flow": [
    "IfExpression",
    "WhileStatement",
    "ForStatement",
    "BreakStatement",
    "ContinueStatement",
    "BlockStatement",
  ],
  Expressions: [
    "InfixExpression",
    "PrefixExpression",
    "AssignmentExpression",
    "CallExpression",
    "IndexExpression",
  ],
  "Data Types": [
    "Identifier",
    "IntegerLiteral",
    "FloatLiteral",
    "StringLiteral",
    "FStringLiteral",
    "BooleanExpression",
    "NullExpression",
    "ArrayLiteral",
    "HashLiteral",
  ],
  Structural: [
    "ExpressionStatement",
    "TokenStream",
    "Environment",
    "ErrorObject",
  ],
};

// Built-in function categories (based on the Java code structure)
export const builtinCategories = {
  "Array Functions": [
    "len",
    "first",
    "last",
    "rest",
    "push",
    "pop",
    "insert",
    "remove",
    "contains",
    "indexOf",
  ],
  "String Functions": [
    "upper",
    "lower",
    "trim",
    "split",
    "join",
    "substring",
    "charAt",
    "replace",
  ],
  "Math Functions": [
    "abs",
    "min",
    "max",
    "pow",
    "sqrt",
    "floor",
    "ceil",
    "round",
    "random",
  ],
  "Type Functions": [
    "type",
    "isNumber",
    "isString",
    "isBoolean",
    "isArray",
    "isHash",
    "isFunction",
    "isNull",
  ],
  "I/O Functions": ["print", "println", "input", "str", "num"],
  "Utility Functions": ["keys", "values", "hasKey", "clone", "equals"],
};

// Type system information
export const typeSystem = {
  primitive: ["Integer", "Float", "String", "Boolean", "Null"],
  complex: ["Array", "Hash", "Function", "Class", "Instance"],
  special: ["Error", "Return", "Break", "Continue"],
};

// Language capabilities summary
export const capabilities = {
  paradigms: ["Imperative", "Functional", "Object-Oriented"],
  features: [
    "Dynamic Typing",
    "First-Class Functions",
    "Closures",
    "Inheritance",
    "Polymorphism",
    "String Interpolation",
    "Compound Assignment",
    "Stack Traces",
    "REPL Support",
  ],
  dataStructures: ["Arrays", "Hash Maps", "Objects", "Classes"],
};
