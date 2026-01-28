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
      <ResizablePanel defaultSize={65} minSize={40} className="m-4">
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
          onHighlightingReady={handleHighlightingReady}
        />
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-(--tokyo-comment)/10 transition-colors duration-200 hover:bg-(--tokyo-purple)/20"
      />

      <ResizablePanel defaultSize={35} minSize={30}>
        <div className="m-4 flex h-full flex-col bg-tokyo-bg-dark/60">
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
