import { motion } from "framer-motion";
import { FileCode, ChevronRight, Code } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMobile } from "../../hooks/use-mobile";

interface ExamplesDropdownProps {
  showExamplesDropdown: boolean;
  handleOpenChange: (open: boolean) => void;
  selectedExample: string;
  examples: string[];
  loadExample: (example: string) => void;
}

const ExamplesDropdown: React.FC<ExamplesDropdownProps> = ({
  showExamplesDropdown,
  handleOpenChange,
  selectedExample,
  examples,
  loadExample,
}) => {
  const { isMobile } = useMobile();

  return (
    <DropdownMenu open={showExamplesDropdown} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className={`flex items-center gap-2 rounded-lg bg-[var(--tokyo-bg-highlight)]/80 text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)] transition-colors border-none text-xs p-2 cursor-pointer`}
          whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!isMobile && <FileCode size={14} />}
          <span className={isMobile ? "truncate flex-1 text-left" : ""}>
            {selectedExample ? "Examples" : "Load Example"}
          </span>
          {!isMobile && (
            <ChevronRight
              size={isMobile ? 14 : 16}
              className={`transition-transform duration-200 flex-shrink-0 ${
                showExamplesDropdown ? "rotate-90" : ""
              }`}
            />
          )}
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`bg-[var(--tokyo-bg-dark)]/95 backdrop-blur-md border border-[var(--tokyo-comment)]/30 font-cascadia-code ${
          isMobile
            ? "w-[90vw] max-w-sm" // Responsive width for mobile
            : "w-72"
        }`}
        align={isMobile ? "center" : "end"}
        side={isMobile ? "bottom" : "bottom"}
        sideOffset={4}
      >
        <DropdownMenuLabel
          className={`text-[var(--tokyo-fg-dark)] flex items-center gap-2 ${
            isMobile ? "px-3 py-2" : "px-2 py-1"
          }`}
        >
          <Code size={isMobile ? 14 : 12} />
          <span className={isMobile ? "text-sm font-medium" : ""}>
            Example Programs
          </span>
        </DropdownMenuLabel>

        {examples.map((example) => (
          <DropdownMenuItem
            key={example}
            className={`flex items-center gap-2 cursor-pointer ${
              isMobile ? "px-3 py-3 min-h-[44px]" : "px-2 py-1.5"
            } ${
              selectedExample === example
                ? "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-l-2 border-[var(--tokyo-blue)]"
                : "text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]/50 hover:text-[var(--tokyo-blue)] font-cascadia-code"
            }`}
            onClick={() => loadExample(example)}
          >
            <Code size={isMobile ? 16 : 14} />
            <span className={`${isMobile ? "text-sm flex-1" : ""} truncate`}>
              {example}
            </span>
            {selectedExample === example && (
              <div
                className={`ml-auto rounded-full bg-[var(--tokyo-blue)] animate-pulse ${
                  isMobile ? "w-2 h-2" : "w-1.5 h-1.5"
                }`}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExamplesDropdown;
