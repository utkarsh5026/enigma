import { Token, TokenType } from "../token/token";
import Lexer from "../lexer/lexer";
import * as ast from "../ast/ast";

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
}

/**
 * ParseError - Represents a parsing error
 */
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
    [TokenType.LPAREN, Precedence.CALL],
    [TokenType.LBRACKET, Precedence.INDEX],
  ]);

  getPrecedence(tokenType: TokenType): Precedence {
    return this.precedences.get(tokenType) ?? Precedence.LOWEST;
  }

  setPrecedence(tokenType: TokenType, precedence: Precedence): void {
    this.precedences.set(tokenType, precedence);
  }
}

/**
 * ParsingContext - Shared state for all parsers
 */
export class ParsingContext {
  public readonly tokens: TokenStream;
  public readonly errors: ErrorReporter;
  public readonly precedence: PrecedenceTable;
  public loopDepth: number = 0;

  constructor(lexer: Lexer) {
    this.tokens = new TokenStream(lexer);
    this.errors = new ErrorReporter();
    this.precedence = new PrecedenceTable();
  }

  enterLoop(): void {
    this.loopDepth++;
  }

  exitLoop(): void {
    this.loopDepth--;
  }

  isInLoop(): boolean {
    return this.loopDepth > 0;
  }

  addError(message: string, token: Token): void {
    this.errors.addError(message, token);
  }

  addTokenError(expected: TokenType, actual: Token): void {
    this.errors.addTokenError(expected, actual);
  }
}

/**
 * Parser interface - All parsers implement this
 */
export interface Parser<T extends ast.Node> {
  parse(context: ParsingContext): T | null;
  canParse(context: ParsingContext): boolean;
}
