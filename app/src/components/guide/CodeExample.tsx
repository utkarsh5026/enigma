import { Code } from "lucide-react";
import { highlightSyntax } from "./syntax";
import React from "react";

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
}

const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  description,
  code,
}) => {
  return (
    <div className="mb-8 relative">
      {/* Subtle gradient line on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4d9375] via-[#7aa2f7] to-[#bb9af7] rounded-full"></div>

      <div className="ml-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-[#4d9375] bg-[#4d9375]/10 p-2 rounded-lg">
            <Code size={18} />
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        <p className="text-[#a9b1d6] mb-4 leading-relaxed pl-1">
          {description}
        </p>
        <div className="bg-gradient-to-br from-[#0d1117]/90 to-[#0d1117]/80 border border-[#30363d]/40 rounded-lg p-5 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative blurred elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#7aa2f7]/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#bb9af7]/10 rounded-full filter blur-2xl pointer-events-none"></div>

          {/* Line numbers background */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#161b22]/30 backdrop-blur-sm"></div>

          <div className="relative z-10 font-mono">{highlightSyntax(code)}</div>
        </div>
      </div>
    </div>
  );
};

export default CodeExample;
