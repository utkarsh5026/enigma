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
        className={`border border-tokyo-comment/30 bg-(--tokyo-bg-dark)/95 font-mono font-medium text-tokyo-fg shadow-xl backdrop-blur-md ${isMobile ? "text-xs" : "text-sm"} ${disabled ? "opacity-80" : ""} `}
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
      className={`group relative ${
        isPhone
          ? "min-h-9 min-w-9 rounded-xl p-2"
          : "min-h-10 min-w-10 rounded-xl p-2.5"
      } flex items-center justify-center transition-all duration-300 ease-out ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:shadow-(--tokyo-purple)/20 hover:shadow-lg"
      } ${className} overflow-hidden border border-transparent backdrop-blur-sm hover:border-(--tokyo-comment)/20`}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <div className="absolute inset-0 bg-(--tokyo-bg-highlight)/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 text-tokyo-comment transition-colors duration-300 group-hover:text-tokyo-fg">
        {React.isValidElement(icon) ? React.cloneElement(icon) : icon}
      </div>

      <div className="absolute inset-0 bg-white/5 opacity-0 transition-all duration-500 group-hover:opacity-100" />
    </motion.button>
  );
};

export default EditorToolbarButton;
