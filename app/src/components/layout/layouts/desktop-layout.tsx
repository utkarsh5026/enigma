import React, { useCallback, useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import LeftPanel from "../left/letft-panel";
import AnalysisContent from "../ananlysis-panel";
import type { HightLightFn } from "@/components/editor/hooks/use-editor-highlighting";
import type { Token } from "@/lang/token/token";

type TokenProps = {
  tokens: Token[];
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
};

interface DesktopLayoutProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
  tokenProps: TokenProps;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  code,
  handleCodeChange,
  tokenProps,
}) => {
  const [highlightFunction, setHighlightFunction] =
    useState<HightLightFn | null>(null);

  const handleHighlightingReady = useCallback((highlightFn: HightLightFn) => {
    setHighlightFunction(() => highlightFn);
  }, []);

  const handleHighlightCode = useCallback(
    (line: number, column: number, endLine?: number, endColumn?: number) => {
      if (highlightFunction) {
        highlightFunction({
          startLine: line,
          startColumn: column,
          endLine: endLine || line,
          endColumn: endColumn || column,
        });
      }
    },
    [highlightFunction]
  );
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={65} minSize={40}>
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
          onHighlightingReady={handleHighlightingReady}
        />
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-[var(--tokyo-comment)]/10 hover:bg-[var(--tokyo-purple)]/20 transition-colors duration-200"
      />

      <ResizablePanel defaultSize={35} minSize={30}>
        <div className="h-full flex flex-col bg-gradient-to-br from-[var(--tokyo-bg-dark)]/50 to-[var(--tokyo-bg)]/80">
          <AnalysisContent
            tokenProps={tokenProps}
            code={code}
            onHighlightCode={handleHighlightCode}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
