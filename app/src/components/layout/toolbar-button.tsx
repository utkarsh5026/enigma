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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ButtonContent
          icon={icon}
          className={className}
          disabled={disabled}
          handleClick={handleClick}
          isPhone={isPhone}
        />
      </TooltipTrigger>
      <TooltipContent
        side={isMobile ? "top" : "bottom"}
        className={`
          bg-[var(--tokyo-bg-dark)]/95 backdrop-blur-md
          border border-[var(--tokyo-comment)]/30
          text-[var(--tokyo-fg)]
          font-medium
          font-mono
          shadow-xl
          ${isMobile ? "text-xs" : "text-sm"}
          ${disabled ? "opacity-80" : ""}
        `}
        sideOffset={isMobile ? 8 : 6}
      >
        <div className="flex items-center gap-1">
          <span>{disabled ? `${tooltip} (disabled)` : tooltip}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface ButtonContentProps {
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  handleClick: () => void;
  isPhone?: boolean;
}
const ButtonContent: React.FC<ButtonContentProps> = ({
  icon,
  className = "",
  disabled = false,
  handleClick,
  isPhone = false,
}) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        relative group
        ${
          isPhone
            ? "p-2 rounded-xl min-w-[36px] min-h-[36px]"
            : "p-2.5 rounded-xl min-w-[40px] min-h-[40px]"
        } 
        transition-all duration-300 ease-out
        flex items-center justify-center 
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg hover:shadow-[var(--tokyo-purple)]/20"
        }
        ${className}
        border border-transparent
        hover:border-[var(--tokyo-comment)]/20
        backdrop-blur-sm
        overflow-hidden
      `}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--tokyo-bg-highlight)]/0 to-[var(--tokyo-bg-highlight)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 text-[var(--tokyo-comment)] group-hover:text-[var(--tokyo-fg)] transition-colors duration-300">
        {React.isValidElement(icon) ? React.cloneElement(icon) : icon}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-500" />
    </motion.button>
  );
};

export default EditorToolbarButton;
