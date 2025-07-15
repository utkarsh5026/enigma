import {
  ExpressionParser,
  ParsingContext,
  PrefixExpressionParser,
} from "@/lang/parser/core";
import { parseExpressionList } from "@/lang/parser/utils/list-parsing";
import { ArrayLiteral } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";
/**
 * 📋 ArrayLiteralParser - Array Construction Specialist 📋
 *
 * Handles array literal expressions that create arrays from a list of elements.
 * Arrays are fundamental data structures that hold ordered collections of
 * values.
 *
 * Examples:
 * - [1, 2, 3] (array of integers)
 * - ["a", "b", "c"] (array of strings)
 * - [true, false, true] (array of booleans)
 * - [func(), getValue(), x + y] (array of expressions)
 * - [] (empty array)
 * - [1, "hello", true, [2, 3]] (mixed types and nested arrays)
 *
 * Parsing process:
 * 1. Current token is LBRACKET [
 * 2. Parse comma-separated list of expressions
 * 3. Handle empty arrays gracefully
 * 4. Expect RBRACKET ] to close
 * 5. Create ArrayLiteral AST node
 */
export class ArrayLiteralParser implements PrefixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
  }

  public parsePrefix(context: ParsingContext) {
    const leftBracketToken = context.consumeCurrentToken(
      TokenType.LBRACKET,
      "Array literal not opened should start with ["
    );

    const elements = parseExpressionList(
      context,
      this.expressionParser,
      TokenType.RBRACKET,
      "array element"
    );

    context.consumeCurrentToken(
      TokenType.RBRACKET,
      "Array literal not closed should end with ]"
    );
    return new ArrayLiteral(leftBracketToken, elements);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.LBRACKET]);
  }
}
