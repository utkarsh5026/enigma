import { TokenType } from "@/lang/token/token";
import { Info, Hash, Terminal, Code } from "lucide-react";

export const tokenCategories = {
  Keywords: [
    TokenType.FUNCTION,
    TokenType.LET,
    TokenType.CONST,
    TokenType.IF,
    TokenType.ELSE,
    TokenType.RETURN,
    TokenType.WHILE,
    TokenType.FOR,
    TokenType.BREAK,
    TokenType.CONTINUE,
    TokenType.ELIF,
    TokenType.CLASS,
    TokenType.EXTENDS,
    TokenType.SUPER,
    TokenType.THIS,
    TokenType.NEW,
  ],
  Literals: [
    TokenType.INT,
    TokenType.STRING,
    TokenType.TRUE,
    TokenType.FALSE,
    TokenType.NULL,
  ],
  Identifiers: [TokenType.IDENTIFIER],
  Operators: [
    TokenType.ASSIGN,
    TokenType.PLUS,
    TokenType.MINUS,
    TokenType.BANG,
    TokenType.ASTERISK,
    TokenType.SLASH,
    TokenType.MODULUS,
    TokenType.EQ,
    TokenType.NOT_EQ,
    TokenType.LESS_THAN,
    TokenType.GREATER_THAN,
    TokenType.PLUS_ASSIGN,
    TokenType.MINUS_ASSIGN,
    TokenType.ASTERISK_ASSIGN,
    TokenType.SLASH_ASSIGN,
    TokenType.AND,
    TokenType.OR,
    TokenType.BITWISE_AND,
    TokenType.BITWISE_OR,
    TokenType.BITWISE_XOR,
    TokenType.BITWISE_NOT,
    TokenType.BITWISE_LEFT_SHIFT,
    TokenType.BITWISE_RIGHT_SHIFT,
    TokenType.LESS_THAN_OR_EQUAL,
    TokenType.GREATER_THAN_OR_EQUAL,
    TokenType.INTEGER_DIVISION,
  ],
  Punctuation: [
    TokenType.COMMA,
    TokenType.SEMICOLON,
    TokenType.COLON,
    TokenType.DOT,
    TokenType.LPAREN,
    TokenType.RPAREN,
    TokenType.LBRACE,
    TokenType.RBRACE,
    TokenType.LBRACKET,
    TokenType.RBRACKET,
  ],
  Special: [TokenType.EOF, TokenType.ILLEGAL],
};

export const getTokenColor = (type: TokenType): string => {
  const colorMap: Partial<Record<TokenType, string>> = {
    // Keywords - Tokyo purple
    [TokenType.FUNCTION]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.LET]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.CONST]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.IF]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.ELSE]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.RETURN]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.WHILE]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.FOR]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.BREAK]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.CONTINUE]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.ELIF]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.CLASS]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.EXTENDS]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.SUPER]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.THIS]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",
    [TokenType.NEW]:
      "bg-purple-100 text-purple-800 dark:bg-[var(--color-tokyo-purple)]/20 dark:text-[var(--color-tokyo-purple)]",

    // Identifiers - Tokyo blue
    [TokenType.IDENTIFIER]:
      "bg-blue-100 text-blue-800 dark:bg-[var(--color-tokyo-blue)]/20 dark:text-[var(--color-tokyo-blue)]",

    // Literals - Tokyo theme colors
    [TokenType.INT]:
      "bg-amber-100 text-amber-800 dark:bg-[var(--color-tokyo-orange)]/20 dark:text-[var(--color-tokyo-orange)]",
    [TokenType.STRING]:
      "bg-green-100 text-green-800 dark:bg-[var(--color-tokyo-green)]/20 dark:text-[var(--color-tokyo-green)]",
    [TokenType.TRUE]:
      "bg-red-100 text-red-800 dark:bg-[var(--color-tokyo-red)]/20 dark:text-[var(--color-tokyo-red)]",
    [TokenType.FALSE]:
      "bg-red-100 text-red-800 dark:bg-[var(--color-tokyo-red)]/20 dark:text-[var(--color-tokyo-red)]",
    [TokenType.NULL]:
      "bg-gray-100 text-gray-800 dark:bg-[var(--color-tokyo-comment)]/20 dark:text-[var(--color-tokyo-comment)]",

    // Operators - Tokyo cyan
    [TokenType.INTEGER_DIVISION]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.PLUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.MINUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BANG]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.ASTERISK]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.SLASH]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.MODULUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.EQ]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.NOT_EQ]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.LESS_THAN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.GREATER_THAN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.PLUS_ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.MINUS_ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.ASTERISK_ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.SLASH_ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.AND]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.OR]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_AND]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_OR]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_XOR]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_NOT]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_LEFT_SHIFT]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.BITWISE_RIGHT_SHIFT]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.LESS_THAN_OR_EQUAL]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",
    [TokenType.GREATER_THAN_OR_EQUAL]:
      "bg-cyan-100 text-cyan-800 dark:bg-[var(--color-tokyo-cyan)]/20 dark:text-[var(--color-tokyo-cyan)]",

    // Punctuation - Tokyo comment color (subtle)
    [TokenType.COMMA]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.SEMICOLON]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.COLON]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.DOT]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.LPAREN]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.RPAREN]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.LBRACE]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.RBRACE]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.LBRACKET]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.RBRACKET]:
      "bg-gray-100 text-gray-700 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]",

    // Special cases
    [TokenType.EOF]:
      "bg-gray-100 text-gray-500 dark:bg-[var(--color-tokyo-comment)]/10 dark:text-[var(--color-tokyo-comment)]",
    [TokenType.ILLEGAL]:
      "bg-red-100 text-red-800 dark:bg-[var(--color-tokyo-red)]/20 dark:text-[var(--color-tokyo-red)]",
  };

  return (
    colorMap[type] ||
    "bg-gray-100 text-gray-800 dark:bg-[var(--color-tokyo-comment)]/15 dark:text-[var(--color-tokyo-comment)]"
  );
};

export const getTokenCategory = (type: TokenType): string => {
  for (const [category, types] of Object.entries(tokenCategories)) {
    if (types.includes(type)) {
      return category;
    }
  }
  return "Other";
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Keywords":
      return <Terminal size={16} className="mr-1" />;
    case "Literals":
      return <Hash size={16} className="mr-1" />;
    case "Identifiers":
      return <Info size={16} className="mr-1" />;
    case "Operators":
      return <Code size={16} className="mr-1" />;
    default:
      return null;
  }
};
