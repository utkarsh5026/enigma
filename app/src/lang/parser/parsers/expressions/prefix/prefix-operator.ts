import { PrefixExpression } from "@/lang/ast";
import { ParserException, Precedence } from "@/lang/parser/core";
import {
  ExpressionParser,
  ParsingContext,
  PrefixExpressionParser,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";

/**
 * 🔄 PrefixOperatorParser - Unary Operator Specialist 🔄
 *
 * Handles prefix (unary) operators that appear before expressions.
 * These operators take one operand and transform it in some way.
 *
 * Examples:
 * - !true (logical NOT - negates boolean values)
 * - -42 (arithmetic negation - makes numbers negative)
 * - +value (unary plus - explicit positive, rarely used)
 *
 * The parser works by:
 * 1. Capturing the operator token
 * 2. Recursively parsing the right operand with PREFIX precedence
 * 3. Creating a PrefixExpression AST node
 */
export class PrefixOperatorParser implements PrefixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {}

  public parsePrefix(context: ParsingContext) {
    const operatorToken = context.getCurrentToken();
    const operator = operatorToken.literal;

    if (!this.getHandledTokenTypes().has(operatorToken.type)) {
      throw new ParserException(
        "Invalid operator: " + operatorToken.type,
        operatorToken
      );
    }

    context.consumeCurrentToken(operatorToken.type);
    const right = this.expressionParser.parseExpression(
      context,
      Precedence.PREFIX
    );

    return new PrefixExpression(operatorToken, operator, right, right.endToken);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.MINUS, TokenType.BANG]);
  }
}
