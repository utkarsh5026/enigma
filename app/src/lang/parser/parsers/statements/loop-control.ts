import { TokenType } from "@/lang/token/token";
import {
  type Parser,
  ParserException,
  ParsingContext,
} from "@/lang/parser/core";
import { BreakStatement, ContinueStatement } from "@/lang/ast";

export class BreakStatementParser implements Parser<BreakStatement> {
  canParse(context: ParsingContext): boolean {
    return context.isCurrentToken(TokenType.BREAK);
  }

  /**
   * 🎯 Parse a break statement
   *
   * Parses a statement of the form:
   * break;
   *
   * @param context The parsing context
   * @return The parsed break statement
   */
  parse(context: ParsingContext): BreakStatement {
    if (!context.isInLoop()) {
      throw new ParserException(
        "Break statement must be inside a loop",
        context.getCurrentToken()
      );
    }

    const breakToken = context.consumeCurrentToken(
      TokenType.BREAK,
      "Expected 'break' at start of break statement"
    );
    const endToken = context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after break statement"
    );

    return new BreakStatement(breakToken, endToken);
  }
}

/**
 * ContinueStatementParser - Parses continue statements
 */
export class ContinueStatementParser implements Parser<ContinueStatement> {
  canParse(context: ParsingContext): boolean {
    return context.isCurrentToken(TokenType.CONTINUE);
  }

  /**
   * 🎯 Parse a continue statement
   *
   * Parses a statement of the form:
   * continue;
   *
   * @param context The parsing context
   * @return The parsed continue statement
   */
  parse(context: ParsingContext): ContinueStatement {
    if (!context.isInLoop()) {
      throw new ParserException(
        "Continue statement must be inside a loop",
        context.getCurrentToken()
      );
    }

    const continueToken = context.consumeCurrentToken(
      TokenType.CONTINUE,
      "Expected 'continue' at start of continue statement"
    );

    const endToken = context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after continue statement"
    );
    return new ContinueStatement(continueToken, endToken);
  }
}
