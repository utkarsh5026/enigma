import {
  ParsingContext,
  type PrefixExpressionParser,
} from "@/lang/parser/core";
import { StatementParse } from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { parseCustomList } from "@/lang/parser/utils/list-parsing";
import { BlockStatementParser } from "@/lang/parser/parsers/statements";
import { FunctionLiteral, Identifier } from "@/lang/ast";

/**
 * 🔧 FunctionLiteralParser - Function Definition Specialist 🔧
 *
 * Handles function literal expressions that define anonymous functions.
 * Function literals create callable objects with parameters and a body.
 *
 * Examples:
 * - fn(x) { return x * 2; } (single parameter)
 * - fn(a, b) { return a + b; } (multiple parameters)
 * - fn() { print("hello"); } (no parameters)
 * - fn(x, y) { let sum = x + y; return sum * 2; } (complex body)
 *
 * Parsing process:
 * 1. Current token is FUNCTION (fn)
 * 2. Expect LPAREN (
 * 3. Parse parameter list (comma-separated identifiers)
 * 4. Expect RPAREN )
 * 5. Expect LBRACE {
 * 6. Parse block statement body
 * 7. Create FunctionLiteral AST node
 */
export class FunctionalLiteralParser implements PrefixExpressionParser {
  constructor(private statementParser: StatementParse) {}

  public parsePrefix(context: ParsingContext) {
    const functionToken = context.consumeCurrentToken(
      TokenType.FUNCTION,
      "Expected 'fn' keyword"
    );

    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after 'fn' keyword"
    );

    const parameters = this.parseParameters(context);
    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after parameters"
    );

    const blockParser = new BlockStatementParser(this.statementParser);
    const block = blockParser.parse(context);

    return new FunctionLiteral(
      functionToken,
      parameters,
      block,
      block.endToken
    );
  }

  /**
   * 📋 Parses function parameters using the common list parsing utility
   */
  private parseParameters(context: ParsingContext) {
    return parseCustomList(
      context,
      this.parseParameter.bind(this),
      TokenType.RPAREN,
      "function parameter"
    );
  }

  /**
   * 🏷️ Parses a single function parameter (identifier)
   */
  private parseParameter(context: ParsingContext) {
    const identifierToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected parameter name"
    );
    return new Identifier(identifierToken, identifierToken.literal);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.FUNCTION]);
  }
}
