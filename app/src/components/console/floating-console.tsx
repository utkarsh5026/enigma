import { useConsole } from "@/hooks/use-console";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import Console from "./enigma-console";

interface FloatingConsoleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const FloatingConsole: React.FC<FloatingConsoleProps> = ({
  isVisible,
  onToggle,
}) => {
  const { hasEntries, entryCount } = useConsole();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-tokyo-green text-white p-3 rounded-full shadow-lg hover:bg-tokyo-green/90 transition-colors flex items-center gap-2"
        >
          <Terminal size={20} />
          {hasEntries && (
            <Badge variant="secondary" className="bg-white text-tokyo-green">
              {entryCount}
            </Badge>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Console maxHeight="400px" className="shadow-2xl" isCollapsible={true} />
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 bg-tokyo-comment/20 hover:bg-tokyo-comment/40 rounded p-1 transition-colors"
      >
        ×
      </button>
    </div>
  );
};
