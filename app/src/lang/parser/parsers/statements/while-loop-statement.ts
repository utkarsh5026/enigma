import { TokenType } from "@/lang/token/token";
import {
  type Parser,
  ParsingContext,
  Precedence,
  type StatementParse,
  type ExpressionParser,
} from "@/lang/parser/core";
import { BlockStatementParser } from "./block-statement";
import { BlockStatement, WhileStatement } from "@/lang/ast";

export class WhileStatementParser implements Parser<WhileStatement> {
  constructor(
    private parseStatement: StatementParse,
    private expressionParser: ExpressionParser
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.isCurrentToken(TokenType.WHILE);
  }

  /**
   * 🎯 Parse a while loop statement
   *
   * Parses a statement of the form:
   * while (condition) { statement* }
   *
   * @param context The parsing context
   * @return The parsed while loop statement
   */
  parse(context: ParsingContext): WhileStatement {
    const whileToken = context.consumeCurrentToken(
      TokenType.WHILE,
      "Expected 'while' at start of while loop"
    );
    context.consumeCurrentToken(TokenType.LPAREN, "Expected '(' after 'while'");

    const condition = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after condition"
    );

    const body = this.parseLoopBody(context);
    return new WhileStatement(whileToken, condition, body);
  }

  private parseLoopBody(context: ParsingContext): BlockStatement {
    context.enterLoop();
    const blockParser = new BlockStatementParser(this.parseStatement);
    const body = blockParser.parse(context);
    context.exitLoop();
    return body;
  }
}
