import { motion } from "framer-motion";
import { Terminal, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import EditorToolbarButton from "./toolbar-button";
import ExamplesDropdown from "./examples-dropdown";

interface ToolBarProps {
  selectedExample: string;
  showExamplesDropdown: boolean;
  setShowExamplesDropdown: (show: boolean) => void;
  loadExample: (example: string) => void;
  examples: string[];
}

const ToolBar: React.FC<ToolBarProps> = ({
  selectedExample,
  showExamplesDropdown,
  setShowExamplesDropdown,
  loadExample,
  examples,
}) => {
  return (
    <div className="border-b border-[var(--tokyo-comment)]/40 px-4 py-3 flex items-center justify-between bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <motion.div
          className="rounded-lg p-2 bg-gradient-to-br from-[var(--tokyo-blue)] to-[var(--tokyo-purple)] shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Terminal size={20} className="text-white" />
        </motion.div>
        <div>
          <h1 className="font-bold text-lg text-[var(--tokyo-fg)]">
            Enigma Explorer
          </h1>
          <p className="text-xs text-[var(--tokyo-fg-dark)]">
            Interactive Language Environment
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ExamplesDropdown
          showExamplesDropdown={showExamplesDropdown}
          handleOpenChange={setShowExamplesDropdown}
          selectedExample={selectedExample}
          examples={examples}
          loadExample={loadExample}
        />

        <div className="w-px h-6 bg-[var(--tokyo-comment)]/30" />

        <EditorToolbarButton
          icon={
            <div className="flex items-center gap-1">
              <FaGithub />
              <ExternalLink size={12} />
            </div>
          }
          tooltip="View Source on GitHub"
          onClick={() =>
            window.open("hhttps://github.com/utkarsh5026/enigma", "_blank")
          }
        />
      </div>
    </div>
  );
};

export default ToolBar;
