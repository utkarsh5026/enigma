import { ParsingContext } from "./parsing-context";
import { Statement, Node } from "@/lang/ast/ast";
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
