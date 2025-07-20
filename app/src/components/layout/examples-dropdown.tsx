import { motion } from "framer-motion";
import { FileCode, ChevronRight, Code, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useMobile } from "../../hooks/use-mobile";
import { useState } from "react";

interface CategoryExample {
  key: string;
  name: string;
}

interface ExampleCategory {
  key: string;
  emoji: string;
  name: string;
  description: string;
  examples: CategoryExample[];
}

interface ExamplesDropdownProps {
  showExamplesDropdown: boolean;
  handleOpenChange: (open: boolean) => void;
  selectedExample: string;
  categorizedExamples: ExampleCategory[];
  loadExample: (example: string) => void;
}

const ExamplesDropdown: React.FC<ExamplesDropdownProps> = ({
  showExamplesDropdown,
  handleOpenChange,
  selectedExample,
  categorizedExamples,
  loadExample,
}) => {
  const { isMobile } = useMobile();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["beginner"])
  ); // Start with beginner expanded

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handleExampleClick = (exampleKey: string) => {
    loadExample(exampleKey);
    handleOpenChange(false);
  };

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
            : "w-80"
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

        <DropdownMenuSeparator className="bg-[var(--tokyo-comment)]/20" />

        <div
          className="max-h-[60vh] w-full overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari and Opera */
            }
          `}</style>
          {categorizedExamples.map((category) => (
            <div key={category.key}>
              {/* Category Header */}
              <div
                className={`flex items-center gap-2 cursor-pointer px-2 py-2 hover:bg-[var(--tokyo-bg-highlight)]/30 border-l-2 border-transparent hover:border-[var(--tokyo-blue)]/50 transition-colors ${
                  isMobile ? "px-3 py-3" : "px-2 py-2"
                }`}
                onClick={() => toggleCategory(category.key)}
              >
                <span className="text-lg">{category.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-[var(--tokyo-fg)] ${
                      isMobile ? "text-sm" : "text-xs"
                    }`}
                  >
                    {category.name}
                  </div>
                  <div
                    className={`text-[var(--tokyo-fg-dark)] ${
                      isMobile ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {category.description}
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-[var(--tokyo-fg-dark)] ${
                    expandedCategories.has(category.key) ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Category Examples */}
              {expandedCategories.has(category.key) && (
                <div className="ml-6 border-l border-[var(--tokyo-comment)]/20">
                  {category.examples.map((example) => (
                    <DropdownMenuItem
                      key={example.key}
                      className={`flex items-center gap-2 cursor-pointer ml-2 ${
                        isMobile ? "px-3 py-2 min-h-[36px]" : "px-2 py-1.5"
                      } ${
                        selectedExample === example.key
                          ? "bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-l-2 border-[var(--tokyo-blue)]"
                          : "text-[var(--tokyo-fg-dark)] hover:bg-[var(--tokyo-bg-highlight)]/30 hover:text-[var(--tokyo-fg)] font-cascadia-code"
                      }`}
                      onClick={() => handleExampleClick(example.key)}
                    >
                      <span
                        className={`${
                          isMobile ? "text-xs flex-1" : "text-xs"
                        } truncate`}
                      >
                        {example.name}
                      </span>
                      {selectedExample === example.key && (
                        <div
                          className={`ml-auto rounded-full bg-[var(--tokyo-blue)] animate-pulse ${
                            isMobile ? "w-1.5 h-1.5" : "w-1 h-1"
                          }`}
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExamplesDropdown;
