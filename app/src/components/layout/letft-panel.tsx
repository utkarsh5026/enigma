import React, { useState } from "react";
import {
  FileCode,
  Play,
  Copy,
  Download,
  Loader2,
  Check,
  MoreHorizontal,
} from "lucide-react";
import EditorToolbarButton from "./toolbar-button";
import EnigmaEditor from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";
import { consoleStore } from "@/stores/console-stores";
import Lexer from "@/lang/lexer/lexer";
import { LanguageParser } from "@/lang/parser";
import { LanguageEvaluator } from "@/lang/exec/evaluation/evaluator";
import { Button } from "@/components/ui/button";
import { ObjectValidator, Environment } from "@/lang/exec/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      {/* Header - Mobile Optimized */}
      <div className="border-b bg-[var(--tokyo-bg)] flex-shrink-0">
        {!isMobile && (
          <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
            {/* File Info - Always visible but responsive */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FileCode
                size={isMobile ? 14 : 16}
                className="text-[var(--tokyo-purple)] flex-shrink-0"
              />
              <span className="font-medium text-xs sm:text-sm md:text-base truncate">
                main.enigma
              </span>
              {!isMobile && code.length > 0 && (
                <span className="text-xs text-[var(--tokyo-comment)] flex-shrink-0">
                  ({code.split("\n").length} lines)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Run Button - Always prominent */}
              <Button
                onClick={handleRunCode}
                disabled={isExecuting}
                className={`
                min-w-[48px] min-h-[48px] sm:min-w-[40px] sm:min-h-[40px]
                ${
                  executionSuccess
                    ? "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]"
                    : "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]/80"
                }
                text-[var(--tokyo-bg)] hover:text-[var(--tokyo-bg)]
                rounded-xl sm:rounded-lg transition-all duration-200
                flex items-center justify-center
                shadow-lg hover:shadow-xl
                border border-[var(--tokyo-green)]/20
                active:scale-95 touch-manipulation
                group cursor-pointer
                disabled:opacity-70 disabled:cursor-not-allowed
                disabled:active:scale-100 disabled:hover:shadow-lg
                ${isExecuting ? "animate-pulse" : ""}
              `}
                title={isExecuting ? "Executing..." : "Run Code"}
              >
                {isExecuting ? (
                  <Loader2 className="h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
                ) : executionSuccess ? (
                  <Check className="h-5 w-5 sm:h-4 sm:w-4 animate-in zoom-in-50 duration-200" />
                ) : (
                  <Play className="h-5 w-5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
                )}
              </Button>

              {/* Mobile: Actions in dropdown, Desktop: Individual buttons */}
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-[48px] min-h-[48px] p-0 rounded-xl border-[var(--tokyo-comment)]/40 hover:border-[var(--tokyo-comment)] touch-manipulation active:scale-95"
                      disabled={isExecuting}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-[var(--tokyo-bg-dark)] border-[var(--tokyo-comment)]/40"
                  >
                    <DropdownMenuItem
                      onClick={handleCopyCode}
                      disabled={copySuccess}
                      className="flex items-center gap-2 text-sm hover:bg-[var(--tokyo-comment)]/10"
                    >
                      {copySuccess ? (
                        <Check className="h-4 w-4 text-[var(--tokyo-green)]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copySuccess ? "Copied!" : "Copy Code"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDownloadCode}
                      className="flex items-center gap-2 text-sm hover:bg-[var(--tokyo-comment)]/10"
                    >
                      <Download className="h-4 w-4" />
                      Download Code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <EditorToolbarButton
                    icon={
                      copySuccess ? (
                        <Check className="h-4 w-4 text-[var(--tokyo-green)] animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )
                    }
                    tooltip={copySuccess ? "Copied!" : "Copy Code"}
                    onClick={handleCopyCode}
                    disabled={isExecuting || copySuccess}
                    className={`
                    min-w-[40px] min-h-[40px]
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
                    icon={<Download className="h-4 w-4" />}
                    tooltip="Download Code"
                    onClick={handleDownloadCode}
                    disabled={isExecuting}
                    className="min-w-[40px] min-h-[40px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile Status Bar */}
        {isMobile && code.length > 0 && (
          <div className="px-3 pb-2 border-t border-[var(--tokyo-comment)]/20">
            <div className="flex items-center justify-between text-xs text-[var(--tokyo-comment)]">
              <span>{code.split("\n").length} lines</span>
              <span>{code.length} characters</span>
            </div>
          </div>
        )}
      </div>

      {/* Editor Area - Touch Optimized */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          <EnigmaEditor code={code} onCodeChange={onCodeChange} />
        </div>

        {/* Mobile Floating Run Button - Alternative approach */}
        {isMobile && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              onClick={handleRunCode}
              disabled={isExecuting}
              className={`
                w-14 h-14 rounded-full
                ${
                  executionSuccess
                    ? "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]"
                    : "bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]/80"
                }
                text-[var(--tokyo-bg)] hover:text-[var(--tokyo-bg)]
                shadow-xl hover:shadow-2xl
                border-2 border-[var(--tokyo-green)]/20
                active:scale-95 touch-manipulation
                transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed
                ${isExecuting ? "animate-pulse" : ""}
              `}
              title={isExecuting ? "Executing..." : "Run Code"}
            >
              {isExecuting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : executionSuccess ? (
                <Check className="h-6 w-6 animate-in zoom-in-50 duration-200" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
