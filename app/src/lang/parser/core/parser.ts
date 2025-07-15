import { ParsingContext } from "./parsing-context";
import { Statement, Node, Expression } from "@/lang/ast/ast";
import { Precedence } from "./precedence";
import { TokenType } from "@/lang/token/token";
/**
 * Interface for statement parsers.
 *
 * @param <T> The type of statement to parse
 */
export interface StatementParse {
  /**
   * Parses a statement from the current position.
   *
   * @param context The parsing context containing the current state
   * @return The parsed statement
   */
  parseStatement(context: ParsingContext): Statement;
}

/**
 * Parser interface - All parsers implement this
 */
export interface Parser<T extends Node> {
  /**
   * Parses a node from the current position.
   *
   * @param context The parsing context containing the current state
   * @return The parsed node
   */
  parse(context: ParsingContext): T;

  /**
   * Checks if the parser can parse the current position.
   *
   * @param context The parsing context containing the current state
   * @return True if the parser can parse the current position, false otherwise
   */
  canParse(context: ParsingContext): boolean;
}

/**
 * Interface for expression parsers.
 */
export interface ExpressionParser {
  /**
   * Parses an expression from the current position.
   *
   * @param context The parsing context containing the current state
   * @param minPrecedence The minimum precedence to parse
   * @return The parsed expression
   */
  parseExpression(
    context: ParsingContext,
    minPrecedence: Precedence
  ): Expression;
}

/**
 * ⚡ InfixExpressionParser - Expression Combiner Interface ⚡
 *
 * Interface for parsers that handle operators and combinators that appear
 * between expressions. These are the "expression combiners" that take a
 * left expression and combine it with something on the right! 🔗
 *
 * Examples:
 * - ArithmeticParser handles +, -, *, / between expressions
 * - ComparisonParser handles ==, !=, <, > between expressions
 * - CallExpressionParser handles function calls: func(args)
 * - IndexExpressionParser handles array access: array[index]
 * - AssignmentParser handles variable assignment: x = value
 */
export interface InfixExpressionParser {
  /**
   * ⚡ Parses an infix expression with a left operand
   */
  parseInfix(context: ParsingContext, left: Expression): Expression;

  /**
   * 🔍 Gets the token types this parser can handle as infix operators
   */
  getHandledTokenTypes(): Set<TokenType>;
}

/**
 * 🎯 PrefixExpressionParser - Expression Starter Interface 🎯
 *
 * Interface for parsers that handle expressions starting with specific tokens.
 * Think of these as "expression beginners" - they know how to start parsing
 * when they see their trigger token! 🚀
 *
 * Examples:
 * - IdentifierParser starts when it sees IDENTIFIER tokens
 * - IntegerParser starts when it sees INT tokens
 * - PrefixOperatorParser starts when it sees MINUS or BANG tokens
 * - GroupedExpressionParser starts when it sees LPAREN tokens
 */
export interface PrefixExpressionParser {
  /**
   * 🎯 Parses an expression that starts with a specific token type
   */
  parsePrefix(context: ParsingContext): Expression;

  /**
   * 🔍 Gets the token types this parser can handle as prefix
   */
  getHandledTokenTypes(): Set<TokenType>;
}
