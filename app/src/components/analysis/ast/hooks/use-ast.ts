import { useProgram } from "@/hooks/use-program";
import { useState, useCallback } from "react";

export const useAst = (code: string) => {
  const { program, parserErrors, parse } = useProgram(code);
  const [isParsing, setIsParsing] = useState(false);
  const [hasBeenParsed, setHasBeenParsed] = useState(false);

  const parseWithState = useCallback(async () => {
    if (!code?.trim()) {
      return;
    }

    setIsParsing(true);
    try {
      // Add small delay to show loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 100));
      parse();
      setHasBeenParsed(true);
    } finally {
      setIsParsing(false);
    }
  }, [code, parse]);

  return {
    program,
    parserErrors,
    parse: parseWithState,
    isParsing,
    hasBeenParsed,
    canParse: !!code?.trim(),
  };
};
