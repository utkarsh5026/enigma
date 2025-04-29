import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { motion } from "framer-motion";

interface EditorToolBarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}

const EditorToolbarButton = ({
  icon,
  tooltip,
  onClick,
}: EditorToolBarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg transition-colors cursor-pointer`}
          onClick={onClick}
        >
          {React.isValidElement(icon) ? React.cloneElement(icon) : icon}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs font-medium">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default EditorToolbarButton;
