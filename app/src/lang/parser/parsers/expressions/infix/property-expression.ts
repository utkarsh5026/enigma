import { ParsingContext } from "@/lang/parser/core";
import { InfixExpressionParser } from "@/lang/parser/core/parser";
import { Expression, Identifier, PropertyExpression } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";

/**
 * 🔗 PropertyExpressionParser - Property Access Parser 🔗
 *
 * Parses dot notation for accessing object properties and methods.
 *
 * From first principles, property access parsing involves:
 * 1. Left expression is the object
 * 2. Current token is DOT
 * 3. Next token should be the property name
 * 4. Create PropertyExpression AST node
 *
 * Grammar:
 * ```
 * property-access := expression '.' IDENTIFIER
 * ```
 */
export class PropertyExpressionParser implements InfixExpressionParser {
  public parseInfix(context: ParsingContext, left: Expression) {
    const dotToken = context.consumeCurrentToken(
      TokenType.DOT,
      "Expected '.' for property access"
    );

    const propertyToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected property name after '.'"
    );

    const property = new Identifier(propertyToken, propertyToken.literal);

    return new PropertyExpression(dotToken, left, property, propertyToken);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.DOT]);
  }
}
