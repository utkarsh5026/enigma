import {
  type ExpressionParser,
  type InfixExpressionParser,
  ParsingContext,
  ParserException,
  Precedence,
} from "@/lang/parser/core";
import { AssignmentExpression } from "@/lang/ast";
import { Expression } from "@/lang/ast/ast";
import { TokenType } from "@/lang/token/token";
import { AstValidator } from "@/lang/ast";

/**
 * 📝 AssignmentExpressionParser - Variable Assignment Specialist 📝
 *
 * Handles assignment expressions where we store a value in a variable.
 * Assignment is an infix operation that takes a variable on the left
 * and a value expression on the right.
 *
 * Examples:
 * - x = 42 - assign number to variable
 * - name = "Alice" - assign string to variable
 * - result = calculate() - assign function result to variable
 * - array[i] = value - assign to array element (handled differently)
 *
 * Note: This parser only handles simple variable assignment.
 * Complex left-hand sides like array[i] = value require more
 * sophisticated parsing logic.
 */
export class AssignmentExpressionParser implements InfixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
  }

  public parseInfix(
    context: ParsingContext,
    left: Expression
  ): AssignmentExpression {
    if (
      !AstValidator.isIdentifier(left) &&
      !AstValidator.isIndexExpression(left) &&
      !AstValidator.isPropertyExpression(left)
    ) {
      throw new ParserException(
        "Invalid assignment target - must be an identifier or index expression",
        context.getCurrentToken()
      );
    }

    const assignToken = context.consumeCurrentToken(
      TokenType.ASSIGN,
      "Expected '=' after identifier"
    );
    const value = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    if (context.isCurrentToken(TokenType.SEMICOLON)) {
      context.consumeCurrentToken(TokenType.SEMICOLON);
    }

    return new AssignmentExpression(assignToken, left, value);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.ASSIGN]);
  }
}
