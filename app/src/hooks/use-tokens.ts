import { useCallback, useEffect, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Token, TokenType } from "@/lang/token/token";

export const useTokens = (code: string) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const getTokens = useCallback(() => {
    try {
      const lexer = new Lexer(code);
      const newTokens: Token[] = [];
      let token = lexer.nextToken();
      while (token.type !== TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }
      setTokens(newTokens);
    } catch (error) {
      console.error("Error getting tokens:", error);
    }
  }, [code]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  return { tokens };
};
