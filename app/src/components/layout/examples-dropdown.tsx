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
  );

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
          className={`flex cursor-pointer items-center gap-2 rounded-lg border border-(--tokyo-cyan)/30 bg-tokyo-blue p-2 text-xs text-white shadow-(--tokyo-blue)/20 shadow-lg transition-all duration-200 hover:bg-tokyo-purple hover:shadow-(--tokyo-purple)/30 hover:shadow-xl`}
          whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!isMobile && <FileCode size={14} />}
          <span className={isMobile ? "flex-1 truncate text-left" : ""}>
            {selectedExample ? "Examples" : "Load Example"}
          </span>
          {!isMobile && (
            <ChevronRight
              size={isMobile ? 14 : 16}
              className={`shrink-0 transition-transform duration-200 ${
                showExamplesDropdown ? "rotate-90" : ""
              }`}
            />
          )}
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`font border border-tokyo-comment/30 bg-(--tokyo-bg-dark)/95 font-family-mono backdrop-blur-md ${
          isMobile
            ? "w-[90vw] max-w-sm" // Responsive width for mobile
            : "w-80"
        }`}
        align={isMobile ? "center" : "end"}
        side={isMobile ? "bottom" : "bottom"}
        sideOffset={4}
      >
        <DropdownMenuLabel
          className={`flex items-center gap-2 text-tokyo-fg-dark ${
            isMobile ? "px-3 py-2" : "px-2 py-1"
          }`}
        >
          <Code size={isMobile ? 14 : 12} />
          <span className={isMobile ? "text-sm font-medium" : ""}>
            Example Programs
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-(--tokyo-comment)/20" />

        <div
          className="scrollbar-hide max-h-[60vh] w-full overflow-y-auto"
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
                className={`flex cursor-pointer items-center gap-2 border-l-2 border-transparent px-2 py-2 font-family-mono transition-colors hover:border-(--tokyo-blue)/50 hover:bg-(--tokyo-bg-highlight)/30 ${
                  isMobile ? "px-3 py-3" : "px-2 py-2"
                }`}
                onClick={() => toggleCategory(category.key)}
              >
                <span className="text-lg">{category.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-family-mono font-medium text-tokyo-fg ${
                      isMobile ? "text-sm" : "text-xs"
                    }`}
                  >
                    {category.name}
                  </div>
                  <div
                    className={`text-tokyo-fg-dark ${
                      isMobile ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {category.description}
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-tokyo-fg-dark transition-transform duration-200 ${
                    expandedCategories.has(category.key) ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Category Examples */}
              {expandedCategories.has(category.key) && (
                <div className="ml-6 border-l border-(--tokyo-comment)/20">
                  {category.examples.map((example) => (
                    <DropdownMenuItem
                      key={example.key}
                      className={`ml-2 flex cursor-pointer items-center gap-2 ${
                        isMobile ? "min-h-9 px-3 py-2" : "px-2 py-1.5"
                      } ${
                        selectedExample === example.key
                          ? "border-l-2 border-tokyo-blue bg-(--tokyo-blue)/20 text-tokyo-blue"
                          : "font-cascadia-code text-tokyo-fg-dark hover:bg-(--tokyo-bg-highlight)/30 hover:text-tokyo-fg"
                      }`}
                      onClick={() => handleExampleClick(example.key)}
                    >
                      <span
                        className={`${
                          isMobile ? "flex-1 text-xs" : "text-xs"
                        } truncate`}
                      >
                        {example.name}
                      </span>
                      {selectedExample === example.key && (
                        <div
                          className={`ml-auto animate-pulse rounded-full bg-tokyo-blue ${
                            isMobile ? "h-1.5 w-1.5" : "h-1 w-1"
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
