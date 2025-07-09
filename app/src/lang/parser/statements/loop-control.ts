import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext } from "../core";
import * as statements from "@/lang/ast/statement";

export class BreakStatementParser implements Parser<statements.BreakStatement> {
  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.BREAK);
  }

  parse(context: ParsingContext): statements.BreakStatement | null {
    if (!context.isInLoop()) {
      context.errors.addError(
        "Break statement must be inside a loop",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const breakToken = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.SEMICOLON)) {
      context.errors.addTokenError(
        TokenType.SEMICOLON,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new statements.BreakStatement(breakToken);
  }
}

/**
 * ContinueStatementParser - Parses continue statements
 */
export class ContinueStatementParser
  implements Parser<statements.ContinueStatement>
{
  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.CONTINUE);
  }

  parse(context: ParsingContext): statements.ContinueStatement | null {
    if (!context.isInLoop()) {
      context.errors.addError(
        "Continue statement must be inside a loop",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const continueToken = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.SEMICOLON)) {
      context.errors.addTokenError(
        TokenType.SEMICOLON,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new statements.ContinueStatement(continueToken);
  }
}
