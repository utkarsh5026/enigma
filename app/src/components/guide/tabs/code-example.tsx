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
    <div className="relative mb-6 sm:mb-8">
      <div className="ml-2 sm:ml-6">
        <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
          <div className="rounded-lg bg-tokyo-green/10 p-1.5 text-tokyo-green sm:p-2">
            <Code size={16} className="sm:h-4.5 sm:w-4.5" />
          </div>
          <h3 className="text-base font-medium text-tokyo-fg sm:text-lg">
            {title}
          </h3>
        </div>
        <p className="mb-3 pl-0 text-sm leading-relaxed text-tokyo-fg sm:mb-4 sm:pl-1 sm:text-base">
          {description}
        </p>
        <div className="relative overflow-hidden rounded-lg border-none bg-tokyo-bg-dark p-3 backdrop-blur-sm sm:p-5">
          <div className="font-cascadia-code relative z-10 overflow-x-auto text-xs sm:text-sm">
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
      <div className="relative mb-6 overflow-hidden rounded-xl border border-[#30363d]/50 bg-[#1c2128]/70 p-4 backdrop-blur-md sm:mb-8 sm:p-6">
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#7aa2f7]/10 blur-3xl filter sm:h-32 sm:w-32"></div>
        <h2 className="relative z-10 mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl">
          Example Programs
        </h2>
        <p className="relative z-10 text-sm leading-relaxed text-[#a9b1d6] sm:text-base">
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

      <div className="relative mt-8 overflow-hidden rounded-xl border border-[#30363d]/50 bg-[#1c2128]/80 p-4 backdrop-blur-md sm:mt-10 sm:p-6">
        <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#4d9375]/10 blur-3xl filter sm:h-32 sm:w-32"></div>
        <div className="relative z-10">
          <h3 className="mb-2 flex items-center gap-2 text-base font-medium text-white sm:mb-3 sm:text-lg">
            <div className="rounded-lg bg-[#4d9375]/10 p-1.5">
              <Play size={16} className="text-[#4d9375] sm:h-4.5 sm:w-4.5" />
            </div>
            Try It Yourself
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-[#a9b1d6] sm:mb-4 sm:text-base">
            The best way to learn Enigma is by writing your own programs. Try
            modifying these examples or creating new ones in the editor to
            deepen your understanding of the language.
          </p>
          <button className="w-full rounded-lg bg-[#4d9375] px-6 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#4d9375]/20 sm:w-auto sm:px-5 sm:py-2.5">
            Open in Editor
          </button>
        </div>
      </div>
    </div>
  );
};
export default CodeExamples;
