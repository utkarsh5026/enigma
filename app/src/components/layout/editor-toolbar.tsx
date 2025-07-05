import { motion } from "framer-motion";
import { BookOpen, Terminal } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import EditorToolbarButton from "./toolbar-button";
import ExamplesDropdown from "./examples-dropdown";
import { useMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ToolBarProps {
  selectedExample: string;
  loadExample: (example: string) => void;
  examples: string[];
}

const ToolBar: React.FC<ToolBarProps> = ({
  selectedExample,
  loadExample,
  examples,
}) => {
  const { isMobile, isPhone } = useMobile();
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="border-b border-[var(--tokyo-comment)]/40 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <motion.div
          className={`rounded-lg p-1.5 sm:p-2 bg-gradient-to-br from-[var(--tokyo-blue)] to-[var(--tokyo-purple)] shadow-lg ${
            isPhone ? "flex-shrink-0" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Terminal size={isPhone ? 16 : 20} className="text-white" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <h1
            className={`font-bold text-[var(--tokyo-fg)] ${
              isPhone ? "text-sm" : "text-lg"
            }`}
          >
            {isPhone ? "Enigma" : "Enigma Explorer"}
          </h1>
          {!isPhone && (
            <p className="text-xs text-[var(--tokyo-fg-dark)]">
              Interactive Language Environment
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <ExamplesDropdown
          showExamplesDropdown={showExamplesDropdown}
          handleOpenChange={setShowExamplesDropdown}
          selectedExample={selectedExample}
          examples={examples}
          loadExample={loadExample}
        />

        <div className="w-px h-4 sm:h-6 bg-[var(--tokyo-comment)]/30" />

        <EditorToolbarButton
          icon={<BookOpen size={isMobile ? 14 : 16} />}
          tooltip="View Documentation"
          onClick={() => navigate("/guide")}
        />

        <EditorToolbarButton
          icon={
            <div className="flex items-center gap-1">
              <FaGithub size={isMobile ? 14 : 16} />
            </div>
          }
          tooltip="View Source on GitHub"
          onClick={() =>
            window.open("https://github.com/utkarsh5026/enigma", "_blank")
          }
        />
      </div>
    </div>
  );
};

export default ToolBar;
