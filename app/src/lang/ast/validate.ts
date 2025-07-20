import { Identifier, Node } from "./ast";
import {
  InfixExpression,
  PrefixExpression,
  IfExpression,
  IndexExpression,
  CallExpression,
  AssignmentExpression,
  PropertyExpression,
} from "./expressions";
import {
  IntegerLiteral,
  StringLiteral,
  FunctionLiteral,
  ArrayLiteral,
  HashLiteral,
  BooleanLiteral,
} from "./literals";
import {
  ConstStatement,
  ClassStatement,
  ForStatement,
  BreakStatement,
  ContinueStatement,
  LetStatement,
  ReturnStatement,
  BlockStatement,
  ExpressionStatement,
  WhileStatement,
} from "./statements";

export class AstValidator {
  static isLetStatement(node: Node): node is LetStatement {
    return node instanceof LetStatement;
  }

  static isConstStatement(node: Node): node is ConstStatement {
    return node instanceof ConstStatement;
  }

  static isReturnStatement(node: Node): node is ReturnStatement {
    return node instanceof ReturnStatement;
  }

  static isBlockStatement(node: Node): node is BlockStatement {
    return node instanceof BlockStatement;
  }

  static isExpressionStatement(node: Node): node is ExpressionStatement {
    return node instanceof ExpressionStatement;
  }

  static isWhileStatement(node: Node): node is WhileStatement {
    return node instanceof WhileStatement;
  }

  static isBreakStatement(node: Node): node is BreakStatement {
    return node instanceof BreakStatement;
  }

  static isContinueStatement(node: Node): node is ContinueStatement {
    return node instanceof ContinueStatement;
  }

  static isForStatement(node: Node): node is ForStatement {
    return node instanceof ForStatement;
  }

  static isIdentifier(node: Node): node is Identifier {
    return node instanceof Identifier;
  }

  static isPrefixExpression(node: Node): node is PrefixExpression {
    return node instanceof PrefixExpression;
  }

  static isInfixExpression(node: Node): node is InfixExpression {
    return node instanceof InfixExpression;
  }

  static isBooleanLiteral(node: Node): node is BooleanLiteral {
    return node instanceof BooleanLiteral;
  }

  static isIfExpression(node: Node): node is IfExpression {
    return node instanceof IfExpression;
  }

  static isIndexExpression(node: Node): node is IndexExpression {
    return node instanceof IndexExpression;
  }

  static isCallExpression(node: Node): node is CallExpression {
    return node instanceof CallExpression;
  }

  static isAssignmentExpression(node: Node): node is AssignmentExpression {
    return node instanceof AssignmentExpression;
  }

  static isIntegerLiteral(node: Node): node is IntegerLiteral {
    return node instanceof IntegerLiteral;
  }

  static isStringLiteral(node: Node): node is StringLiteral {
    return node instanceof StringLiteral;
  }

  static isFunctionLiteral(node: Node): node is FunctionLiteral {
    return node instanceof FunctionLiteral;
  }

  static isArrayLiteral(node: Node): node is ArrayLiteral {
    return node instanceof ArrayLiteral;
  }

  static isHashLiteral(node: Node): node is HashLiteral {
    return node instanceof HashLiteral;
  }

  static isPropertyExpression(node: Node): node is PropertyExpression {
    return node instanceof PropertyExpression;
  }

  static isClassStatement(node: Node): node is ClassStatement {
    return node instanceof ClassStatement;
  }
}
