import { Token, TokenType } from "@/lang/token/token";
import {
  type Parser,
  ParsingContext,
  type ExpressionParser,
} from "@/lang/parser/core";
import { AssignmentStatementParser } from "./assignment-parser";
import { LetStatement, Identifier, Expression } from "@/lang/ast";
export class LetStatementParser implements Parser<LetStatement> {
  private delegate: AssignmentStatementParser<LetStatement>;

  constructor(expressionParser: ExpressionParser) {
    this.delegate = new AssignmentStatementParser(
      TokenType.LET,
      {
        create: (
          startToken: Token,
          name: Identifier,
          value: Expression,
          endToken: Token
        ) => new LetStatement(startToken, name, value, endToken),
      },
      expressionParser
    );
  }

  canParse(context: ParsingContext): boolean {
    return this.delegate.canParse(context);
  }

  /**
   * 🎯 Parse a let statement
   *
   * Parses a statement of the form:
   * let identifier = expression;
   *
   * @param context The parsing context
   * @return The parsed let statement
   */
  parse(context: ParsingContext): LetStatement {
    return this.delegate.parse(context);
  }
}
