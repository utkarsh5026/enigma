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
    // Keywords - subtle purple
    [TokenType.FUNCTION]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.LET]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.CONST]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.IF]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.ELSE]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.RETURN]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.WHILE]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.FOR]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.BREAK]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.CONTINUE]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.ELIF]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    [TokenType.CLASS]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",

    // Identifiers - subtle blue
    [TokenType.IDENTIFIER]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",

    // Literals - subtle variations
    [TokenType.INT]:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    [TokenType.STRING]:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    [TokenType.TRUE]:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    [TokenType.FALSE]:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    [TokenType.NULL]:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",

    // Operators - subtle cyan
    [TokenType.ASSIGN]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.PLUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.MINUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.BANG]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.ASTERISK]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.SLASH]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.MODULUS]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.EQ]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    [TokenType.NOT_EQ]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",

    // Punctuation - very subtle gray
    [TokenType.COMMA]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.SEMICOLON]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.COLON]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.DOT]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.LPAREN]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.RPAREN]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.LBRACE]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.RBRACE]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.LBRACKET]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",
    [TokenType.RBRACKET]:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400",

    // Special cases
    [TokenType.EOF]:
      "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-500",
    [TokenType.ILLEGAL]:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    colorMap[type] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
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
