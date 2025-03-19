import React from "react";
import { sampleCodeSnippets } from "./snippets";
import { BookOpen, Code } from "lucide-react";

interface CodeSamplesSelectorProps {
  onSelectSample: (code: string) => void;
}

const CodeSamplesSelector: React.FC<CodeSamplesSelectorProps> = ({
  onSelectSample,
}) => {
  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-3">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} className="text-[#4d9375]" />
        <h3 className="text-sm font-medium">Sample Code Examples</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => onSelectSample(sampleCodeSnippets.fibonacci)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Fibonacci (Recursion)</span>
        </button>

        <button
          onClick={() => onSelectSample(sampleCodeSnippets.factorial)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Factorial (Recursion)</span>
        </button>

        <button
          onClick={() => onSelectSample(sampleCodeSnippets.loopExample)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Loop Example</span>
        </button>

        <button
          onClick={() => onSelectSample(sampleCodeSnippets.conditionalExample)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Conditional Logic</span>
        </button>

        <button
          onClick={() => onSelectSample(sampleCodeSnippets.arrayExample)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Array Manipulation</span>
        </button>

        <button
          onClick={() => onSelectSample(sampleCodeSnippets.closureExample)}
          className="flex items-center gap-1 text-left p-2 rounded bg-[#0d1117] hover:bg-[#21262d] transition-colors"
        >
          <Code size={12} className="text-[#4d9375]" />
          <span>Closures</span>
        </button>
      </div>
    </div>
  );
};

export default CodeSamplesSelector;
