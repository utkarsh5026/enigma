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

    // Declarations - subtle purple
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

    // Literals - subtle green
    IntegerLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    StringLiteral: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
    },
    BooleanExpression: {
      border: "border-slate-600/40",
      text: "text-emerald-200/80",
      accent: "bg-emerald-500/10",
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
    Program: "📄",
    LetStatement: "📝",
    ConstStatement: "🔒",
    ReturnStatement: "↩️",
    ExpressionStatement: "⚡",
    BlockStatement: "📦",
    WhileStatement: "🔄",
    ForStatement: "🔁",
    BreakStatement: "🛑",
    ContinueStatement: "⏭️",
    InfixExpression: "🔗",
    PrefixExpression: "🏷️",
    IfExpression: "🔀",
    CallExpression: "📞",
    AssignmentExpression: "✏️",
    IndexExpression: "📍",
    Identifier: "🏷️",
    IntegerLiteral: "🔢",
    StringLiteral: "📜",
    BooleanExpression: "✅",
    FunctionLiteral: "⚙️",
    ArrayLiteral: "📊",
    HashLiteral: "🗂️",
  };
  return iconMap[nodeType] || "⭕";
};

export const getNodeDescription = (nodeType: string) => {
  const descriptions: Record<string, string> = {
    Program: "Root of the syntax tree - contains all top-level statements",
    LetStatement: "Variable declaration - creates a new binding in scope",
    ConstStatement: "Constant declaration - immutable value binding",
    ReturnStatement: "Function exit - returns a value to the caller",
    ExpressionStatement: "Standalone expression - evaluated for side effects",
    BlockStatement: "Code block - creates new lexical scope",
    WhileStatement: "Loop construct - repeats while condition is true",
    ForStatement: "Loop with initialization, condition, and increment",
    BreakStatement: "Exit current loop immediately",
    ContinueStatement: "Skip to next loop iteration",
    InfixExpression: "Binary operation - operator between two operands",
    PrefixExpression: "Unary operation - operator before operand",
    IfExpression: "Conditional execution based on boolean condition",
    CallExpression: "Function invocation - executes function with arguments",
    AssignmentExpression: "Assigns value to variable",
    IndexExpression: "Access element by index or key",
    Identifier: "Variable reference - looks up value in environment",
    IntegerLiteral: "Numeric value - immediate integer constant",
    StringLiteral: "Text value - immediate string constant",
    BooleanExpression: "Boolean value - true or false",
    FunctionLiteral: "Function definition - creates callable object",
    ArrayLiteral: "Array of values - ordered collection",
    HashLiteral: "Hash map - key-value pairs",
  };
  return descriptions[nodeType] || `AST node of type ${nodeType}`;
};
