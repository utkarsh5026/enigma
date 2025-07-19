import { BlockStatement, Expression, IfExpression } from "@/lang/ast";
import {
  ExpressionParser,
  ParsingContext,
  PrefixExpressionParser,
  StatementParse,
  Precedence,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";
import { BlockStatementParser } from "@/lang/parser/parsers/statements";

/**
 * 🔀 IfExpressionParser - Conditional Logic Specialist 🔀
 *
 * Handles if-expressions that provide conditional evaluation based on boolean
 * conditions.
 * If-expressions can have multiple elif branches and an optional else branch.
 *
 * Examples:
 * - if (x > 0) { "positive" } else { "non-positive" }
 * - if (age >= 18) { "adult" } elif (age >= 13) { "teen" } else { "child" }
 * - if (condition) { doSomething(); result } (complex block)
 *
 * Grammar:
 * ```
 * if-expression := 'if' '(' expression ')' block-statement
 * ('elif' '(' expression ')' block-statement)*
 * ('else' block-statement)?
 * ```
 *
 * The parser builds lists of conditions and corresponding consequence blocks,
 * making it easy for the evaluator to process multiple branches.
 */
export class IfExpressionParser implements PrefixExpressionParser {
  constructor(
    private expressionParser: ExpressionParser,
    private statementParser: StatementParse
  ) {}

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.IF]);
  }

  public parsePrefix(context: ParsingContext): Expression {
    const ifToken = context.consumeCurrentToken(
      TokenType.IF,
      "Expected 'if' keyword"
    );

    const conditions: Expression[] = [];
    const consequences: BlockStatement[] = [];

    this.parseIfBranch(context, conditions, consequences);

    while (context.isCurrentToken(TokenType.ELIF)) {
      context.consumeCurrentToken(TokenType.ELIF);
      this.parseIfBranch(context, conditions, consequences);
    }

    let alternative: BlockStatement | null = null;
    if (context.isCurrentToken(TokenType.ELSE)) {
      context.consumeCurrentToken(TokenType.ELSE);
      const blockParser = new BlockStatementParser(this.statementParser);
      const elseBlock = blockParser.parse(context);
      alternative = elseBlock;
    }

    return new IfExpression(ifToken, conditions, consequences, alternative);
  }

  private parseIfBranch(
    context: ParsingContext,
    conditions: Expression[],
    consequences: BlockStatement[]
  ) {
    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after 'if' keyword"
    );
    const condition = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after condition"
    );

    const blockParser = new BlockStatementParser(this.statementParser);
    const consequence = blockParser.parse(context);

    conditions.push(condition);
    consequences.push(consequence);
  }
}
