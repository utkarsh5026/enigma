import { Program } from "./ast";
import {
  StringLiteral,
  ArrayLiteral,
  HashLiteral,
  IntegerLiteral,
  FunctionLiteral,
  FStringLiteral,
  NullLiteral,
} from "./literal";
import {
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  BlockStatement,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
  ForStatement,
  ConstStatement,
  ClassDeclaration,
  MethodDefinition,
  ConstructorDefinition,
  PropertyDefinition,
} from "./statement";
import {
  InfixExpression,
  PrefixExpression,
  BooleanExpression,
  IfExpression,
  IndexExpression,
  CallExpression,
  AssignmentExpression,
} from "./expression";
import { AstValidator } from "./validate";
import { Node, Expression, Identifier, Statement } from "./ast";

type ASTLiterals =
  | StringLiteral
  | ArrayLiteral
  | HashLiteral
  | IntegerLiteral
  | FunctionLiteral
  | FStringLiteral;

type ASTStatements =
  | LetStatement
  | ReturnStatement
  | ExpressionStatement
  | BlockStatement
  | WhileStatement
  | BreakStatement
  | ContinueStatement
  | ForStatement
  | ConstStatement
  | ClassDeclaration
  | MethodDefinition
  | ConstructorDefinition
  | PropertyDefinition;

type ASTExpressions =
  | InfixExpression
  | PrefixExpression
  | BooleanExpression
  | IfExpression
  | IndexExpression
  | CallExpression
  | AssignmentExpression;

type ASTNodes = ASTLiterals | ASTStatements | ASTExpressions | Program;

export {
  Program,
  StringLiteral,
  ArrayLiteral,
  HashLiteral,
  IntegerLiteral,
  FunctionLiteral,
  FStringLiteral,
  NullLiteral,
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  BlockStatement,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
  ForStatement,
  ConstStatement,
  ClassDeclaration,
  MethodDefinition,
  ConstructorDefinition,
  PropertyDefinition,
  InfixExpression,
  PrefixExpression,
  BooleanExpression,
  IfExpression,
  IndexExpression,
  CallExpression,
  AssignmentExpression,
  type ASTNodes,
  type ASTLiterals,
  type ASTStatements,
  type ASTExpressions,
  AstValidator,
  type Node,
  Expression,
  Identifier,
  Statement,
};
