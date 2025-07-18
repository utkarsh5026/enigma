import React from "react";
import { FileCode, Play, Copy, Download } from "lucide-react";
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

  const handleRunCode = () => {
    consoleStore.clear();
    const lexer = new Lexer(code);
    const parser = new LanguageParser(lexer);
    const ast = parser.parseProgram();

    if (parser.getErrors().length > 0) {
      consoleStore.addEntry(parser.getErrors()[0].message, "error");
    }

    const evaluator = LanguageEvaluator.withSourceCode(code, true);
    const result = evaluator.evaluateProgram(ast, new Environment());

    if (!ObjectValidator.isError(result)) {
      consoleStore.addEntry(
        "Code executed successfully with exit code 0 😎",
        "success"
      );
    } else {
      consoleStore.addEntry(result.inspect(), "error");
    }
    setActiveTab("execution");
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
              className="
                min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]
                bg-[var(--tokyo-green)] hover:bg-[var(--tokyo-green)]/80
                text-[var(--tokyo-bg)] hover:text-[var(--tokyo-bg)]
                rounded-lg transition-all duration-200
                flex items-center justify-center
                shadow-lg hover:shadow-xl
                border border-[var(--tokyo-green)]/20
                active:scale-95
                group cursor-pointer
              "
              title="Run Code"
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
            </Button>
            <EditorToolbarButton
              icon={<Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
              tooltip="Copy Code"
              onClick={() => navigator.clipboard.writeText(code)}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            />
            <EditorToolbarButton
              icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
              tooltip="Download Code"
              onClick={() => {
                const blob = new Blob([code], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "enigma-code.txt";
                a.click();
              }}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            />
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
