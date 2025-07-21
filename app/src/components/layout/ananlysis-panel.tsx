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
    className="py-2 px-4 text-sm font-medium relative transition-colors border-b-2 border-transparent data-[state=active]:border-[var(--tokyo-blue)] data-[state=active]:text-[var(--tokyo-blue)] data-[state=active]:bg-transparent text-[var(--tokyo-fg-dark)] hover:text-[var(--tokyo-fg)] bg-transparent rounded-none"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge className="ml-1 text-xs bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30">
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
    <Tabs defaultValue="output" className="h-full flex flex-col">
      {/* Analysis Tabs */}
      {!isPhone && (
        <div className="shrink-0 border-b border-[var(--tokyo-comment)]/40 bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto rounded-none">
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

      <TabsContent value="output" className="flex-1 min-h-0 m-0">
        <OutputPanel />
      </TabsContent>

      {/* Tab Content */}
      {!isPhone && (
        <>
          <TabsContent value="tokens" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30 p-4">
              <TokenDisplay code={code} {...tokenProps} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ast" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30 p-4">
              <ASTDisplay code={code} onHighlightCode={onHighlightCode} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="execution" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full bg-[var(--tokyo-bg-dark)]/30">
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
