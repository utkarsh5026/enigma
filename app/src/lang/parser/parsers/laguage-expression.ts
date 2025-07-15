import {
  ExpressionParser,
  ParsingContext,
  Precedence,
  StatementParse,
  ParserException,
} from "../core";
import { TokenType } from "@/lang/token/token";
import { ExpressionParserRegistry } from "../registry/expression-registry";
import { Expression } from "@/lang/ast/ast";

export class LanguageExpressionParser implements ExpressionParser {
  private registry: ExpressionParserRegistry;

  constructor(statementParser: StatementParse) {
    this.registry = new ExpressionParserRegistry(
      this,
      statementParser as StatementParse
    );
  }

  /**
   * 🔍 Checks if a token type can start an expression
   */
  public canStartExpression(tokenType: TokenType): boolean {
    return this.registry.hasPrefixParser(tokenType);
  }

  /**
   * ⚡ Checks if a token type can be used as an infix operator
   */
  public canBeInfixOperator(tokenType: TokenType): boolean {
    return this.registry.hasInfixParser(tokenType);
  }

  private shouldContinueParsing(
    context: ParsingContext,
    minPrecedence: Precedence
  ): boolean {
    const stopTokens = new Set([
      TokenType.SEMICOLON,
      TokenType.COMMA,
      TokenType.COLON,
    ]);
    if (stopTokens.has(context.getCurrentToken().type)) {
      return false;
    }

    const currentTokenType = context.getCurrentToken().type;
    const nextPrecedence = context.precedence.getPrecedence(currentTokenType);

    if (minPrecedence >= nextPrecedence) {
      return false;
    }

    return this.registry.hasInfixParser(currentTokenType);
  }

  private parseInfix(context: ParsingContext, left: Expression) {
    const currentToken = context.getCurrentToken();

    console.log("Parsing infix: " + currentToken);

    const parser = this.registry.getInfixParser(currentToken.type);
    if (parser === undefined) {
      throw new ParserException(
        "No infix parser found for token type: " + currentToken.type,
        currentToken
      );
    }
    return parser.parseInfix(context, left);
  }

  private parsePrefix(context: ParsingContext) {
    const currentTokenType = context.getCurrentToken().type;

    const parser = this.registry.getPrefixParser(currentTokenType);

    if (parser === undefined) {
      throw new ParserException(
        "No prefix parser found for token type: " + currentTokenType,
        context.getCurrentToken()
      );
    }

    return parser.parsePrefix(context);
  }

  /**
   * 🎯 Main expression parsing method implementing Pratt parsing
   *
   * This is the heart of the expression parsing system. It uses the
   * Pratt parsing algorithm to correctly handle operator precedence
   * and associativity while delegating to specialized parsers.
   *
   * The algorithm works in two phases:
   * 1. **Prefix Phase**: Parse the initial expression using a prefix parser
   * 2. **Infix Phase**: Repeatedly combine with higher-precedence operators
   *
   * @param context       The parsing context with tokens and error reporting
   * @param minPrecedence The minimum precedence level for this parsing pass
   * @return The parsed expression, or null if parsing fails
   */
  public parseExpression(context: ParsingContext, minPrecedence: Precedence) {
    let leftExpression = this.parsePrefix(context);

    while (this.shouldContinueParsing(context, minPrecedence)) {
      leftExpression = this.parseInfix(context, leftExpression);
    }

    return leftExpression;
  }
}
