import {
  type Parser,
  ParsingContext,
  type ExpressionParser,
  Precedence,
} from "@/lang/parser/core";
import { Expression, Identifier, Statement } from "@/lang/ast";
import { Token, TokenType } from "@/lang/token/token";

interface StatementFactory<T extends Statement> {
  create(
    startToken: Token,
    name: Identifier,
    value: Expression,
    endToken: Token
  ): T;
}

export class AssignmentStatementParser<
  T extends Statement,
> implements Parser<T> {
  constructor(
    private expectedTokenType: TokenType,
    private statementFactory: StatementFactory<T>,
    private expressionParser: ExpressionParser
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(this.expectedTokenType);
  }

  /**
   * 🎯 Parse an assignment statement
   *
   * Parses a statement of the form:
   * const/let identifier = expression;
   * keywordToken = let | const
   * nameToken = Identifier
   *
   * @param context The parsing context
   * @return The parsed statement
   */
  parse(context: ParsingContext): T {
    const keywordToken = context.consumeCurrentToken(this.expectedTokenType);
    const nameToken = context.consumeCurrentToken(TokenType.IDENTIFIER);

    const identifier = new Identifier(nameToken, nameToken.literal);

    context.consumeCurrentToken(TokenType.ASSIGN);

    const value = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    const endToken = context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after assignment"
    );

    return this.statementFactory.create(
      keywordToken,
      identifier,
      value,
      endToken
    );
  }
}
