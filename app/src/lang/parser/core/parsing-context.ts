import { TokenStream } from "./token-stream";
import { ErrorReporter, ParserException } from "./parser-error";
import { PrecedenceTable } from "./precedence";
import { Token, TokenType } from "@/lang/token/token";
import Lexer from "@/lang/lexer/lexer";

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

  public consumeCurrentToken(type: TokenType, messageOnError?: string): Token {
    const token = this.tokens.getCurrentToken();
    try {
      return this.tokens.consume(type);
    } catch (e: unknown) {
      const error = e instanceof ParserException ? e.message : "Unknown error";
      const errorToken =
        e instanceof ParserException ? e.getToken() : undefined;

      if (errorToken) {
        throw new ParserException(`${messageOnError}: ${error}`, errorToken);
      }
      throw new ParserException(`${messageOnError}: ${error}`, token);
    }
  }

  public isCurrentToken(type: TokenType): boolean {
    return this.tokens.isCurrentToken(type);
  }

  public getCurrentToken(): Token {
    return this.tokens.getCurrentToken();
  }

  public isAtEnd(): boolean {
    return this.isCurrentToken(TokenType.EOF);
  }
}
