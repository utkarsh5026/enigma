import {
  LetStatement,
  ConstStatement,
  ReturnStatement,
  BlockStatement,
  ExpressionStatement,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
  ForStatement,
  ClassDeclaration,
  ConstructorDefinition,
  MethodDefinition,
} from "./statement";
import { Identifier, Node } from "./ast";
import {
  BooleanExpression,
  InfixExpression,
  PrefixExpression,
  IfExpression,
  IndexExpression,
  CallExpression,
  AssignmentExpression,
} from "./expression";
import {
  IntegerLiteral,
  StringLiteral,
  FunctionLiteral,
  ArrayLiteral,
  HashLiteral,
} from "./literal";

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

  static isClassDeclaration(node: Node): node is ClassDeclaration {
    return node instanceof ClassDeclaration;
  }

  static isMethodDefinition(node: Node): node is MethodDefinition {
    return node instanceof MethodDefinition;
  }

  static isConstructorDefinition(node: Node): node is ConstructorDefinition {
    return node instanceof ConstructorDefinition;
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

  static isBooleanExpression(node: Node): node is BooleanExpression {
    return node instanceof BooleanExpression;
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
}
