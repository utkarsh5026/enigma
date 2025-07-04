import Lexer from "./lexer";

/**
 * 💬 **CommentHandler - The Comment Ninja**
 *
 * This specialized class is like a skilled ninja that silently removes all comments
 * from your code while keeping everything else intact! 🥷✨
 *
 * **Overall Flow**: Code with Comments → Comment Detection → Ninja Removal → Clean Code 🎯
 */
export class CommentHandler {
  /**
   * 🚀 **Constructor - Ninja Initialization**
   *
   * Creates a new comment handler and gives it access to the lexer's powers!
   *
   * **Flow Chart**:
   * ```
   * Lexer Instance → Store reference → Ready to hunt comments! ✅
   * ```
   *
   * @param lexer 🔍 The lexer that this handler will work with
   */
  constructor(private lexer: Lexer) {}

  /**
   * 🎯 **Skip Comments - The Master Comment Eliminator**
   *
   * The main method that finds and skips ALL types of comments in a continuous loop.
   * Like a vacuum cleaner for code comments! 🧹
   *
   * **Flow Chart**:
   * ```
   * Start → Skip whitespace → Check current position
   *   ↓
   * Found //? → Yes: Skip single-line comment → Continue loop
   *   ↓
   * Found /*? → Yes: Skip multi-line comment → Continue loop
   *   ↓
   * Neither? → No more comments → Exit loop ✅
   * ```
   */
  public skipComments(): void {
    while (true) {
      this.lexer.skipWhitespace();

      if (this.lexer.getCurrCh() === "/" && this.lexer.peekChar() === "/")
        this.skipSingleLineComment();
      else if (this.lexer.getCurrCh() === "/" && this.lexer.peekChar() === "*")
        this.skipMultiLineComment();
      else break;
    }
  }

  /**
   * 💭 **Single Line Comment Skipper - Line Hopper**
   *
   * Skips everything after // until it hits a newline or end of file.
   * Like fast-forwarding through a single line of chatter! ⏭️
   *
   * **Flow Chart**:
   * ```
   * Found // → Read characters → Is newline (\n)? → Yes: Stop skipping
   *         → Is end of file (\0)? → Yes: Stop skipping
   *         → Neither? → Keep reading → Repeat ✅
   * ```
   */
  private skipSingleLineComment(): void {
    while (this.lexer.getCurrCh() !== "\n" && this.lexer.getCurrCh() !== "\0") {
      this.lexer.readCurrChar();
    }
  }

  /**
   * 📚 **Multi-Line Comment Skipper - Block Jumper**
   *
   * Handles block comments with smart nesting support! Can handle comments
   * inside comments like a Russian nesting doll! 🪆
   *
   * **Flow Chart**:
   * ```
   * Found block start → Skip opening → Set depth = 1 → Read characters
   *   ↓
   * Found opening? → Increase depth (nested comment!)
   *   ↓
   * Found closing? → Decrease depth (closing comment)
   *   ↓
   * Depth = 0? → Yes: All comments closed → Done ✅
   *   ↓
   * End of file? → Yes: Done (even if unclosed)
   *   ↓
   * Neither? → Keep reading → Repeat
   * ```
   */
  private skipMultiLineComment(): void {
    this.lexer.readCurrChar(); // skip the first '/'
    this.lexer.readCurrChar(); // skip the '*'
    let depth = 1;

    while (depth > 0 && this.lexer.getCurrCh() !== "\0") {
      if (this.lexer.getCurrCh() === "/" && this.lexer.peekChar() === "*") {
        depth++;
        this.lexer.readCurrChar();
        this.lexer.readCurrChar();
      } else if (
        this.lexer.getCurrCh() === "*" &&
        this.lexer.peekChar() === "/"
      ) {
        depth--;
        this.lexer.readCurrChar();
        this.lexer.readCurrChar();
      } else {
        this.lexer.readCurrChar();
      }
    }
  }
}
