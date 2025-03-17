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

// Color mapping for different token types
const getTokenColor = (type: TokenType): string => {
  const colorMap: Partial<Record<TokenType, string>> = {
    [TokenType.IDENTIFIER]:
      "text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-blue-300",
    [TokenType.INT]:
      "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-300",
    [TokenType.STRING]:
      "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300",

    // Keywords
    [TokenType.FUNCTION]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.LET]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.CONST]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.IF]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.ELSE]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.RETURN]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.WHILE]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.FOR]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.BREAK]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",
    [TokenType.CONTINUE]:
      "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-300",

    // Boolean literals
    [TokenType.TRUE]:
      "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300",
    [TokenType.FALSE]:
      "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300",
    [TokenType.NULL]:
      "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300",

    // Operators
    [TokenType.ASSIGN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.PLUS]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.MINUS]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.BANG]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.ASTERISK]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.SLASH]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.EQ]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.NOT_EQ]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.PLUS_ASSIGN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.MINUS_ASSIGN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.ASTERISK_ASSIGN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.SLASH_ASSIGN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",

    // Comparisons
    [TokenType.LESS_THAN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.GREATER_THAN]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",

    // Logical operators
    [TokenType.AND]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
    [TokenType.OR]:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",

    // Punctuation
    [TokenType.COMMA]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.SEMICOLON]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.COLON]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.LPAREN]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.RPAREN]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.LBRACE]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.RBRACE]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.LBRACKET]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    [TokenType.RBRACKET]:
      "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",

    // Special
    [TokenType.EOF]:
      "text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-500",
    [TokenType.ILLEGAL]:
      "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300",
  };

  return (
    colorMap[type] ||
    "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
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
        className="text-sm font-mono whitespace-pre-wrap overflow-x-auto p-2 border-l-2 border-gray-200 dark:border-gray-700 mb-1"
      >
        <span className="text-gray-400 mr-4 select-none">{lineNum}</span>
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
    <Card className="w-full shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Token Analysis</CardTitle>
        <CardDescription>
          Visualized token stream from lexical analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Source code visualization */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Source Code Tokenization</h3>
          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
            {lineVisualizations.length > 0 ? (
              lineVisualizations
            ) : (
              <p className="text-gray-500 italic">No tokens to display</p>
            )}
          </div>
        </div>

        {/* Token tables by line */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Detailed Token Analysis</h3>

          {lineNumbers.map((lineNum) => (
            <Collapsible key={`line-table-${lineNum}`} className="mb-4">
              <CollapsibleTrigger className="flex items-center w-full p-3 text-left font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    <span>Line {lineNum}</span>
                    <Badge variant="outline" className="ml-2 font-mono">
                      {tokensByLine[lineNum].length} tokens
                    </Badge>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Position</TableHead>
                      <TableHead className="w-[150px]">Category</TableHead>
                      <TableHead className="w-[150px]">Type</TableHead>
                      <TableHead>Literal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokensByLine[lineNum].map((token, idx) => (
                      <TableRow key={`token-detail-${lineNum}-${idx}`}>
                        <TableCell className="font-mono">
                          Col {token.position.column}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
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
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono">
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
