import { TokenType } from "@/lang/token/token";
import {
  type PrefixExpressionParser,
  ParsingContext,
  ParserException,
} from "@/lang/parser/core";
import { Expression } from "@/lang/ast/ast";
import { BooleanExpression } from "@/lang/ast/expression";

export class BooleanLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const currToken = context.getCurrentToken();

    if (!this.getHandledTokenTypes().has(currToken.type)) {
      throw new ParserException(
        `Expected ${Array.from(this.getHandledTokenTypes()).join(", ")}`,
        currToken
      );
    }

    context.consumeCurrentToken(currToken.type);

    return new BooleanExpression(currToken, currToken.type == TokenType.TRUE);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.TRUE, TokenType.FALSE]);
  }
}
