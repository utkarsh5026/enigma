import { TokenType } from "@/lang/token/token";
import {
  type ExpressionParser,
  type Parser,
  ParsingContext,
  Precedence,
  type StatementParse,
} from "@/lang/parser/core";
import { BlockStatementParser } from "./block-statement";
import { BlockStatement, ForStatement } from "@/lang/ast";
import { LetStatementParser } from "./let-statement";

export class ForStatementParser implements Parser<ForStatement> {
  constructor(
    private parseStatement: StatementParse,
    private expressionParser: ExpressionParser
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.FOR);
  }

  /**
   * 🎯 Parse a for loop statement
   *
   * Parses a statement of the form:
   * for (let init; condition; update) { statement* }
   *
   * @param context The parsing context
   * @return The parsed for loop statement
   */
  parse(context: ParsingContext): ForStatement {
    const forToken = context.consumeCurrentToken(
      TokenType.FOR,
      "Expected 'for' at start of for loop"
    );

    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after 'for' keyword"
    );

    const letParser = new LetStatementParser(this.expressionParser);
    const init = letParser.parse(context);

    const condition = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after condition"
    );

    const update = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after for loop"
    );

    const body = this.parseLoopBody(context);
    return new ForStatement(
      forToken,
      init,
      condition,
      update,
      body,
      body.endToken
    );
  }

  private parseLoopBody(context: ParsingContext): BlockStatement {
    context.enterLoop();
    const blockParser = new BlockStatementParser(this.parseStatement);
    const body = blockParser.parse(context);
    context.exitLoop();
    return body;
  }
}
