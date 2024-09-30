import { TokenType } from "../token/token";

export enum Precedence {
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
  INDEX, // array[index]
}

const precedences: { [key in TokenType]?: Precedence } = {
  [TokenType.EQ]: Precedence.EQUALS,
  [TokenType.NOT_EQ]: Precedence.EQUALS,
  [TokenType.LESS_THAN]: Precedence.LESSGREATER,
  [TokenType.GREATER_THAN]: Precedence.LESSGREATER,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.SLASH]: Precedence.PRODUCT,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
  [TokenType.LPAREN]: Precedence.CALL,
  [TokenType.LBRACKET]: Precedence.INDEX,
};

export function getPrecedence(tokenType: TokenType): Precedence {
  return precedences[tokenType] || Precedence.LOWEST;
}
