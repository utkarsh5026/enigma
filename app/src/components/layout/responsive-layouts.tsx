import React, { useState } from "react";
import { BarChart3, X, Zap, Activity } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
      <ResizablePanel defaultSize={65} minSize={40}>
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => {}}
        />
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="bg-[var(--tokyo-comment)]/10 hover:bg-[var(--tokyo-purple)]/20 transition-colors duration-200"
      />

      {/* Analysis Panel */}
      <ResizablePanel defaultSize={35} minSize={30}>
        <div className="h-full flex flex-col bg-gradient-to-br from-[var(--tokyo-bg-dark)]/50 to-[var(--tokyo-bg)]/80">
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

  const getStatusInfo = () => {
    if (tokenProps.error)
      return { type: "error", count: 1, color: "text-[var(--tokyo-red)]" };
    if (tokenProps.isTokenizing)
      return {
        type: "processing",
        count: 0,
        color: "text-[var(--tokyo-yellow)]",
      };
    if (tokenProps.hasTokens)
      return {
        type: "tokens",
        count: tokenProps.tokens.length,
        color: "text-[var(--tokyo-green)]",
      };
    return { type: "ready", count: 0, color: "text-[var(--tokyo-blue)]" };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="h-full flex flex-col">
      {/* Editor takes full height on mobile */}
      <div className="flex-1 min-h-0">
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => setDrawerOpen(true)}
        />
      </div>

      {/* Enhanced Mobile Analysis Button */}
      <motion.div
        className="shrink-0 p-3 bg-gradient-to-r from-[var(--tokyo-bg-dark)]/95 to-[var(--tokyo-bg)]/95 backdrop-blur-md border-t border-[var(--tokyo-comment)]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full relative overflow-hidden bg-gradient-to-r from-[var(--tokyo-purple)]/10 to-[var(--tokyo-blue)]/10 hover:from-[var(--tokyo-purple)]/20 hover:to-[var(--tokyo-blue)]/20 text-[var(--tokyo-fg)] border border-[var(--tokyo-comment)]/30 hover:border-[var(--tokyo-purple)]/50 transition-all duration-300 touch-manipulation active:scale-95"
                size="lg"
                variant="outline"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--tokyo-purple)]/5 to-[var(--tokyo-blue)]/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3
                        size={18}
                        className="text-[var(--tokyo-purple)]"
                      />
                      <span className="font-medium">Analysis & Output</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {statusInfo.count > 0 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <Badge className="bg-[var(--tokyo-purple)]/20 text-[var(--tokyo-purple)] border-[var(--tokyo-purple)]/30 text-xs px-2 py-0.5">
                            {statusInfo.count}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-2">
                    {tokenProps.isTokenizing && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Activity
                          size={14}
                          className="text-[var(--tokyo-yellow)]"
                        />
                      </motion.div>
                    )}

                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Zap size={14} className={statusInfo.color} />
                    </motion.div>
                  </div>
                </div>
              </Button>
            </motion.div>
          </DrawerTrigger>

          <DrawerContent className="bg-gradient-to-br from-[var(--tokyo-bg)]/98 to-[var(--tokyo-bg-dark)]/98 backdrop-blur-xl max-w-full h-[85vh] max-h-[calc(100vh-2rem)] border-0 rounded-t-3xl shadow-2xl font-cascadia-code">
            <DrawerHeader className="border-b border-[var(--tokyo-comment)]/20 p-4 flex-shrink-0 bg-gradient-to-r from-[var(--tokyo-bg-dark)]/50 to-[var(--tokyo-bg)]/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--tokyo-purple)]/20 to-[var(--tokyo-blue)]/20 border border-[var(--tokyo-purple)]/30">
                    <BarChart3
                      size={16}
                      className="text-[var(--tokyo-purple)]"
                    />
                  </div>
                  <div>
                    <DrawerTitle className="text-lg font-semibold text-[var(--tokyo-fg)]">
                      Code Analysis
                    </DrawerTitle>
                    <p className="text-sm text-[var(--tokyo-comment)] mt-0.5">
                      Tokens, AST, and execution output
                    </p>
                  </div>
                </div>

                <DrawerClose asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-9 w-9 rounded-xl text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]"
                    >
                      <X size={16} />
                    </Button>
                  </motion.div>
                </DrawerClose>
              </div>

              {/* Enhanced Status indicators */}
              <motion.div
                className="flex gap-2 mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {tokenProps.hasTokens && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-[var(--tokyo-green)]/10 text-[var(--tokyo-green)] border-[var(--tokyo-green)]/30"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--tokyo-green)] mr-1.5 animate-pulse" />
                    {tokenProps.tokens.length} tokens
                  </Badge>
                )}
                {tokenProps.isTokenizing && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-[var(--tokyo-yellow)]/10 text-[var(--tokyo-yellow)] border-[var(--tokyo-yellow)]/30"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--tokyo-yellow)] mr-1.5"
                    />
                    Processing...
                  </Badge>
                )}
                {tokenProps.error && (
                  <Badge
                    variant="destructive"
                    className="text-xs bg-[var(--tokyo-red)]/10 text-[var(--tokyo-red)] border-[var(--tokyo-red)]/30"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--tokyo-red)] mr-1.5 animate-pulse" />
                    Error
                  </Badge>
                )}
                {!tokenProps.hasTokens &&
                  !tokenProps.isTokenizing &&
                  !tokenProps.error && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-[var(--tokyo-blue)]/10 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--tokyo-blue)] mr-1.5 animate-pulse" />
                      Ready
                    </Badge>
                  )}
              </motion.div>
            </DrawerHeader>

            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-auto">
                <AnalysisContent tokenProps={tokenProps} code={code} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </motion.div>
    </div>
  );
};
