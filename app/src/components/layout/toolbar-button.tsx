import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";

interface EditorToolBarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const EditorToolbarButton = ({
  icon,
  tooltip,
  onClick,
  className = "",
  disabled = false,
}: EditorToolBarButtonProps) => {
  const { isMobile, isPhone } = useMobile();

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const buttonContent = (
    <motion.button
      whileHover={disabled ? {} : { scale: isMobile ? 1.02 : 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        ${
          isPhone
            ? "p-1.5 rounded-md min-w-[32px] min-h-[32px]"
            : "p-2 rounded-lg min-w-[36px] min-h-[36px]"
        } 
        transition-all duration-200 
        flex items-center justify-center 
        ${
          disabled
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer hover:bg-[var(--tokyo-comment)]/10 active:bg-[var(--tokyo-comment)]/20 hover:shadow-md"
        }
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      title={disabled ? `${tooltip} (disabled)` : tooltip}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon) : icon}
    </motion.button>
  );

  // If disabled, we still want to show tooltip but with different behavior
  return (
    <Tooltip>
      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
      <TooltipContent
        side="bottom"
        className={`
          font-cascadia-code bg-tokyo-bg-dark text-tokyo-fg 
          ${isMobile ? "text-xs" : "text-sm"}
          ${disabled ? "opacity-80" : ""}
        `}
        sideOffset={isMobile ? 4 : 8}
      >
        <p className={`font-medium ${isPhone ? "text-xs" : "text-xs"}`}>
          {disabled ? `${tooltip} (disabled)` : tooltip}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default EditorToolbarButton;
