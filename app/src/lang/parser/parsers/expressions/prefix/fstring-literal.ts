import {
  PrefixExpressionParser,
  ParsingContext,
  ParserException,
} from "@/lang/parser/core";
import { Token, TokenType } from "@/lang/token/token";
import { FStringLiteral, Expression } from "@/lang/ast";
import Lexer from "@/lang/lexer/lexer";
import { LanguageParser } from "@/lang/parser/parser";

/**
 * 🎯 FStringLiteralParser - F-String Parsing Specialist 🎯
 *
 * Handles f-string literal expressions that contain both static text and
 * embedded expressions.
 *
 * From first principles, f-strings work like this:
 * 1. Static text is preserved as-is
 * 2. Expressions in {braces} are parsed as normal expressions
 * 3. At evaluation time, expressions are computed and interpolated
 *
 * Examples:
 * - f"Hello {name}!" → static=["Hello ", "!"], expressions=[name]
 * - f"{x} + {y} = {x + y}" → static=["", " + ", " = ", ""], expressions=[x, y,
 * x+y]
 *
 * Parsing Strategy:
 * 1. Scan through f-string content character by character
 * 2. Build static text until we hit '{'
 * 3. Parse the expression inside braces
 * 4. Continue until end of string
 * 5. Construct FStringLiteral with alternating static/expression parts
 */
export class FStringLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext) {
    const fStringToken = context.consumeCurrentToken(
      TokenType.F_STRING,
      'f-string should start with f"'
    );
    const content = fStringToken.literal;

    // Parse the f-string content to separate static parts from expressions
    const result = this.parseFStringContent(content, context);
    return new FStringLiteral(
      fStringToken,
      result.staticParts,
      result.expressions,
      fStringToken
    );
  }

  /**
   * 🔍 Parses f-string content into static parts and expressions
   */
  private parseFStringContent(content: string, context: ParsingContext) {
    const staticParts: string[] = [];
    const expressions: Expression[] = [];

    let currentStatic = "";
    let pos = 0;

    while (pos < content.length) {
      const ch = content[pos];

      if (ch == "{") {
        staticParts.push(currentStatic);
        currentStatic = "";

        // Parse the expression inside braces
        const exprResult = this.parseExpressionInBraces(
          content,
          pos + 1,
          context
        );
        expressions.push(exprResult.expression);
        pos = exprResult.endPosition;
      } else if (ch == "}") {
        // Unmatched closing brace
        throw new ParserException(
          "Unmatched '}' in f-string",
          context.getCurrentToken()
        );
      } else {
        // Regular character - add to current static part
        currentStatic += ch;
        pos++;
      }
    }

    // Add the final static part (might be empty)
    staticParts.push(currentStatic);

    return {
      staticParts,
      expressions,
    };
  }

  /**
   * ⚡ Parses an expression inside braces: {expression}
   *
   * This is complex because expressions can contain:
   * - Nested braces: {array[{index}]}
   * - String literals with braces: {f"hello {name}"}
   * - Function calls: {func(x, y)}
   *
   * We need to track brace depth and string context to find the matching '}'.
   *
   * @param content  The full f-string content
   * @param startPos Position after the opening '{'
   * @param context  Parsing context
   * @return Parsed expression and position after closing '}'
   */
  private parseExpressionInBraces(
    content: string,
    startPos: number,
    context: ParsingContext
  ) {
    // Find the matching closing brace
    let braceDepth = 1;
    let pos = startPos;
    let inString = false;
    let inChar = false;
    let escaped = false;

    while (pos < content.length && braceDepth > 0) {
      const ch = content[pos];

      if (escaped) {
        escaped = false;
        pos++;
        continue;
      }

      if (ch == "\\") {
        escaped = true;
        pos++;
        continue;
      }

      if (!inString && !inChar) {
        if (ch == '"') {
          inString = true;
        } else if (ch == "'") {
          inChar = true;
        } else if (ch == "{") {
          braceDepth++;
        } else if (ch == "}") {
          braceDepth--;
        }
      } else if (inString && ch == '"') {
        inString = false;
      } else if (inChar && ch == "'") {
        inChar = false;
      }

      pos++;
    }

    if (braceDepth > 0) {
      throw new ParserException(
        "Unclosed '{' in f-string expression",
        context.getCurrentToken()
      );
    }

    // Extract the expression text
    const expressionText = content.substring(startPos, pos - 1);

    if (expressionText.trim() === "") {
      throw new ParserException(
        "Empty expression in f-string",
        context.getCurrentToken()
      );
    }

    // Calculate the position within the f-string where this expression starts
    const fStringToken = context.getCurrentToken();
    const expressionStartPos = this.calculateExpressionPosition(
      content,
      startPos,
      fStringToken
    );

    // Parse the expression using a new parser instance with correct positioning
    const expression = this.parseExpressionFromString(
      expressionText.trim(),
      expressionStartPos.line,
      expressionStartPos.column
    );

    return {
      expression,
      endPosition: pos,
    };
  }

  /**
   * 📍 Calculates the absolute position of an expression within the f-string
   *
   * @param content The full f-string content
   * @param expressionStart The character position where the expression starts
   * @param fStringToken The original f-string token
   * @returns The calculated line and column position
   */
  private calculateExpressionPosition(
    content: string,
    expressionStart: number,
    fStringToken: Token
  ) {
    let { line, column } = fStringToken.start();

    // Count newlines and calculate column position up to the expression start
    for (let i = 0; i < expressionStart; i++) {
      if (content[i] === "\n") {
        line++;
        column = 0;
      } else {
        column++;
      }
    }

    // Add 1 more for the opening brace '{'
    column++;

    return { line, column };
  }

  /**
   * 🔧 Parses an expression from a string
   *
   * Creates a temporary lexer and parser to parse the expression text.
   * This is necessary because the expression might be complex (function calls,
   * etc.)
   *
   * @param expressionText The expression text to parse
   * @param startLine The line where the expression starts (relative to f-string)
   * @param startColumn The column where the expression starts (relative to f-string)
   * @return Parsed expression
   */
  private parseExpressionFromString(
    expressionText: string,
    startLine?: number,
    startColumn?: number
  ) {
    try {
      const lexer = new Lexer(expressionText, startLine, startColumn);
      const parser = new LanguageParser(lexer);
      const expression = parser.parseExpression();

      if (parser.hasErrors()) {
        throw new ParserException(
          "Invalid expression in f-string: " + expressionText
        );
      }

      return expression;
    } catch {
      throw new ParserException(
        "Failed to parse expression in f-string: " + expressionText
      );
    }
  }

  public getHandledTokenTypes() {
    return new Set([TokenType.F_STRING]);
  }
}
