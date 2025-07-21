import { useCallback, useState } from "react";
import { consoleStore } from "@/stores/console-stores";
import { LanguageParser } from "@/lang/parser";
import Lexer from "@/lang/lexer/lexer";
import { LanguageEvaluator } from "@/lang/exec/evaluation/evaluator";
import { Environment, ObjectValidator } from "@/lang/exec/core";

interface UseCodeExecutionProps {
  code: string;
  setActiveTab: (tab: string) => void;
  beforeExecution: () => void;
}

/**
 * 🎮 A custom hook that handles code execution logic
 *
 * 🔄 Manages the execution state and provides feedback
 *
 * 🚀 Takes care of:
 * - Running the code through lexer and parser
 * - Evaluating the parsed code
 * - Handling errors and success states
 * - Managing console output
 *
 * 💡 Shows execution status with visual feedback
 * ⏳ Prevents multiple simultaneous executions
 * 📝 Automatically switches to output tab when done
 */
export const useCodeExecution = ({
  code,
  setActiveTab,
  beforeExecution,
}: UseCodeExecutionProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  const handleRunCode = useCallback(async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionSuccess(false);
    beforeExecution();

    try {
      consoleStore.clear();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const lexer = new Lexer(code);
      const parser = new LanguageParser(lexer);
      const ast = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        parser.getErrors().forEach((error) => {
          consoleStore.addEntry(error.message, "error");
        });
        setActiveTab("output");
        return;
      }

      const evaluator = LanguageEvaluator.withSourceCode(code, true);
      const result = evaluator.evaluateProgram(ast, new Environment());

      if (!ObjectValidator.isError(result)) {
        consoleStore.addEntry("✅ Code executed successfully", "success");
        setExecutionSuccess(true);
        setTimeout(() => setExecutionSuccess(false), 2000);
      } else {
        consoleStore.addEntry(result.inspect(), "error");
      }

      setActiveTab("output");
    } catch (error) {
      consoleStore.addEntry(
        `❌ Execution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      setActiveTab("output");
    } finally {
      setIsExecuting(false);
    }
  }, [code, setActiveTab, beforeExecution, isExecuting]);

  return {
    isExecuting,
    executionSuccess,
    handleRunCode,
  };
};
