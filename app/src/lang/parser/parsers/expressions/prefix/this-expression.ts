import { ParsingContext, PrefixExpressionParser } from "@/lang/parser/core";
import { Expression, ThisExpression } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";

/**
 * 👆 ThisExpressionParser - Current Instance Reference Parser 👆
 *
 * Parses 'this' expressions for referencing the current object instance.
 *
 * From first principles, this parsing is simple:
 * 1. Parse 'this' keyword
 * 2. Create ThisExpression AST node
 *
 * Grammar:
 * ```
 * this-expression := 'this'
 * ```
 */
export class ThisExpressionParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const thisToken = context.consumeCurrentToken(
      TokenType.THIS,
      "Expected 'this' keyword"
    );
    return new ThisExpression(thisToken);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.THIS]);
  }
}
