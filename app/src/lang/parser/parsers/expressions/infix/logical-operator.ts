import {
  ExpressionParser,
  InfixExpressionParser,
  ParsingContext,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { BinaryOperatorParser } from "./binary-operator-parser";
import { Expression } from "@/lang/ast";

/**
 * 🔗 LogicalOperatorParser - Boolean Logic Operations 🔗
 *
 * Handles logical operations between boolean expressions.
 * These operations combine boolean values using logical rules.
 *
 * Supported operations:
 * - && (logical AND): true && false → false
 * - || (logical OR): true || false → true
 *
 * Note: These operators typically use short-circuit evaluation
 * in the evaluator (not implemented here, just parsing).
 */
export class LogicalOperatorParser implements InfixExpressionParser {
  private delegate: BinaryOperatorParser;

  constructor(expressionParser: ExpressionParser) {
    const handledTokenTypes = new Set<TokenType>([TokenType.AND, TokenType.OR]);

    this.delegate = new BinaryOperatorParser(
      expressionParser,
      handledTokenTypes
    );
  }

  public parseInfix(context: ParsingContext, left: Expression) {
    return this.delegate.parseInfix(context, left);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return this.delegate.getHandledTokenTypes();
  }
}
