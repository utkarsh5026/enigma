import React from "react";

import { Terminal, Braces, Monitor, ChevronsRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TokenDisplay,
  ASTDisplay,
  OutputPanel,
  ExecutionVisualizer,
} from "@/components/analysis";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Token } from "@/lang/token/token";
import { useMobile } from "@/hooks/use-mobile";

interface TabTriggerProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const CustomTabTrigger: React.FC<TabTriggerProps> = ({
  value,
  icon,
  label,
  badge,
}) => (
  <TabsTrigger
    value={value}
    className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-tokyo-fg-dark transition-colors hover:text-tokyo-fg data-[state=active]:border-tokyo-blue data-[state=active]:bg-transparent data-[state=active]:text-tokyo-blue"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge className="ml-1 border-(--tokyo-blue)/30 bg-(--tokyo-blue)/20 text-xs text-tokyo-blue">
          {badge}
        </Badge>
      )}
    </div>
  </TabsTrigger>
);

interface TokenProps {
  tokens: Token[];
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
}

interface AnalysisContentProps {
  tokenProps: TokenProps;
  code: string;
  onHighlightCode?: (
    line: number,
    column: number,
    endLine?: number,
    endColumn?: number
  ) => void;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  tokenProps,
  code,
  onHighlightCode,
}) => {
  const { isPhone } = useMobile();

  return (
    <Tabs
      defaultValue="output"
      className="flex h-full max-h-full flex-col overflow-hidden rounded-2xl border-2"
    >
      {/* Analysis Tabs */}
      {!isPhone && (
        <div className="shrink-0 rounded-2xl border-b border-tokyo-comment/40 bg-(--tokyo-bg-dark)/50 backdrop-blur-sm">
          <TabsList className="h-auto w-full justify-start rounded-2xl bg-transparent p-0">
            <CustomTabTrigger
              value="output"
              icon={<Monitor size={16} />}
              label="Output"
            />
            <CustomTabTrigger
              value="tokens"
              icon={<Terminal size={16} />}
              label="Tokens"
              badge={tokenProps.tokens.length}
            />
            <CustomTabTrigger
              value="ast"
              icon={<Braces size={16} />}
              label="AST"
            />
            <CustomTabTrigger
              value="execution"
              icon={<ChevronsRight size={16} />}
              label="Execution"
            />
          </TabsList>
        </div>
      )}

      <TabsContent value="output" className="m-0 min-h-0 flex-1">
        <OutputPanel />
      </TabsContent>

      {/* Tab Content */}
      {!isPhone && (
        <>
          <TabsContent value="tokens" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-full bg-(--tokyo-bg-dark)/30 p-4">
              <TokenDisplay code={code} {...tokenProps} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ast" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-full bg-(--tokyo-bg-dark)/30 p-4">
              <ASTDisplay code={code} onHighlightCode={onHighlightCode} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="execution" className="m-0 min-h-0 flex-1">
            <ScrollArea className="h-full bg-(--tokyo-bg-dark)/30">
              <ExecutionVisualizer
                code={code}
                onHighlightCode={onHighlightCode}
              />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default AnalysisContent;
