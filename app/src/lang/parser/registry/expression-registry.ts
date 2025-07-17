import {
  ExpressionParser,
  InfixExpressionParser,
  PrefixExpressionParser,
  StatementParse,
} from "../core";
import { TokenType } from "@/lang/token/token";
import {
  IdentifierExpressionParser,
  IntegerLiteralParser,
  StringLiteralParser,
  BooleanLiteralParser,
  NullLiteralParser,
  PrefixOperatorParser,
  FunctionalLiteralParser,
  HashLiteralParser,
  GroupedExpressionParser,
  ArrayLiteralParser,
  IfExpressionParser,
} from "../parsers/expressions/prefix";
import {
  ArithmeticOperatorParser,
  ComparisonOperatorParser,
  LogicalOperatorParser,
  AssignmentExpressionParser,
  CallExpressionParser,
  IndexExpressionParser,
} from "../parsers/expressions/infix";
import { FStringLiteralParser } from "../parsers/expressions/prefix/fstring-literal";

export class ExpressionParserRegistry {
  private prefixParsers: Map<TokenType, PrefixExpressionParser> = new Map();
  private infixParsers: Map<TokenType, InfixExpressionParser> = new Map();
  private expressionParser: ExpressionParser;
  private statementParser: StatementParse;

  constructor(
    expressionParser: ExpressionParser,
    statementParser: StatementParse
  ) {
    this.expressionParser = expressionParser;
    this.statementParser = statementParser;
    this.registerPrefixParsers();
    this.registerInfixParsers();
  }

  // 📋 Lists of registered parsers for management
  private registeredPrefixParsers: PrefixExpressionParser[] = [];
  private registeredInfixParsers: InfixExpressionParser[] = [];

  public registerPrefixParser(parser: PrefixExpressionParser) {
    this.registeredPrefixParsers.push(parser);

    for (const tokenType of parser.getHandledTokenTypes()) {
      if (this.prefixParsers.has(tokenType)) {
        throw new Error(
          `Prefix parser for token type ${tokenType} is already registered`
        );
      }
      this.prefixParsers.set(tokenType, parser);
    }
  }

  private registerPrefixParsers() {
    this.registerPrefixParser(new IdentifierExpressionParser());
    this.registerPrefixParser(new IntegerLiteralParser());
    this.registerPrefixParser(new StringLiteralParser());
    this.registerPrefixParser(new BooleanLiteralParser());
    this.registerPrefixParser(new NullLiteralParser());
    this.registerPrefixParser(new PrefixOperatorParser(this.expressionParser));
    this.registerPrefixParser(
      new FunctionalLiteralParser(this.statementParser)
    );
    this.registerPrefixParser(new HashLiteralParser(this.expressionParser));
    this.registerPrefixParser(
      new GroupedExpressionParser(this.expressionParser)
    );
    this.registerPrefixParser(new ArrayLiteralParser(this.expressionParser));
    this.registerPrefixParser(
      new IfExpressionParser(this.expressionParser, this.statementParser)
    );
    this.registerPrefixParser(new FStringLiteralParser());
  }

  private registerInfixParsers() {
    this.registerInfixParser(
      new ArithmeticOperatorParser(this.expressionParser)
    );
    this.registerInfixParser(
      new ComparisonOperatorParser(this.expressionParser)
    );
    this.registerInfixParser(new LogicalOperatorParser(this.expressionParser));
    this.registerInfixParser(
      new AssignmentExpressionParser(this.expressionParser)
    );
    this.registerInfixParser(new CallExpressionParser(this.expressionParser));
    this.registerInfixParser(new IndexExpressionParser(this.expressionParser));
  }

  public registerInfixParser(parser: InfixExpressionParser) {
    this.registeredInfixParsers.push(parser);

    for (const tokenType of parser.getHandledTokenTypes()) {
      if (this.infixParsers.has(tokenType)) {
        throw new Error(
          `Infix parser for token type ${tokenType} is already registered`
        );
      }
      this.infixParsers.set(tokenType, parser);
    }
  }

  public getPrefixParser(
    tokenType: TokenType
  ): PrefixExpressionParser | undefined {
    return this.prefixParsers.get(tokenType);
  }

  public getInfixParser(
    tokenType: TokenType
  ): InfixExpressionParser | undefined {
    return this.infixParsers.get(tokenType);
  }

  public removePrefixParser(parser: PrefixExpressionParser): boolean {
    if (!this.registeredPrefixParsers.includes(parser)) {
      return false;
    }

    this.prefixParsers.forEach((value, key) => {
      if (value === parser) {
        this.prefixParsers.delete(key);
      }
    });
    return true;
  }

  public removeInfixParser(parser: InfixExpressionParser): boolean {
    if (!this.registeredInfixParsers.includes(parser)) {
      return false;
    }

    // Remove all token mappings for this parser
    this.infixParsers.forEach((value, key) => {
      if (value === parser) {
        this.infixParsers.delete(key);
      }
    });
    return true;
  }

  public clear() {
    this.prefixParsers.clear();
    this.infixParsers.clear();
    this.registeredPrefixParsers = [];
    this.registeredInfixParsers = [];
  }

  /**
   * 🔍 Checks if a token type has a registered prefix parser
   */
  public hasPrefixParser(tokenType: TokenType): boolean {
    return this.prefixParsers.has(tokenType);
  }

  /**
   * ⚡ Checks if a token type has a registered infix parser
   */
  public hasInfixParser(tokenType: TokenType): boolean {
    return this.infixParsers.has(tokenType);
  }

  /**
   * 📋 Gets all supported prefix token types
   */
  public getSupportedPrefixTokens(): Set<TokenType> {
    return new Set(this.prefixParsers.keys());
  }

  /**
   * 📋 Gets all supported infix token types
   */
  public getSupportedInfixTokens(): Set<TokenType> {
    return new Set(this.infixParsers.keys());
  }
}
