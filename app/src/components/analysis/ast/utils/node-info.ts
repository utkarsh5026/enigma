export const getMinimalNodeStyle = (nodeType: string) => {
  const styleMap: Record<
    string,
    { border: string; text: string; accent: string }
  > = {
    // Program - slightly blue
    Program: {
      border: "border-slate-600/40",
      text: "text-slate-200",
      accent: "bg-slate-500/20",
    },

    // Variable Declarations - subtle purple
    LetStatement: {
      border: "border-slate-600/40",
      text: "text-purple-200/80",
      accent: "bg-purple-500/10",
    },
    ConstStatement: {
      border: "border-slate-600/40",
      text: "text-purple-200/80",
      accent: "bg-purple-500/10",
    },

    // Object-Oriented Programming - vibrant magenta
    ClassStatement: {
      border: "border-slate-600/40",
      text: "text-fuchsia-200/80",
      accent: "bg-fuchsia-500/15",
    },
    NewExpression: {
      border: "border-slate-600/40",
      text: "text-fuchsia-200/80",
      accent: "bg-fuchsia-500/10",
    },
    PropertyExpression: {
      border: "border-slate-600/40",
      text: "text-fuchsia-200/80",
      accent: "bg-fuchsia-500/10",
    },
    ThisExpression: {
      border: "border-slate-600/40",
      text: "text-fuchsia-200/80",
      accent: "bg-fuchsia-500/10",
    },
    SuperExpression: {
      border: "border-slate-600/40",
      text: "text-fuchsia-200/80",
      accent: "bg-fuchsia-500/10",
    },

    // Control flow - subtle orange
    ReturnStatement: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },
    IfExpression: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },
    WhileStatement: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },
    ForStatement: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },
    BreakStatement: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },
    ContinueStatement: {
      border: "border-slate-600/40",
      text: "text-orange-200/80",
      accent: "bg-orange-500/10",
    },

    // Operations - subtle cyan
    InfixExpression: {
      border: "border-slate-600/40",
      text: "text-cyan-200/80",
      accent: "bg-cyan-500/10",
    },
    PrefixExpression: {
      border: "border-slate-600/40",
      text: "text-cyan-200/80",
      accent: "bg-cyan-500/10",
    },
    CallExpression: {
      border: "border-slate-600/40",
      text: "text-cyan-200/80",
      accent: "bg-cyan-500/10",
    },
    AssignmentExpression: {
      border: "border-slate-600/40",
      text: "text-cyan-200/80",
      accent: "bg-cyan-500/10",
    },
    IndexExpression: {
      border: "border-slate-600/40",
      text: "text-cyan-200/80",
      accent: "bg-cyan-500/10",
    },

    // Statements - subtle blue
    BlockStatement: {
      border: "border-slate-600/40",
      text: "text-blue-200/80",
      accent: "bg-blue-500/10",
    },
    ExpressionStatement: {
      border: "border-slate-600/40",
      text: "text-blue-200/80",
      accent: "bg-blue-500/10",
    },

    // Numeric Literals - subtle green variations
    IntegerLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    FloatLiteral: {
      border: "border-slate-600/40",
      text: "text-teal-200/80",
      accent: "bg-teal-500/10",
    },

    // String Literals - green variations
    StringLiteral: {
      border: "border-slate-600/40",
      text: "text-green-200/80",
      accent: "bg-green-500/10",
    },
    FStringLiteral: {
      border: "border-slate-600/40",
      text: "text-lime-200/80",
      accent: "bg-lime-500/10",
    },

    // Other Literals - subtle green
    BooleanExpression: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    NullExpression: {
      border: "border-slate-600/40",
      text: "text-gray-300/60",
      accent: "bg-gray-500/10",
    },
    ArrayLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    HashLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    FunctionLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },

    // Identifiers - subtle yellow
    Identifier: {
      border: "border-slate-600/40",
      text: "text-amber-200/80",
      accent: "bg-amber-500/10",
    },
  };

  return (
    styleMap[nodeType] || {
      border: "border-slate-600/40",
      text: "text-slate-200",
      accent: "bg-slate-500/10",
    }
  );
};

export const getNodeIcon = (nodeType: string) => {
  const iconMap: Record<string, string> = {
    // Core Structure
    Program: "📄",
    BlockStatement: "📦",
    ExpressionStatement: "⚡",

    // Variable Declarations
    LetStatement: "📝",
    ConstStatement: "🔒",

    // Object-Oriented Programming
    ClassStatement: "🏛️",
    NewExpression: "🆕",
    PropertyExpression: "🔗",
    ThisExpression: "👆",
    SuperExpression: "⬆️",

    // Control Flow
    ReturnStatement: "↩️",
    IfExpression: "🔀",
    WhileStatement: "🔄",
    ForStatement: "🔁",
    BreakStatement: "🛑",
    ContinueStatement: "⏭️",

    // Operations
    InfixExpression: "⚖️",
    PrefixExpression: "🏷️",
    CallExpression: "📞",
    AssignmentExpression: "✏️",
    IndexExpression: "📍",

    // Literals - Numbers
    IntegerLiteral: "🔢",
    FloatLiteral: "🌊",

    // Literals - Text
    StringLiteral: "📜",
    FStringLiteral: "🎯",

    // Literals - Other
    BooleanExpression: "✅",
    NullExpression: "⭕",
    ArrayLiteral: "📊",
    HashLiteral: "🗂️",
    FunctionLiteral: "⚙️",

    // References
    Identifier: "🏷️",
  };
  return iconMap[nodeType] || "⭕";
};

export const getNodeDescription = (nodeType: string) => {
  const descriptions: Record<string, string> = {
    // Core Structure
    Program:
      "Root of the syntax tree - contains all top-level statements and manages program execution flow",
    BlockStatement:
      "Code block enclosed in braces - creates new lexical scope for variable declarations",
    ExpressionStatement:
      "Standalone expression evaluated for side effects - wraps expressions as statements",

    // Variable Declarations
    LetStatement:
      "Mutable variable declaration - creates a new binding that can be reassigned",
    ConstStatement:
      "Immutable constant declaration - creates a binding that cannot be reassigned after initialization",

    // Object-Oriented Programming
    ClassStatement:
      "Class definition with optional inheritance - defines blueprint for creating objects with methods and properties",
    NewExpression:
      "Object instantiation - creates new instances of classes using the 'new' keyword with constructor arguments",
    PropertyExpression:
      "Property access using dot notation - retrieves or accesses object properties and methods",
    ThisExpression:
      "Current instance reference - refers to the object instance within method calls",
    SuperExpression:
      "Parent class reference - calls parent class constructors or methods in inheritance hierarchies",

    // Control Flow
    ReturnStatement:
      "Function exit with value - terminates function execution and returns result to caller",
    IfExpression:
      "Multi-branch conditional execution - evaluates conditions and executes corresponding code blocks",
    WhileStatement:
      "Condition-based loop - repeatedly executes code block while condition remains true",
    ForStatement:
      "Controlled iteration loop - executes with initialization, condition check, and increment phases",
    BreakStatement:
      "Loop termination - immediately exits the current loop and continues execution after loop",
    ContinueStatement:
      "Loop iteration skip - skips remaining code in current iteration and moves to next",

    // Operations
    InfixExpression:
      "Binary operation between operands - applies operators like +, -, *, ==, && between two values",
    PrefixExpression:
      "Unary operation before operand - applies operators like !, -, + before a single value",
    CallExpression:
      "Function invocation with arguments - executes functions or methods with provided parameters",
    AssignmentExpression:
      "Value assignment to variable or property - stores computed values in variables or object properties",
    IndexExpression:
      "Element access by index or key - retrieves elements from arrays by index or objects by key",

    // Literals - Numbers
    IntegerLiteral:
      "Whole number constant - immediate integer values like 42, -17, 0",
    FloatLiteral:
      "Decimal number constant - immediate floating-point values like 3.14, -2.5, 1.23e-4",

    // Literals - Text
    StringLiteral:
      "Text constant enclosed in quotes - immediate string values like \"hello\", 'world'",
    FStringLiteral:
      "Formatted string with embedded expressions - template strings that interpolate variables and expressions",

    // Literals - Other
    BooleanExpression:
      "Boolean constant - immediate true or false values for logical operations",
    NullExpression:
      "Null value representing absence of data - indicates no value or uninitialized state",
    ArrayLiteral:
      "Ordered collection of values - creates arrays with indexed elements [1, 2, 3]",
    HashLiteral:
      'Key-value mapping collection - creates objects with named properties {"key": "value"}',
    FunctionLiteral:
      "Function definition with parameters and body - creates callable objects with closure capture",

    // References
    Identifier:
      "Variable or function reference - looks up values in current scope and environment chain",
  };
  return (
    descriptions[nodeType] ||
    `AST node of type ${nodeType} - represents a syntactic construct in the parsed code`
  );
};

/**
 * Get category for grouping nodes in the UI
 */
export const getNodeCategory = (nodeType: string): string => {
  const categoryMap: Record<string, string> = {
    // Core Structure
    Program: "Structure",
    BlockStatement: "Structure",
    ExpressionStatement: "Structure",

    // Declarations
    LetStatement: "Declarations",
    ConstStatement: "Declarations",
    ClassStatement: "Object-Oriented",

    // Control Flow
    ReturnStatement: "Control Flow",
    IfExpression: "Control Flow",
    WhileStatement: "Control Flow",
    ForStatement: "Control Flow",
    BreakStatement: "Control Flow",
    ContinueStatement: "Control Flow",

    // Object-Oriented
    NewExpression: "Object-Oriented",
    PropertyExpression: "Object-Oriented",
    ThisExpression: "Object-Oriented",
    SuperExpression: "Object-Oriented",

    // Operations
    InfixExpression: "Operations",
    PrefixExpression: "Operations",
    CallExpression: "Operations",
    AssignmentExpression: "Operations",
    IndexExpression: "Operations",

    // Literals
    IntegerLiteral: "Literals",
    FloatLiteral: "Literals",
    StringLiteral: "Literals",
    FStringLiteral: "Literals",
    BooleanExpression: "Literals",
    NullExpression: "Literals",
    ArrayLiteral: "Literals",
    HashLiteral: "Literals",
    FunctionLiteral: "Literals",

    // References
    Identifier: "References",
  };

  return categoryMap[nodeType] || "Other";
};

/**
 * Get complexity score for a node type (1-5, where 5 is most complex)
 */
export const getNodeComplexity = (nodeType: string): number => {
  const complexityMap: Record<string, number> = {
    // Simple literals and identifiers
    IntegerLiteral: 1,
    FloatLiteral: 1,
    StringLiteral: 1,
    BooleanExpression: 1,
    NullExpression: 1,
    Identifier: 1,

    // Simple statements
    BreakStatement: 1,
    ContinueStatement: 1,
    ReturnStatement: 2,
    ExpressionStatement: 2,

    // Simple expressions
    PrefixExpression: 2,
    InfixExpression: 2,
    IndexExpression: 2,
    AssignmentExpression: 2,
    PropertyExpression: 2,
    ThisExpression: 2,

    // Moderate complexity
    LetStatement: 3,
    ConstStatement: 3,
    CallExpression: 3,
    ArrayLiteral: 3,
    HashLiteral: 3,
    BlockStatement: 3,
    NewExpression: 3,
    FStringLiteral: 3,

    // High complexity
    FunctionLiteral: 4,
    IfExpression: 4,
    WhileStatement: 4,
    ForStatement: 4,
    SuperExpression: 4,

    // Very high complexity
    ClassStatement: 5,
    Program: 5,
  };

  return complexityMap[nodeType] || 3;
};
