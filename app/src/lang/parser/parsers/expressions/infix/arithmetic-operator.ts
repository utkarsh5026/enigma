import {
  ExpressionParser,
  InfixExpressionParser,
  ParsingContext,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { BinaryOperatorParser } from "./binary-operator-parser";
import { Expression } from "@/lang/ast/ast";

/**
 * ⚡ ArithmeticOperatorParser - Binary Math Operations ⚡
 *
 * Handles arithmetic operations between two expressions.
 * These are the fundamental math operations that combine two values.
 *
 * Supported operations:
 * - + (addition): 5 + 3 = 8
 * - - (subtraction): 10 - 4 = 6
 * - * (multiplication): 3 * 7 = 21
 * - / (division): 15 / 3 = 5
 * - % (modulus): 17 % 5 = 2
 *
 * The parser uses the current operator's precedence to determine
 * how tightly to bind the right operand.
 */
export class ArithmeticOperatorParser implements InfixExpressionParser {
  private delegate: BinaryOperatorParser;

  constructor(expressionParser: ExpressionParser) {
    const handledTokenTypes = new Set<TokenType>([
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.ASTERISK,
      TokenType.SLASH,
      TokenType.MODULUS,
    ]);

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
