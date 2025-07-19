import { TokenType } from "@/lang/token/token";

/**
 * Precedence levels for expression parsing
 */
export enum Precedence {
  LOWEST,
  LOGICAL_OR, // ||
  LOGICAL_AND, // &&
  EQUALS, // ==, !=
  LESS_GREATER, // > or <
  SUM, // +, -
  PRODUCT, // *, /, %
  PREFIX, // -X or !X
  CALL, // myFunction(X)
  INDEX, // array[index]
}

/**
 * PrecedenceTable - Manages operator precedence
 */
export class PrecedenceTable {
  private precedences: Map<TokenType, Precedence> = new Map([
    [TokenType.EQ, Precedence.EQUALS],
    [TokenType.ASSIGN, Precedence.EQUALS],
    [TokenType.NOT_EQ, Precedence.EQUALS],
    [TokenType.LESS_THAN, Precedence.LESS_GREATER],
    [TokenType.GREATER_THAN, Precedence.LESS_GREATER],
    [TokenType.LESS_THAN_OR_EQUAL, Precedence.LESS_GREATER],
    [TokenType.GREATER_THAN_OR_EQUAL, Precedence.LESS_GREATER],
    [TokenType.AND, Precedence.LOGICAL_AND],
    [TokenType.OR, Precedence.LOGICAL_OR],
    [TokenType.PLUS, Precedence.SUM],
    [TokenType.MINUS, Precedence.SUM],
    [TokenType.SLASH, Precedence.PRODUCT],
    [TokenType.ASTERISK, Precedence.PRODUCT],
    [TokenType.MODULUS, Precedence.PRODUCT],
    [TokenType.INTEGER_DIVISION, Precedence.PRODUCT],
    [TokenType.LPAREN, Precedence.CALL],
    [TokenType.LBRACKET, Precedence.INDEX],
    [TokenType.DOT, Precedence.INDEX],
  ]);

  getPrecedence(tokenType: TokenType): Precedence {
    return this.precedences.get(tokenType) ?? Precedence.LOWEST;
  }

  setPrecedence(tokenType: TokenType, precedence: Precedence): void {
    this.precedences.set(tokenType, precedence);
  }
}
