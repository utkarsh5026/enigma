import { motion } from "framer-motion";
import {
  FileCode,
  Terminal,
  Sun,
  Moon,
  ChevronRight,
  Code,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import EditorToolbarButton from "./EditorToolBarButton";

interface ToolBarProps {
  borderColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  highlightBg: string;
  selectedExample: string;
  showExamplesDropdown: boolean;
  setShowExamplesDropdown: (show: boolean) => void;
  loadExample: (example: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  examples: string[];
  sideBg: string;
}

const ToolBar: React.FC<ToolBarProps> = ({
  borderColor,
  accentColor,
  textColor,
  mutedTextColor,
  highlightBg,
  selectedExample,
  showExamplesDropdown,
  setShowExamplesDropdown,
  loadExample,
  darkMode,
  setDarkMode,
  examples,
  sideBg,
}) => {
  return (
    <div
      className="border-b px-4 py-2 flex items-center justify-between"
      style={{ borderColor }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className="rounded-lg p-1.5 mr-2"
          style={{ background: accentColor }}
          whileHover={{ scale: 1.05 }}
        >
          <Terminal size={22} className="text-white" />
        </motion.div>
        <h1 className="font-bold text-lg">Enigma Explorer</h1>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm mr-4"
            style={{ background: highlightBg, color: textColor }}
            onClick={() => setShowExamplesDropdown(!showExamplesDropdown)}
          >
            <FileCode size={16} />
            <span>
              {selectedExample ? `Example: ${selectedExample}` : "Examples"}
            </span>
            <ChevronRight
              size={16}
              className={`transition-transform ${
                showExamplesDropdown ? "rotate-90" : ""
              }`}
            />
          </button>

          {showExamplesDropdown && (
            <motion.div
              className="absolute top-full right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50"
              style={{ background: sideBg, borderColor }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-2 w-64">
                <div
                  className="mb-2 px-2 py-1 text-xs font-medium"
                  style={{ color: mutedTextColor }}
                >
                  Example Programs
                </div>
                {examples.map((example) => (
                  <button
                    key={example}
                    className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                    style={{
                      background:
                        selectedExample === example
                          ? highlightBg
                          : "transparent",
                      color:
                        selectedExample === example ? accentColor : textColor,
                    }}
                    onClick={() => loadExample(example)}
                  >
                    <Code size={14} />
                    <span>{example}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <EditorToolbarButton
            icon={<FaGithub />}
            tooltip="View on GitHub"
            onClick={() =>
              window.open(
                "https://github.com/yourusername/enigma-lang",
                "_blank"
              )
            }
          />
          <EditorToolbarButton
            icon={darkMode ? <Sun /> : <Moon />}
            tooltip={darkMode ? "Light Mode" : "Dark Mode"}
            onClick={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
