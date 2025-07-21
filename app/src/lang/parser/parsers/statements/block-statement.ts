import { TokenType } from "@/lang/token/token";
import {
  type Parser,
  ParsingContext,
  type StatementParse,
} from "@/lang/parser/core";
import { BlockStatement, Statement } from "@/lang/ast";

export class BlockStatementParser implements Parser<BlockStatement> {
  constructor(private parseStatement: StatementParse) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.LBRACE);
  }

  /**
   * 🎯 Parse a block statement
   *
   * Parses a statement of the form:
   * { statement* }
   *
   * @param context The parsing context
   * @return The parsed block statement
   */
  parse(context: ParsingContext): BlockStatement {
    const lBraceToken = context.consumeCurrentToken(
      TokenType.LBRACE,
      "Expected '{' at start of block"
    );
    const stmts: Statement[] = [];

    while (!context.isCurrentToken(TokenType.RBRACE) && !context.isAtEnd()) {
      const statement = this.parseStatement.parseStatement(context);
      if (statement) {
        stmts.push(statement);
      }
    }

    const rBraceToken = context.consumeCurrentToken(
      TokenType.RBRACE,
      "Expected '}' at end of block"
    );

    return new BlockStatement(lBraceToken, stmts, rBraceToken);
  }
}
