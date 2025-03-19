import { BookOpen } from "lucide-react";
import React from "react";

interface QuickReferenceProps {
  setShowGuide: (show: boolean) => void;
  handleCodeChange: (code: string) => void;
  setActiveTab: (
    tab: "tokens" | "ast" | "execution" | "eval" | "guide"
  ) => void;
}

/**
 * QuickReference component provides a quick reference guide for the Enigma language.
 * It displays a summary of the language's syntax and features, allowing users to
 * quickly reference key concepts and syntax.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setShowGuide - A function to set the visibility of the full guide.
 * @param {Function} props.handleCodeChange - A function to handle code changes.
 * @param {Function} props.setActiveTab - A function to set the active tab.
 *
 * @returns {JSX.Element} The rendered QuickReference component.
 */
const QuickReference: React.FC<QuickReferenceProps> = ({
  setShowGuide,
  handleCodeChange,
  setActiveTab,
}) => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Language Quick Guide</h2>
          <button
            className="bg-[#21262d] hover:bg-[#30363d] text-white py-1.5 px-3 rounded-md text-sm flex items-center gap-2"
            onClick={() => setShowGuide(true)}
          >
            <BookOpen size={14} />
            Full Guide
          </button>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium text-white mb-2">
            Quick Reference
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <h4 className="text-[#4d9375] font-medium mb-1">Variables</h4>
              <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">
                let x = 5;
              </pre>
            </div>
            <div>
              <h4 className="text-[#4d9375] font-medium mb-1">Functions</h4>
              <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`fn(x, y) { return x + y; }`}</pre>
            </div>
            <div>
              <h4 className="text-[#4d9375] font-medium mb-1">Conditionals</h4>
              <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`if (x > 5) { return true; }`}</pre>
            </div>
            <div>
              <h4 className="text-[#4d9375] font-medium mb-1">Loops</h4>
              <pre className="bg-[#0d1117] p-2 rounded text-[#e6edf3]">{`while (i < 10) { i = i + 1; }`}</pre>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Example Code</h3>
          <pre className="bg-[#0d1117] p-3 rounded text-[#e6edf3] text-sm whitespace-pre-wrap">
            {`// Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);`}
          </pre>
          <div className="mt-3 flex gap-2">
            <button
              className="bg-[#4d9375] hover:bg-[#3a7057] text-white py-1 px-2 rounded text-xs"
              onClick={() => {
                const example = `// Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);`;
                handleCodeChange(example);
                // Switch to execution tab to see it run
                setActiveTab("execution");
              }}
            >
              Try in Editor
            </button>
            <button
              className="bg-[#21262d] hover:bg-[#30363d] text-white py-1 px-2 rounded text-xs"
              onClick={() => setShowGuide(true)}
            >
              More Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReference;
