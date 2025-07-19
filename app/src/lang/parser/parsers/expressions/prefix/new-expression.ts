import { Expression, NewExpression } from "@/lang/ast";
import {
  ExpressionParser,
  ParsingContext,
  PrefixExpressionParser,
  Precedence,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { parseExpressionList } from "@/lang/parser/utils/list-parsing";

/**
 * 🆕 NewExpressionParser - Object Instantiation Parser 🆕
 *
 * Parses 'new' expressions for creating class instances.
 *
 * From first principles, parsing new expressions involves:
 * 1. Parse 'new' keyword
 * 2. Parse class name expression
 * 3. Parse argument list (like function calls)
 * 4. Create NewExpression AST node
 *
 * Grammar:
 * ```
 * new-expression := 'new' expression '(' argument-list ')'
 * argument-list := (expression (',' expression)*)?
 * ```
 */
export class NewExpressionParser implements PrefixExpressionParser {
  constructor(private readonly expressionParser: ExpressionParser) {}

  public parsePrefix(context: ParsingContext): Expression {
    const newToken = context.consumeCurrentToken(
      TokenType.NEW,
      "Expected 'new' keyword"
    );
    const className = this.expressionParser.parseExpression(
      context,
      Precedence.CALL
    );

    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after class name in new expression"
    );

    const args = parseExpressionList(
      context,
      this.expressionParser,
      TokenType.RPAREN,
      "constructor argument"
    );

    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after constructor arguments"
    );

    return new NewExpression(newToken, className, args);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.NEW]);
  }
}
