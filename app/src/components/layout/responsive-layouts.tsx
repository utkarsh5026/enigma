import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LeftPanel from "./letft-panel";
import AnalysisContent from "./ananlysis-panel";
import type { Token } from "@/lang/token/token";

interface TokenProps {
  tokens: Token[];
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
}

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
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Editor Panel */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Analysis Panel */}
      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="h-full flex flex-col">
          <AnalysisContent tokenProps={tokenProps} code={code} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

interface MobileLayoutProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
  tokenProps: TokenProps;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  code,
  handleCodeChange,
  tokenProps,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Editor takes full height on mobile */}
      <div className="flex-1">
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
        />
      </div>

      {/* Mobile Analyze Button */}
      <div className="shrink-0 p-4 border-t border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/50">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="w-full bg-[var(--tokyo-blue)] hover:bg-[var(--tokyo-blue)]/90 text-white"
              size="lg"
            >
              <BarChart3 size={20} className="mr-2" />
              Analyze Code
              {tokenProps.tokens.length > 0 && (
                <Badge className="ml-2 bg-white/20 text-white">
                  {tokenProps.tokens.length}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[var(--tokyo-bg)]/50 backdrop-blur-sm max-w-full h-[80vh] font-mono">
            <DrawerHeader className="border-b border-[var(--tokyo-comment)]/40 p-4">
              <DrawerTitle className="text-lg font-medium">
                Code Analysis
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 min-h-0 p-4">
              <AnalysisContent tokenProps={tokenProps} code={code} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
