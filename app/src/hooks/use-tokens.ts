import { useCallback, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Token, TokenType } from "@/lang/token/token";

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTokenizedCode, setLastTokenizedCode] = useState<string>("");

  const tokenize = useCallback(async (code: string) => {
    if (!code.trim()) {
      setTokens([]);
      setLastTokenizedCode("");
      setError(null);
      return;
    }

    setIsTokenizing(true);
    setError(null);

    try {
      // Add a small delay to show loading state for user feedback
      await new Promise((resolve) => setTimeout(resolve, 100));

      const lexer = new Lexer(code);
      const newTokens: Token[] = [];
      let token = lexer.nextToken();

      while (token.type !== TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }

      setTokens(newTokens);
      setLastTokenizedCode(code);
    } catch (error) {
      console.error("Error tokenizing code:", error);
      setError(
        error instanceof Error ? error.message : "Unknown tokenization error"
      );
      setTokens([]);
    } finally {
      setIsTokenizing(false);
    }
  }, []);

  const clearTokens = useCallback(() => {
    setTokens([]);
    setLastTokenizedCode("");
    setError(null);
  }, []);

  const hasTokens = tokens.length > 0;
  const isCodeChanged = (code: string) => code !== lastTokenizedCode;

  return {
    tokens,
    isTokenizing,
    error,
    hasTokens,
    lastTokenizedCode,
    tokenize,
    clearTokens,
    isCodeChanged,
  };
};
