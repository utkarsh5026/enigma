import {
  type InfixExpressionParser,
  type ExpressionParser,
  ParserException,
  ParsingContext,
} from "@/lang/parser/core";
import { Operator, TokenType } from "@/lang/token/token";
import { Expression, InfixExpression } from "@/lang/ast";

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
export class BinaryOperatorParser implements InfixExpressionParser {
  constructor(
    private expressionParser: ExpressionParser,
    private handledTokenTypes: Set<TokenType>
  ) {}

  public parseInfix(context: ParsingContext, left: Expression) {
    const operatorToken = context.getCurrentToken();
    const operator = operatorToken.literal;

    if (!this.handledTokenTypes.has(operatorToken.type)) {
      throw new ParserException(
        "Invalid operator: " + operatorToken.type,
        operatorToken
      );
    }

    const precedence = context.precedence.getPrecedence(operatorToken.type);
    context.consumeCurrentToken(operatorToken.type);

    const right = this.expressionParser.parseExpression(context, precedence);
    return new InfixExpression(
      operatorToken,
      left,
      operator as Operator,
      right
    );
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return this.handledTokenTypes;
  }
}
