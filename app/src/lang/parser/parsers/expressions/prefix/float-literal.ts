import {
  PrefixExpressionParser,
  ParsingContext,
  ParserException,
} from "@/lang/parser/core";
import { Expression, FloatLiteral } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";

/**
 * 🌊 FloatLiteralParser - Floating-Point Number Parser 🌊
 *
 * Examples of valid float literals:
 * - 3.14159 → creates FloatLiteral(3.14159)
 * - 0.5 → creates FloatLiteral(0.5)
 * - .75 → creates FloatLiteral(0.75)
 * - 2.0 → creates FloatLiteral(2.0)
 * - 1e6 → creates FloatLiteral(1000000.0)
 * - 1.23e-4 → creates FloatLiteral(0.000123)
 *
 * Error cases:
 * - Invalid format: "3.14.15" → Parser error
 * - Out of range: "1e400" → Infinity (handled gracefully)
 * - Malformed: "3." without digits → Should be handled by lexer
 */
export class FloatLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const floatToken = context.consumeCurrentToken(TokenType.FLOAT);

    try {
      const value = this.parseFloatValue(floatToken.literal);
      return new FloatLiteral(floatToken, value);
    } catch (e) {
      throw new ParserException(
        "Invalid float literal: " + floatToken.literal + " - " + e,
        floatToken
      );
    }
  }

  /**
   * 🔢 Parses a float value from string representation
   *
   * From first principles, float parsing needs to handle:
   * - Standard decimal notation: 3.14, 0.5, 2.0
   * - Scientific notation: 1e6, 1.23e-4, 5E+2
   * - Numbers starting with decimal: .5, .123
   * - Numbers ending with decimal: 5., 123.
   * - Special values: Infinity, -Infinity, NaN
   */
  private parseFloatValue(literal: string) {
    if (literal == null || literal.trim().length === 0) {
      throw new Error("Empty float literal");
    }

    let normalized = literal.trim();

    if (normalized.startsWith(".")) {
      normalized = "0" + normalized;
    }

    if (normalized.endsWith(".")) {
      normalized = normalized + "0";
    }

    this.validateFloatFormat(normalized);

    try {
      const value = Number.parseFloat(normalized);

      // Check for special values and provide context
      if (Number.isFinite(value)) {
        // This is actually valid in IEEE 754, but might want to warn
        // For now, we'll allow it as it's mathematically meaningful
        return value;
      }

      if (Number.isNaN(value)) {
        throw new ParserException("Float literal resulted in NaN: " + literal);
      }

      return value;
    } catch (e) {
      throw new ParserException("Invalid float format: " + literal + " - " + e);
    }
  }

  /**
   * ✅ Validates the basic format of a float literal
   */
  private validateFloatFormat(literal: string) {
    if (literal.trim().length === 0) {
      throw new Error("Empty float literal");
    }

    const decimalCount = literal.split(".").length - 1;
    if (decimalCount > 1) {
      throw new ParserException(
        "Multiple decimal points in float literal: " + literal
      );
    }

    if (literal.includes("e") || literal.includes("E")) {
      this.validateScientificNotation(literal);
    }

    const hasDigit = literal
      .split("")
      .some((char) => !Number.isNaN(Number(char)));
    if (!hasDigit) {
      throw new ParserException(
        "Float literal must contain at least one digit: " + literal
      );
    }

    for (const ch of literal) {
      if (
        !Number.isInteger(Number(ch)) &&
        ch != "." &&
        ch != "+" &&
        ch != "-" &&
        ch != "e" &&
        ch != "E"
      ) {
        throw new ParserException("Invalid character in float literal: " + ch);
      }
    }
  }

  /**
   * 🔬 Validates scientific notation format
   *
   * Scientific notation has the form: [digits][.digits][e|E][+|-][digits]
   * Examples: 1e6, 1.23e-4, 5E+2, 1.0e10
   *
   * Rules:
   * - Must have digits before e/E
   * - Can have optional + or - after e/E
   * - Must have digits after e/E (and optional +/-)
   * - Cannot have multiple e/E indicators
   *
   * @param literal The literal containing scientific notation
   * @throws FloatParseException If the scientific notation is malformed
   */
  private validateScientificNotation(literal: string) {
    const eIndex = Math.max(literal.indexOf("e"), literal.indexOf("E"));

    if (eIndex == -1) {
      return; // No scientific notation
    }

    // Check for multiple e/E
    const remaining = literal.substring(eIndex + 1);
    if (remaining.includes("e") || remaining.includes("E")) {
      throw new ParserException(
        "Multiple scientific notation indicators: " + literal
      );
    }

    // Check that there's something before e/E
    if (eIndex == 0) {
      throw new ParserException(
        "Scientific notation must have digits before e/E: " + literal
      );
    }

    // Check that there's something after e/E
    if (eIndex == literal.length - 1) {
      throw new ParserException(
        "Scientific notation must have exponent after e/E: " + literal
      );
    }

    // Validate the exponent part
    const exponentPart = literal.substring(eIndex + 1);
    this.validateExponentPart(exponentPart);
  }

  /**
   * 🔢 Validates the exponent part of scientific notation
   *
   * The exponent part can be:
   * - Just digits: "6" in "1e6"
   * - Plus and digits: "+6" in "1e+6"
   * - Minus and digits: "-4" in "1e-4"
   *
   * @param exponentPart The part after e/E
   * @throws FloatParseException If the exponent format is invalid
   */
  private validateExponentPart(exponentPart: string) {
    if (exponentPart.length === 0) {
      throw new Error("Empty exponent in scientific notation");
    }

    let digits = exponentPart;
    if (digits.startsWith("+") || digits.startsWith("-")) {
      digits = digits.substring(1);
    }

    if (digits.length === 0) {
      throw new ParserException(
        "Exponent must have digits after sign: " + exponentPart
      );
    }

    for (const ch of digits) {
      if (!Number.isInteger(Number(ch))) {
        throw new ParserException("Invalid character in exponent: " + ch);
      }
    }
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.FLOAT]);
  }
}
