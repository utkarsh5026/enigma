import { HashLiteral, AstValidator } from "@/lang/ast";
import { Expression } from "@/lang/ast/ast";
import {
  type ExpressionParser,
  ParserException,
  ParsingContext,
  type PrefixExpressionParser,
  Precedence,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { parseCustomList } from "@/lang/parser/utils/list-parsing";

type KeyValuePair = {
  key: string;
  value: Expression;
};

/**
 * 🗃️ HashLiteralParser - Object/Map Construction Specialist 🗃️
 *
 * Handles hash literal expressions that create key-value mappings.
 * Hashes (also called objects, maps, or dictionaries) store data as key-value
 * pairs.
 *
 * Examples:
 * - {"name": "Alice", "age": 30} (person object)
 * - {"x": 10, "y": 20} (coordinate object)
 * - {1: "one", 2: "two"} (integer keys)
 * - {} (empty hash)
 * - {"nested": {"inner": "value"}} (nested hashes)
 * - {"func": getValue(), "calc": 2 + 3} (expression values)
 *
 * Parsing process:
 * 1. Current token is LBRACE {
 * 2. Parse key-value pairs separated by commas
 * 3. Each pair: key : value
 * 4. Keys must be literals (strings or integers)
 * 5. Values can be any expression
 * 6. Expect RBRACE } to close
 */
export class HashLiteralParser implements PrefixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {}

  public parsePrefix(context: ParsingContext) {
    const leftBraceToken = context.consumeCurrentToken(
      TokenType.LBRACE,
      "Expected '{' at start of hash literal"
    );
    const pairs: Map<string, Expression> = new Map();

    const keyValuePairs = parseCustomList(
      context,
      this.parseKeyValuePair.bind(this),
      TokenType.RBRACE,
      "hash key-value pair"
    );

    keyValuePairs.forEach((pair) => {
      pairs.set(pair.key, pair.value);
    });

    context.consumeCurrentToken(
      TokenType.RBRACE,
      "Expected '}' at end of hash literal"
    );
    return new HashLiteral(leftBraceToken, pairs);
  }

  /**
   * 🔑 Parses a single key-value pair
   */
  private parseKeyValuePair(context: ParsingContext): KeyValuePair {
    const key = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );
    const keyString = this.getKeyString(key);

    if (keyString === null) {
      throw new ParserException(
        "Invalid key type key must be a string or integer like '1' or '\"name\"'"
      );
    }

    context.consumeCurrentToken(TokenType.COLON, "Expected ':' after key");
    const value = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    return { key: keyString, value };
  }

  /**
   * 🔑 Converts key expression to string representation
   */
  private getKeyString(key: Expression): string | null {
    if (AstValidator.isStringLiteral(key)) {
      return key.toString();
    }

    if (AstValidator.isIntegerLiteral(key)) {
      return key.toString();
    }
    return null;
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.LBRACE]);
  }
}
