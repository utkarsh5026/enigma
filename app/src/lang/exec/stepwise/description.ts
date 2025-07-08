import { AstValidator } from "@/lang/ast/validate";
import * as ast from "@/lang/ast/ast";
import * as objects from "@/lang/exec/objects";

export const getAfterDescription = (
  node: ast.Node,
  result: objects.BaseObject
): string => {
  const resultString = result.inspect();

  switch (true) {
    case AstValidator.isLetStatement(node):
      return `Variable "${node.name.value}" declared with value: '${resultString}'`;

    case AstValidator.isConstStatement(node):
      return `Constant "${node.name.value}" declared with value: '${resultString}'`;

    case AstValidator.isReturnStatement(node):
      return `Returned: '${resultString}'`;

    case AstValidator.isInfixExpression(node):
      return `Expression evaluated to: '${resultString}'`;

    case AstValidator.isCallExpression(node):
      return `Function call completed, result: '${resultString}'`;

    case AstValidator.isIdentifier(node):
      return `Variable value: '${resultString}'`;

    case AstValidator.isIntegerLiteral(node):
      return `Integer value: '${resultString}'`;

    case AstValidator.isStringLiteral(node):
      return `String value: '${resultString}'`;

    case AstValidator.isFunctionLiteral(node):
      return `Function value: '${resultString}'`;

    case AstValidator.isArrayLiteral(node):
      return `Array value: '${resultString}'`;

    case AstValidator.isHashLiteral(node):
    default:
      return `${node.constructor.name} evaluated to: '${resultString}'`;
  }
};

export const getBeforeDescription = (node: ast.Node): string => {
  switch (true) {
    case AstValidator.isLetStatement(node):
      return `About to declare variable "${node.name.value}"`;
    case AstValidator.isConstStatement(node):
      return `About to declare constant "${node.name.value}"`;
    case AstValidator.isReturnStatement(node):
      return "About to return a value";
    case AstValidator.isInfixExpression(node): {
      const infix = node;
      return `About to evaluate: "${infix.left.toString()}" ${
        infix.operator
      } "${infix.right.toString()}"`;
    }
    case AstValidator.isCallExpression(node): {
      const call = node;
      let funcName = "anonymous function";
      if (call.func instanceof ast.Identifier) {
        funcName = call.func.value;
      }
      return `About to call function "${funcName}"`;
    }
    case AstValidator.isIdentifier(node):
      return `Looking up variable "${node.value}"`;

    case AstValidator.isIntegerLiteral(node):
      return `About to evaluate integer with value "${node.value}"`;

    case AstValidator.isStringLiteral(node):
      return `About to evaluate string with value "${node.value}"`;

    case AstValidator.isFunctionLiteral(node):
      return `About to evaluate function "${node.functionSignature()}"`;

    case AstValidator.isArrayLiteral(node):
      return `About to evaluate array literal`;

    case AstValidator.isHashLiteral(node):
      return `About to evaluate hash literal "${node.pairs}"`;

    default:
      return `About to evaluate "${node.constructor.name}"`;
  }
};
