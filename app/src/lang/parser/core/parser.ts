import { ParsingContext } from "./parsing-context";
import { Statement, Node, Expression } from "@/lang/ast/ast";
import { Precedence } from "./precedence";
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
