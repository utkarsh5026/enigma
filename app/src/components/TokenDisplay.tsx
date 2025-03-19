import React from "react";
import { Token, TokenType } from "../lang/token/token";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Color mapping for different token types using Tokyo Night colors
const getTokenColor = (type: TokenType): string => {
  const colorMap: Partial<Record<TokenType, string>> = {
    [TokenType.IDENTIFIER]:
      "text-tokyo-blue bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.INT]:
      "text-tokyo-orange bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.STRING]:
      "text-tokyo-green bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Keywords
    [TokenType.FUNCTION]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.LET]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.CONST]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.IF]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.ELSE]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.RETURN]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.WHILE]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.FOR]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.BREAK]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.CONTINUE]:
      "text-tokyo-purple bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Boolean literals
    [TokenType.TRUE]:
      "text-tokyo-red bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.FALSE]:
      "text-tokyo-red bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.NULL]:
      "text-tokyo-red bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Operators
    [TokenType.ASSIGN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.PLUS]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.MINUS]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.BANG]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.ASTERISK]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.SLASH]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.EQ]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.NOT_EQ]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.PLUS_ASSIGN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.MINUS_ASSIGN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.ASTERISK_ASSIGN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.SLASH_ASSIGN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Comparisons
    [TokenType.LESS_THAN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.GREATER_THAN]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Logical operators
    [TokenType.AND]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
    [TokenType.OR]:
      "text-tokyo-cyan bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",

    // Punctuation
    [TokenType.COMMA]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.SEMICOLON]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.COLON]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.LPAREN]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.RPAREN]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.LBRACE]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.RBRACE]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.LBRACKET]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.RBRACKET]:
      "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",

    // Special
    [TokenType.EOF]:
      "text-tokyo-comment bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20",
    [TokenType.ILLEGAL]:
      "text-tokyo-red bg-tokyo-bg-highlight/50 dark:bg-tokyo-bg-highlight/30",
  };

  return (
    colorMap[type] ||
    "text-tokyo-fg-dark bg-tokyo-bg-highlight/30 dark:bg-tokyo-bg-highlight/20"
  );
};

// Group tokens into categories for better organization
const tokenCategories = {
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

// Get category for a token type
const getTokenCategory = (type: TokenType): string => {
  for (const [category, types] of Object.entries(tokenCategories)) {
    if (types.includes(type)) {
      return category;
    }
  }
  return "Other";
};

interface TokenDisplayProps {
  tokens: Token[];
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens }) => {
  // Group tokens by line
  const tokensByLine = tokens.reduce<Record<number, Token[]>>((acc, token) => {
    const { line } = token.position;
    if (!acc[line]) {
      acc[line] = [];
    }
    acc[line].push(token);
    return acc;
  }, {});

  // Get an array of line numbers
  const lineNumbers = Object.keys(tokensByLine)
    .map(Number)
    .sort((a, b) => a - b);

  // Visualize the source code by line
  const lineVisualizations = lineNumbers.map((lineNum) => {
    const lineTokens = tokensByLine[lineNum];
    // Sort tokens by column to ensure they appear in order
    lineTokens.sort((a, b) => a.position.column - b.position.column);

    return (
      <pre
        key={`line-${lineNum}`}
        className="text-sm font-mono whitespace-pre-wrap overflow-x-auto p-2 border-l-2 border-tokyo-bg-highlight mb-1"
      >
        <span className="text-tokyo-comment mr-4 select-none">{lineNum}</span>
        {lineTokens.map((token, idx) => (
          <span
            key={`token-${lineNum}-${idx}`}
            className={cn(
              "rounded px-1 py-0.5 mr-0.5",
              getTokenColor(token.type)
            )}
            title={`${token.type} at position ${token.position.column}`}
          >
            {token.literal || " "}
          </span>
        ))}
      </pre>
    );
  });

  return (
    <Card className="w-full shadow-lg border-tokyo-bg-highlight bg-tokyo-bg dark:bg-tokyo-bg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-tokyo-fg">
          Token Analysis
        </CardTitle>
        <CardDescription className="text-tokyo-fg-dark">
          Visualized token stream from lexical analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Source code visualization */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-tokyo-fg">
            Source Code Tokenization
          </h3>
          <div className="bg-tokyo-bg-dark rounded-lg p-4">
            {lineVisualizations.length > 0 ? (
              lineVisualizations
            ) : (
              <p className="text-tokyo-comment italic">No tokens to display</p>
            )}
          </div>
        </div>

        {/* Token tables by line */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-tokyo-fg">
            Detailed Token Analysis
          </h3>

          {lineNumbers.map((lineNum) => (
            <Collapsible key={`line-table-${lineNum}`} className="mb-4">
              <CollapsibleTrigger className="flex items-center w-full p-3 text-left font-medium bg-tokyo-bg-dark rounded-lg hover:bg-tokyo-bg-highlight transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90 text-tokyo-fg" />
                    <span className="text-tokyo-fg">Line {lineNum}</span>
                    <Badge
                      variant="outline"
                      className="ml-2 font-mono bg-tokyo-bg-highlight text-tokyo-fg"
                    >
                      {tokensByLine[lineNum].length} tokens
                    </Badge>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-2">
                <Table>
                  <TableHeader>
                    <TableRow className="border-tokyo-bg-highlight hover:bg-tokyo-bg-highlight/50">
                      <TableHead className="w-[100px] text-tokyo-fg">
                        Position
                      </TableHead>
                      <TableHead className="w-[150px] text-tokyo-fg">
                        Category
                      </TableHead>
                      <TableHead className="w-[150px] text-tokyo-fg">
                        Type
                      </TableHead>
                      <TableHead className="text-tokyo-fg">Literal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokensByLine[lineNum].map((token, idx) => (
                      <TableRow
                        key={`token-detail-${lineNum}-${idx}`}
                        className="border-tokyo-bg-highlight hover:bg-tokyo-bg-highlight/50"
                      >
                        <TableCell className="font-mono text-tokyo-fg">
                          Col {token.position.column}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-normal bg-tokyo-bg text-tokyo-fg"
                          >
                            {getTokenCategory(token.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "font-mono",
                              getTokenColor(token.type)
                            )}
                          >
                            {token.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-tokyo-bg-highlight rounded font-mono text-tokyo-fg">
                            {token.literal || "<empty>"}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDisplay;
