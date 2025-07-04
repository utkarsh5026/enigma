import { motion } from "framer-motion";
import { FileCode, ChevronRight, Code } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
  return (
    <DropdownMenu open={showExamplesDropdown} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--tokyo-bg-highlight)]/80 text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)] transition-colors border border-[var(--tokyo-comment)]/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileCode size={16} />
          <span>{selectedExample ? `${selectedExample}` : "Load Example"}</span>
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${
              showExamplesDropdown ? "rotate-90" : ""
            }`}
          />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 bg-[var(--tokyo-bg-dark)]/95 backdrop-blur-md border border-[var(--tokyo-comment)]/30 font-cascadia-code"
        align="end"
      >
        <DropdownMenuLabel className="text-[var(--tokyo-fg-dark)] flex items-center gap-2 px-2 py-1">
          <Code size={12} />
          Example Programs
        </DropdownMenuLabel>

        {examples.map((example) => (
          <DropdownMenuItem
            key={example}
            className={`flex items-center gap-2 cursor-pointer ${
              selectedExample === example
                ? "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-l-2 border-[var(--tokyo-blue)]"
                : "text-[var(--tokyo-fg)] hover:bg-[var(--tokyo-bg-highlight)]/50 hover:text-[var(--tokyo-blue)] font-cascadia-code"
            }`}
            onClick={() => loadExample(example)}
          >
            <Code size={14} />
            <span>{example}</span>
            {selectedExample === example && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--tokyo-blue)] animate-pulse" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExamplesDropdown;
