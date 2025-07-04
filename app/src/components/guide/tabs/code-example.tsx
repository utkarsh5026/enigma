import { Code, Play } from "lucide-react";
import { highlightSyntax } from "../syntax";
import React from "react";
import { examplePrograms } from "../data";

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
      <div className="ml-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-tokyo-green bg-tokyo-green/10 p-2 rounded-lg">
            <Code size={18} />
          </div>
          <h3 className="text-lg font-medium text-tokyo-fg">{title}</h3>
        </div>
        <p className="text-[var(--tokyo-fg)] mb-4 leading-relaxed pl-1">
          {description}
        </p>
        <div className="bg-gradient-to-br from-tokyo-bg-dark to-tokyo-bg-dark/80 border-none rounded-lg p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="relative z-10 font-cascadia-code text-sm">
            {highlightSyntax(code)}
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeExamples = () => {
  return (
    <div>
      <div className="mb-8 bg-gradient-to-br from-[#1c2128]/80 to-[#1c2128]/60 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7aa2f7]/10 rounded-full filter blur-3xl"></div>
        <h2 className="text-xl font-bold text-white mb-3 relative z-10">
          Example Programs
        </h2>
        <p className="text-[#a9b1d6] leading-relaxed relative z-10">
          Explore these example programs to learn Enigma programming patterns
          and techniques. Each example demonstrates different language features
          and coding approaches.
        </p>
      </div>

      {examplePrograms.map((example) => (
        <CodeExample
          key={example.title}
          title={example.title}
          description={example.description}
          code={example.code}
        />
      ))}

      <div className="mt-10 bg-gradient-to-br from-[#1c2128]/80 to-[#161b22]/80 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4d9375]/10 rounded-full filter blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
            <div className="bg-[#4d9375]/10 p-1.5 rounded-lg">
              <Play size={18} className="text-[#4d9375]" />
            </div>
            Try It Yourself
          </h3>
          <p className="text-[#a9b1d6] mb-4 leading-relaxed">
            The best way to learn Enigma is by writing your own programs. Try
            modifying these examples or creating new ones in the editor to
            deepen your understanding of the language.
          </p>
          <button className="bg-gradient-to-r from-[#4d9375] to-[#3a7057] text-white py-2.5 px-5 rounded-lg transition-all text-sm font-medium hover:shadow-lg hover:shadow-[#4d9375]/20">
            Open in Editor
          </button>
        </div>
      </div>
    </div>
  );
};
export default CodeExamples;
