export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  IDENTIFIER = "IDENTIFIER",
  INT = "INT",
  STRING = "STRING",

  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  MODULUS = "%",

  LESS_THAN = "<",
  GREATER_THAN = ">",

  COMMA = ",",
  SEMICOLON = ";",
  COLON = ":",

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

  EQ = "==",
  NOT_EQ = "!=",
  PLUS_ASSIGN = "+=",
  MINUS_ASSIGN = "-=",
  ASTERISK_ASSIGN = "*=",
  SLASH_ASSIGN = "/=",

  AND = "&&",
  OR = "||",

  BITWISE_AND = "&",
  BITWISE_OR = "|",
  BITWISE_XOR = "^",
  BITWISE_NOT = "~",
  BITWISE_LEFT_SHIFT = "<<",
  BITWISE_RIGHT_SHIFT = ">>",
}

export interface Position {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  literal: string;
  position: Position;
}

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  while: TokenType.WHILE,
  break: TokenType.BREAK,
  continue: TokenType.CONTINUE,
};

export const lookupIdentifier = (identifier: string): TokenType => {
  return keywords[identifier] || TokenType.IDENTIFIER;
};
