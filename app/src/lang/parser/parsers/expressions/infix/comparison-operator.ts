import {
  ExpressionParser,
  InfixExpressionParser,
  ParsingContext,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { BinaryOperatorParser } from "./binary-operator-parser";
import { Expression } from "@/lang/ast";

/**
 * ⚡ BinaryOperatorParser - Generic Binary Operation Handler ⚡
 *
 * Base class for parsers that handle binary operations between two expressions.
 * This eliminates duplication between arithmetic, comparison, and other binary
 * operators.
 *
 * The parser follows a standard pattern:
 * 1. Validate the current token is a handled operator
 * 2. Get the operator's precedence
 * 3. Parse the right operand
 * 4. Create an InfixExpression node
 * 5. Handle error cases appropriately
 */
export class ComparisonOperatorParser implements InfixExpressionParser {
  private delegate: BinaryOperatorParser;

  constructor(expressionParser: ExpressionParser) {
    this.delegate = new BinaryOperatorParser(
      expressionParser,
      new Set<TokenType>([
        TokenType.EQ, // ==
        TokenType.NOT_EQ, // !=
        TokenType.LESS_THAN, // <
        TokenType.GREATER_THAN, // >
        TokenType.LESS_THAN_OR_EQUAL, // <=
        TokenType.GREATER_THAN_OR_EQUAL, // >=
      ])
    );
  }

  public parseInfix(context: ParsingContext, left: Expression) {
    return this.delegate.parseInfix(context, left);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return this.delegate.getHandledTokenTypes();
  }
}
