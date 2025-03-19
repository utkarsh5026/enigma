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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Code size={18} className="text-[#4d9375]" />
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <p className="text-[#8b949e] mb-2">{description}</p>
      <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
        {highlightSyntax(code)}
      </div>
    </div>
  );
};

export default CodeExample;
