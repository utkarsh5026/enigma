import { FileCode, Play, Copy, Download } from "lucide-react";
import EditorToolbarButton from "./EditorToolBarButton";
import EnigmaEditor from "@/components/editor/EnigmaEditor";

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
 */
const LeftPanel: React.FC<LeftPanelProps> = ({
  code,
  onCodeChange,
  setActiveTab,
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b flex items-center">
        <div className="flex px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <FileCode size={16} className="text-tokyo-purple" />
            <span className="font-medium">main.enigma</span>
          </div>
        </div>
        <div className="ml-auto flex items-center mr-2">
          <EditorToolbarButton
            icon={<Play />}
            tooltip="Run Code"
            onClick={() => setActiveTab("execution")}
          />
          <EditorToolbarButton
            icon={<Copy />}
            tooltip="Copy Code"
            onClick={() => navigator.clipboard.writeText(code)}
          />
          <EditorToolbarButton
            icon={<Download />}
            tooltip="Download Code"
            onClick={() => {
              const blob = new Blob([code], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "enigma-code.txt";
              a.click();
            }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <EnigmaEditor code={code} onCodeChange={onCodeChange} />
      </div>
    </div>
  );
};

export default LeftPanel;
