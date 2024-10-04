import { TokenType } from "../token/token";

export enum Precedence {
  LOWEST,
  LOGICAL_OR, // ||
  LOGICAL_AND, // &&
  EQUALS, // ==
  LESS_GREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
  INDEX, // array[index]
}

const precedences: { [key in TokenType]?: Precedence } = {
  [TokenType.EQ]: Precedence.EQUALS,
  [TokenType.ASSIGN]: Precedence.EQUALS,
  [TokenType.NOT_EQ]: Precedence.EQUALS,
  [TokenType.LESS_THAN]: Precedence.LESS_GREATER,
  [TokenType.GREATER_THAN]: Precedence.LESS_GREATER,
  [TokenType.AND]: Precedence.LOGICAL_AND,
  [TokenType.OR]: Precedence.LOGICAL_OR,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.SLASH]: Precedence.PRODUCT,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
  [TokenType.MODULUS]: Precedence.PRODUCT,
  [TokenType.LPAREN]: Precedence.CALL,
  [TokenType.LBRACKET]: Precedence.INDEX,
};

export function getPrecedence(tokenType: TokenType): Precedence {
  return precedences[tokenType] ?? Precedence.LOWEST;
}
