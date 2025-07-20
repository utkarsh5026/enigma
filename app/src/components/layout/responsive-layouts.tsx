import React, { useState } from "react";
import { BarChart3, X } from "lucide-react";
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
  DrawerClose,
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
      {/* Editor takes full height on mobile with safe area consideration */}
      <div className="flex-1 min-h-0">
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
        />
      </div>

      {/* Mobile Analyze Button - Fixed bottom with safe area */}
      <div className="shrink-0 p-3 pb-safe border-t border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/90 backdrop-blur-sm">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="w-full bg-tokyo-bg-dark/80 text-white touch-manipulation active:scale-95 transition-transform"
              size="lg"
              variant="outline"
            >
              <BarChart3 size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">
                See Code Output
              </span>
              {tokenProps.tokens.length > 0 && (
                <Badge className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 flex-shrink-0">
                  {tokenProps.tokens.length}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[var(--tokyo-bg)]/95 backdrop-blur-md max-w-full h-[85vh] max-h-[calc(100vh-2rem)] font-mono border-0 rounded-t-2xl">
            <DrawerHeader className="border-b border-[var(--tokyo-comment)]/40 p-3 pb-safe-or-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-base sm:text-lg font-medium text-left">
                  Code Analysis
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-8 w-8 text-[var(--tokyo-comment)] hover:text-white"
                  >
                    <X size={16} />
                  </Button>
                </DrawerClose>
              </div>

              {/* Status indicators */}
              <div className="flex gap-2 mt-2">
                {tokenProps.hasTokens && (
                  <Badge variant="secondary" className="text-xs">
                    {tokenProps.tokens.length} tokens
                  </Badge>
                )}
                {tokenProps.isTokenizing && (
                  <Badge variant="outline" className="text-xs">
                    Processing...
                  </Badge>
                )}
                {tokenProps.error && (
                  <Badge variant="destructive" className="text-xs">
                    Error
                  </Badge>
                )}
              </div>
            </DrawerHeader>

            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full p-3 pb-safe-or-3 overflow-auto">
                <AnalysisContent tokenProps={tokenProps} code={code} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
