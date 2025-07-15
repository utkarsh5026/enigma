import Lexer from "@/lang/lexer/lexer";
import { Token, TokenType } from "@/lang/token/token";
import { ParserException } from "./parser-error";

/**
 * TokenStream - Manages token navigation and consumption
 */
export class TokenStream {
  private currentToken: Token;
  private peekToken: Token;
  private lexer: Lexer;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = {
      type: TokenType.EOF,
      literal: "",
      position: { line: 0, column: 0 },
    };
    this.peekToken = {
      type: TokenType.EOF,
      literal: "",
      position: { line: 0, column: 0 },
    };
    this.advance();
    this.advance();
  }

  getCurrentToken(): Token {
    return this.currentToken;
  }

  getPeekToken(): Token {
    return this.peekToken;
  }

  advance(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  isCurrentToken(type: TokenType): boolean {
    return this.currentToken.type === type;
  }

  isPeekToken(type: TokenType): boolean {
    return this.peekToken.type === type;
  }

  expect(type: TokenType): boolean {
    if (this.isPeekToken(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  expectCurrent(type: TokenType): boolean {
    return this.isCurrentToken(type);
  }

  consume(expectedType: TokenType): Token {
    if (!this.isCurrentToken(expectedType)) {
      console.log("Throwing ParserException");
      throw new ParserException(
        `Expected ${expectedType}, got ${this.currentToken.type} at ${this.currentToken.position}`
      );
    }
    const consumed = this.currentToken;
    this.advance();
    return consumed;
  }
}
