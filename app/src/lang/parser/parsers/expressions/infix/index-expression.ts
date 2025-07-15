import { InfixExpressionParser, Precedence } from "@/lang/parser/core";
import { Expression } from "@/lang/ast/ast";
import { TokenType } from "@/lang/token/token";
import { ParsingContext, ExpressionParser } from "@/lang/parser/core";
import { IndexExpression } from "@/lang/ast/expression";

/**
 * 🗂️ IndexExpressionParser - Array/Object Access Specialist 🗂️
 *
 * Handles index/bracket access expressions for arrays and objects.
 * This allows accessing elements by index or key.
 *
 * Examples:
 * - array[0] - access first element of array
 * - array[i] - access element at variable index
 * - hash["key"] - access object property by string key
 * - matrix[row][col] - chained indexing for multi-dimensional structures
 * - getValue()[0] - indexing the result of a function call
 *
 * Parsing process:
 * 1. Left expression is what we're indexing into
 * 2. Current token is LBRACKET (start of index)
 * 3. Parse the index expression
 * 4. Expect RBRACKET to close the index
 * 5. Create IndexExpression AST node
 */
export class IndexExpressionParser implements InfixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {}

  public parseInfix(
    context: ParsingContext,
    left: Expression
  ): IndexExpression {
    const leftBracket = context.consumeCurrentToken(
      TokenType.LBRACKET,
      "Expected '[' before index expression"
    );

    const index = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    context.consumeCurrentToken(
      TokenType.RBRACKET,
      "Expected ']' after index expression"
    );

    return new IndexExpression(leftBracket, left, index);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.LBRACKET]);
  }
}
