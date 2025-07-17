/**
 * Enum representing different types of tokens in the language.
 */
export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  IDENTIFIER = "IDENTIFIER",
  INT = "INT",
  STRING = "STRING",
  FLOAT = "FLOAT",

  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  MODULUS = "%",

  LESS_THAN = "<",
  GREATER_THAN = ">",
  LESS_THAN_OR_EQUAL = "<=",
  GREATER_THAN_OR_EQUAL = ">=",
  INTEGER_DIVISION = "//",

  COMMA = ",",
  SEMICOLON = ";",
  COLON = ":",
  DOT = ".",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  LBRACKET = "[",
  RBRACKET = "]",

  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  WHILE = "WHILE",
  BREAK = "BREAK",
  CONTINUE = "CONTINUE",
  FOR = "FOR",
  CONST = "CONST",
  ELIF = "ELIF",
  CLASS = "CLASS",
  EXTENDS = "EXTENDS",
  SUPER = "SUPER",
  THIS = "THIS",
  NEW = "NEW",
  NULL = "NULL",

  EQ = "==",
  NOT_EQ = "!=",
  PLUS_ASSIGN = "+=",
  MINUS_ASSIGN = "-=",
  ASTERISK_ASSIGN = "*=",
  SLASH_ASSIGN = "/=",
  MODULUS_ASSIGN = "%=",

  AND = "&&",
  OR = "||",

  BITWISE_AND = "&",
  BITWISE_OR = "|",
  BITWISE_XOR = "^",
  BITWISE_NOT = "~",
  BITWISE_LEFT_SHIFT = "<<",
  BITWISE_RIGHT_SHIFT = ">>",

  F_STRING = "F_STRING",
}

/**
 * Interface representing the position of a token in the source code.
 */
export interface Position {
  /** The line number of the token. */
  line: number;
  /** The column number of the token. */
  column: number;
}

/**
 * Interface representing a token in the language.
 */
export interface Token {
  /** The type of the token. */
  type: TokenType;
  /** The literal string value of the token. */
  literal: string;
  /** The position of the token in the source code. */
  position: Position;
}

/**
 * A record mapping keyword strings to their corresponding TokenTypes.
 */
const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  elif: TokenType.ELIF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  while: TokenType.WHILE,
  break: TokenType.BREAK,
  continue: TokenType.CONTINUE,
  for: TokenType.FOR,
  const: TokenType.CONST,
  class: TokenType.CLASS,
  extends: TokenType.EXTENDS,
  super: TokenType.SUPER,
  this: TokenType.THIS,
  new: TokenType.NEW,
  null: TokenType.NULL,
};

/**
 * Looks up the TokenType for a given identifier.
 * @param identifier - The identifier string to look up.
 * @returns The corresponding TokenType if it's a keyword, or TokenType.IDENTIFIER if it's not.
 */
export const lookupIdentifier = (identifier: string): TokenType => {
  return keywords[identifier] || TokenType.IDENTIFIER;
};

/**
 * Returns an array of all keyword strings in the language.
 * @returns An array of keyword strings.
 */
export const getKeywords = (): string[] => {
  return Object.keys(keywords);
};

export type IntegerOperator = "+" | "-" | "*" | "/" | "%";
export type BooleanOperator = "<" | ">" | "<=" | ">=" | "==" | "!=";
export type LogicalOperator = "&&" | "||";
export type Operator = IntegerOperator | BooleanOperator | LogicalOperator;
