import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";

interface EditorToolBarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  className?: string;
}

const EditorToolbarButton = ({
  icon,
  tooltip,
  onClick,
  className,
}: EditorToolBarButtonProps) => {
  const { isMobile, isPhone } = useMobile();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${
            isPhone
              ? "p-1.5 rounded-md min-w-[32px] min-h-[32px]"
              : "p-2 rounded-lg min-w-[36px] min-h-[36px]"
          } transition-colors cursor-pointer flex items-center justify-center hover:bg-[var(--tokyo-comment)]/10 active:bg-[var(--tokyo-comment)]/20 ${className}`}
          onClick={onClick}
        >
          {React.isValidElement(icon) ? React.cloneElement(icon) : icon}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className={`font-cascadia-code bg-tokyo-bg-dark text-tokyo-fg ${
          isMobile ? "text-xs" : "text-sm"
        }`}
        sideOffset={isMobile ? 4 : 8}
      >
        <p className={`font-medium ${isPhone ? "text-xs" : "text-xs"}`}>
          {tooltip}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default EditorToolbarButton;
