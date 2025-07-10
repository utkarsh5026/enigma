import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ConsoleActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  variant?: "default" | "danger" | "success";
  children: React.ReactNode;
}

const ConsoleActionButton: React.FC<ConsoleActionButtonProps> = ({
  onClick,
  disabled = false,
  tooltip,
  variant = "default",
  children,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return "text-[var(--tokyo-comment)] hover:text-[var(--tokyo-red)] hover:bg-[var(--tokyo-bg-highlight)]";
      case "success":
        return "text-[var(--tokyo-green)] hover:bg-[var(--tokyo-bg-highlight)]";
      default:
        return "text-[var(--tokyo-comment)] hover:text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={`h-8 w-8 p-0 rounded transition-all duration-200 ${getVariantClasses()} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-[var(--tokyo-bg-highlight)] border border-tokyo-comment">
        <p className="text-xs text-tokyo-fg font-mono">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ConsoleActionButton;
