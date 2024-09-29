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
  EQ = "==",
  NOT_EQ = "!=",
}

export interface Token {
  type: TokenType;
  literal: string;
}

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
};

export const lookupIdentifier = (identifier: string): TokenType => {
  return keywords[identifier] || TokenType.IDENTIFIER;
};
