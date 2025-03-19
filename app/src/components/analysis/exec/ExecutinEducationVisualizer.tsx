import React from "react";
import { Info } from "lucide-react";

// Map node types to educational descriptions about how they work in execution
const educationalInfo: Record<string, string> = {
  // Statements
  LetStatement:
    "Variable declaration creates a new binding in the current scope. The expression on the right is evaluated first, then bound to the identifier on the left.",
  ConstStatement:
    "Constant declaration works like a variable, but prevents reassignment. The value is computed once when declared.",
  ReturnStatement:
    "Return statements immediately exit the current function and provide the evaluated value back to the caller.",
  ExpressionStatement:
    "Expression statements evaluate an expression and discard the result. Used for side effects like function calls.",
  BlockStatement:
    "Block statements create a new scope. Variables declared inside are not visible outside the block.",
  WhileStatement:
    "While loops repeatedly execute the body as long as the condition evaluates to a truthy value.",
  BreakStatement:
    "Break statements immediately exit the innermost loop or switch statement.",
  ContinueStatement:
    "Continue statements skip to the next iteration of the loop.",

  // Expressions
  InfixExpression:
    "Infix expressions evaluate both operands and then apply the operator. Most operators (like +, -, *, /) evaluate from left to right.",
  PrefixExpression:
    "Prefix operators (like !, -) evaluate their operand first, then apply the operation to the result.",
  IfExpression:
    "If expressions evaluate the condition first. If truthy, the consequence block executes; otherwise the alternative (if present).",
  CallExpression:
    "Function calls evaluate the function expression and all arguments first, then create a new environment for execution.",
  AssignmentExpression:
    "Assignments evaluate the right side first, then store the result in the variable named on the left.",
  IndexExpression:
    "Index expressions evaluate the container (array/hash) first, then the index, and finally return the corresponding element.",

  // Literals and Values
  Identifier:
    "Identifiers look up the bound value in the current scope. If not found, the outer scopes are checked recursively.",
  IntegerLiteral:
    "Integer literals evaluate to their numeric value immediately.",
  StringLiteral: "String literals evaluate to their text value immediately.",
  BooleanExpression:
    "Boolean literals (true/false) evaluate to their boolean value immediately.",
  FunctionLiteral:
    "Function literals create a function object that captures the current environment (closure).",
  ArrayLiteral:
    "Array literals evaluate each element expression from left to right, then create a new array containing the results.",
  HashLiteral:
    "Hash literals evaluate all key and value expressions, then create a new hash map with the resulting pairs.",
};

interface ExecutionEducationalInfoProps {
  nodeType: string;
}

const ExecutionEducationalInfo: React.FC<ExecutionEducationalInfoProps> = ({
  nodeType,
}) => {
  const info =
    educationalInfo[nodeType] ||
    `No additional information available for ${nodeType}.`;

  return (
    <div className="bg-[#212b3b] border border-[#30363d] rounded-md p-3 text-sm">
      <div className="flex items-start gap-2">
        <Info size={16} className="text-[#7dcfff] mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-white mb-1">How {nodeType} Works</h4>
          <p className="text-[#a9b1d6]">{info}</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutionEducationalInfo;
