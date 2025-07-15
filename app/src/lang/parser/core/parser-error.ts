import { Token, TokenType } from "@/lang/token/token";

export interface ParseError {
  message: string;
  line: number;
  column: number;
  token: Token;
}

/**
 * ErrorReporter - Centralized error collection and reporting
 */
export class ErrorReporter {
  private errors: ParseError[] = [];

  addError(message: string, token: Token): void {
    this.errors.push({
      message,
      line: token.position.line,
      column: token.position.column,
      token,
    });
  }

  addTokenError(expected: TokenType, actual: Token): void {
    const message = `Expected ${expected}, got ${actual.type}`;
    this.addError(message, actual);
  }

  addPrefixError(tokenType: TokenType, token: Token): void {
    const message = `No prefix parser for ${tokenType}`;
    this.addError(message, token);
  }

  getErrors(): ParseError[] {
    return [...this.errors];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clear(): void {
    this.errors = [];
  }
}

/**
 * 💥 ParserException - The Emergency Stop Signal 💥
 *
 * A runtime exception thrown when parsing encounters a critical error.
 * Like an emergency brake that stops everything when something goes seriously
 * wrong! 🚨🛑
 */
export class ParserException extends Error {
  private token?: Token; // 🎫 The token that caused the critical error (optional)

  /**
   * 💥 Creates a parser exception with message and token context
   *
   * @param message A clear description of what went critically wrong 💬
   * @param token   The token that caused the critical error 🎫
   */
  constructor(message: string, token?: Token) {
    super(message);
    this.token = token;
  }

  /**
   * 🎫 Gets the token that caused the exception
   */
  getToken(): Token | undefined {
    return this.token;
  }
}
