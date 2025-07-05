import { FileCode, Play, Copy, Download } from "lucide-react";
import EditorToolbarButton from "./toolbar-button";
import EnigmaEditor from "@/components/editor/components/enigma-editor";
import { useMobile } from "@/hooks/use-mobile";

interface LeftPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

/**
 * LeftPanel Component
 *
 * This component serves as the left panel of the application, displaying the current
 * code file and providing functionality to run, copy, or download the code.
 *
 * Props:
 * - code: string - The current code being edited.
 * - onCodeChange: (code: string) => void - Callback function to handle changes to the code.
 * - setActiveTab: (tab: string) => void - Function to set the active tab in the application.
 *
 * Features:
 * - Displays the name of the current code file (main.enigma).
 * - Provides buttons to run the code, copy it to the clipboard, or download it as a text file.
 * - Integrates with the EnigmaEditor component to allow for code editing.
 * - Responsive design that adapts to mobile devices.
 */
const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
}) => {
  const { isMobile } = useMobile();
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive header - stacks on small screens, side-by-side on larger screens */}
      <div className="border-b flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
        {!isMobile && (
          <div className="flex px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <FileCode size={16} className="text-tokyo-purple sm:size-4" />
              <span className="font-medium truncate">main.enigma</span>
            </div>
          </div>
        )}

        {/* Toolbar buttons - full width on mobile, auto width on larger screens */}
        <div className="flex items-center justify-center sm:justify-end sm:ml-auto px-3 pb-2 sm:px-2 sm:pb-0">
          <div className="flex items-center gap-1 sm:gap-0">
            <EditorToolbarButton
              icon={<Play className="h-4 w-4 sm:h-5 sm:w-5" />}
              tooltip="Run Code"
              onClick={() => setActiveTab("execution")}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            />
            <EditorToolbarButton
              icon={<Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
              tooltip="Copy Code"
              onClick={() => navigator.clipboard.writeText(code)}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            />
            <EditorToolbarButton
              icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
              tooltip="Download Code"
              onClick={() => {
                const blob = new Blob([code], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "enigma-code.txt";
                a.click();
              }}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
            />
          </div>
        </div>
      </div>

      {/* Editor area - takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <EnigmaEditor code={code} onCodeChange={onCodeChange} />
      </div>
    </div>
  );
};

export default LeftPanel;
