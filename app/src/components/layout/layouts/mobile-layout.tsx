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
    <div className="flex h-full flex-col">
      {/* Editor takes full height on mobile */}
      <div className="min-h-0 flex-1">
        <LeftPanel
          code={code}
          onCodeChange={handleCodeChange}
          setActiveTab={() => setDrawerOpen(true)}
        />
      </div>

      {/* Enhanced Mobile Analysis Button */}
      <motion.div
        className="shrink-0 border-t border-(--tokyo-comment)/20 bg-(--tokyo-bg-dark)/95 p-3 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="relative w-full touch-manipulation overflow-hidden border border-tokyo-comment/30 bg-(--tokyo-purple)/10 text-tokyo-fg transition-all duration-300 hover:border-(--tokyo-purple)/50 hover:bg-(--tokyo-purple)/20 active:scale-95"
                size="lg"
                variant="outline"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-(--tokyo-purple)/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />

                <div className="relative z-10 flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-tokyo-purple" />
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
                          <Badge className="border-(--tokyo-purple)/30 bg-(--tokyo-purple)/20 px-2 py-0.5 text-xs text-tokyo-purple">
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
                        <Activity size={14} className="text-tokyo-yellow" />
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

          <DrawerContent className="font-cascadia-code h-[85vh] max-h-[calc(100vh-2rem)] max-w-full rounded-t-3xl border-0 bg-(--tokyo-bg)/98 shadow-2xl backdrop-blur-xl">
            <DrawerHeader className="shrink-0 border-b border-(--tokyo-comment)/20 bg-transparent p-4 backdrop-blur-sm">
              <DrawerTitle className="text-lg font-semibold text-tokyo-fg">
                Code Output
              </DrawerTitle>
            </DrawerHeader>

            <div className="min-h-0 flex-1 overflow-hidden">
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
