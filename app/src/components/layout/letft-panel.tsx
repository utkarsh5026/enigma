import React, { useState } from "react";
import { FileCode, Play, Copy, Download, Loader2, Check } from "lucide-react";
import EditorToolbarButton from "./toolbar-button";
import EnigmaEditor from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";
import { consoleStore } from "@/stores/console-stores";
import Lexer from "@/lang/lexer/lexer";
import { LanguageParser } from "@/lang/parser";
import { LanguageEvaluator } from "@/lang/exec/evaluation/evaluator";
import { Button } from "@/components/ui/button";
import { ObjectValidator, Environment } from "@/lang/exec/core";

interface LeftPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

/**
 * LeftPanel Component with Integrated Console
 *
 * This component now includes a VS Code-style console at the bottom
 * that appears when the run button is clicked.
 */
const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
}) => {
  const { isMobile } = useMobile();
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleRunCode = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionSuccess(false);

    try {
      // Clear console first
      consoleStore.clear();

      // Add a small delay to show loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 100));

      const lexer = new Lexer(code);
      const parser = new LanguageParser(lexer);
      const ast = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        parser.getErrors().forEach((error) => {
          consoleStore.addEntry(error.message, "error");
        });
      }

      const evaluator = LanguageEvaluator.withSourceCode(code, true);
      const result = evaluator.evaluateProgram(ast, new Environment());

      if (!ObjectValidator.isError(result)) {
        consoleStore.addEntry(
          "Code executed successfully with exit code 0 😎",
          "success"
        );
        setExecutionSuccess(true);
        setTimeout(() => setExecutionSuccess(false), 2000);
      } else {
        consoleStore.addEntry(result.inspect(), "error");
      }

      setActiveTab("execution");
    } catch (error) {
      consoleStore.addEntry(
        `Execution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = async () => {
    if (copySuccess) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enigma-code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 bg-[var(--tokyo-bg)]">
        {!isMobile && (
          <div className="flex px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <FileCode
                size={16}
                className="text-[var(--tokyo-purple)] sm:size-4"
              />
              <span className="font-medium truncate">main.enigma</span>
            </div>
          </div>
        )}

        {/* Toolbar buttons */}
        <div className="flex items-center justify-center sm:justify-end sm:ml-auto px-3 pb-2 sm:px-2 sm:pb-0">
          <div className="flex items-center gap-1 sm:gap-0">
            <Button
              onClick={handleRunCode}
              disabled={isExecuting}
              className={`
                min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]
                ${
                  executionSuccess
                    ? "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]"
                    : "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]/80"
                }
                text-[var(--tokyo-bg)] hover:text-[var(--tokyo-bg)]
                rounded-lg transition-all duration-200
                flex items-center justify-center
                shadow-lg hover:shadow-xl
                border border-[var(--tokyo-green)]/20
                active:scale-95
                group cursor-pointer
                disabled:opacity-70 disabled:cursor-not-allowed
                disabled:active:scale-100 disabled:hover:shadow-lg
                ${isExecuting ? "animate-pulse" : ""}
              `}
              title={isExecuting ? "Executing..." : "Run Code"}
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : executionSuccess ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5 animate-in zoom-in-50 duration-200" />
              ) : (
                <Play className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </Button>

            {!isMobile && (
              <>
                <EditorToolbarButton
                  icon={
                    copySuccess ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--tokyo-green)] animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    )
                  }
                  tooltip={copySuccess ? "Copied!" : "Copy Code"}
                  onClick={handleCopyCode}
                  disabled={isExecuting || copySuccess}
                  className={`
                min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]
                transition-all duration-200
                ${
                  copySuccess
                    ? "bg-[var(--tokyo-green)]/10 border-[var(--tokyo-green)]/20"
                    : ""
                }
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
                />

                <EditorToolbarButton
                  icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
                  tooltip="Download Code"
                  onClick={handleDownloadCode}
                  disabled={isExecuting}
                  className={`
                min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]
                transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed
                `}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editor and Console Area */}
      <div className="flex-1 overflow-hidden">
        <EnigmaEditor code={code} onCodeChange={onCodeChange} />
      </div>
    </div>
  );
};

export default LeftPanel;
