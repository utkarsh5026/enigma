import { BarChart3, Zap, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LeftPanel from "../left/letft-panel";
import AnalysisContent from "../ananlysis-panel";
import { motion, AnimatePresence } from "framer-motion";
import type { Token } from "@/lang/token/token";
import { useState } from "react";

type TokenProps = {
  tokens: Token[];
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
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
            <DrawerHeader className="border-b border-[var(--tokyo-comment)]/20 p-4 flex-shrink-0 bg-transparent backdrop-blur-sm">
              <DrawerTitle className="text-lg font-semibold text-[var(--tokyo-fg)]">
                Code Output
              </DrawerTitle>
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
