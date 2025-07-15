import { Expression } from "@/lang/ast/ast";
import {
  ParsingContext,
  type ExpressionParser,
  type InfixExpressionParser,
} from "@/lang/parser/core";
import { CallExpression } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";
import { parseExpressionList } from "@/lang/parser/utils/list-parsing";

/**
 * 📞 CallExpressionParser - Function Call Specialist 📞
 *
 * Handles function call expressions where we apply a function to arguments.
 * Function calls are infix operations because they take a left expression
 * (the function) and combine it with arguments on the right.
 *
 * Examples:
 * - print("hello") - function name with string argument
 * - add(2, 3) - function with multiple arguments
 * - getValue() - function with no arguments
 * - user.getName() - method call (parsed as function call)
 * - higherOrder(func)(args) - chained function calls
 *
 * Parsing process:
 * 1. Left expression is the function to call
 * 2. Current token is LPAREN (start of argument list)
 * 3. Parse comma-separated list of argument expressions
 * 4. Expect RPAREN to close the argument list
 * 5. Create CallExpression AST node
 */
export class CallExpressionParser implements InfixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
  }

  public parseInfix(context: ParsingContext, left: Expression): CallExpression {
    const token = context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after function name"
    );
    const args = parseExpressionList(
      context,
      this.expressionParser,
      TokenType.RPAREN,
      "function argument"
    );
    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after function arguments"
    );

    return new CallExpression(token, left, args);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.LPAREN]);
  }
}
