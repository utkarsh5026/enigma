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
import { Token } from "@/lang/token/token";
import { Program } from "@/lang/ast";
import { ErrorMessage } from "@/lang/parser/parser";

interface DesktopLayoutProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
  tokens: Token[];
  program: Program | null;
  parserErrors: ErrorMessage[];
}
export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  code,
  handleCodeChange,
  tokens,
  program,
  parserErrors,
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Editor Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Analysis Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col">
          <AnalysisContent
            tokens={tokens}
            program={program}
            parserErrors={parserErrors}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

interface MobileLayoutProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
  tokens: Token[];
  program: Program | null;
  parserErrors: ErrorMessage[];
}
export const MobileLayout: React.FC<MobileLayoutProps> = ({
  code,
  handleCodeChange,
  tokens,
  program,
  parserErrors,
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
              {tokens.length > 0 && (
                <Badge className="ml-2 bg-white/20 text-white">
                  {tokens.length}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Code Analysis</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 min-h-0">
              <AnalysisContent
                tokens={tokens}
                program={program}
                parserErrors={parserErrors}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
