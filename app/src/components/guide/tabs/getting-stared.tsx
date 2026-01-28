import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import { highlightSyntax } from "../syntax";

interface KeyPointProps {
  children: React.ReactNode;
}

const KeyPoint: React.FC<KeyPointProps> = ({ children }) => (
  <li className="flex gap-2 sm:gap-3 items-start">
    <span className="text-[var(--tokyo-green)] bg-[var(--tokyo-green)]/10 p-1 rounded-full flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0">
      •
    </span>
    <span className="text-sm sm:text-base">{children}</span>
  </li>
);

interface InlineCodeProps {
  children: React.ReactNode;
  color?: "red" | "purple" | "cyan" | "orange";
}

const InlineCode: React.FC<InlineCodeProps> = ({ children, color = "red" }) => {
  const getColorClass = () => {
    switch (color) {
      case "red":
        return "text-[var(--tokyo-red)]";
      case "purple":
        return "text-[var(--tokyo-purple)]";
      case "cyan":
        return "text-[var(--tokyo-cyan)]";
      case "orange":
        return "text-[var(--tokyo-orange)]";
      default:
        return "text-[var(--tokyo-red)]";
    }
  };

  return (
    <code
      className={`bg-[var(--tokyo-bg-dark)]/80 px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm ${getColorClass()}`}
    >
      {children}
    </code>
  );
};

const GettingStarted = () => {
  const keyPoints = [
    {
      content: (
        <>
          Variables are declared with <InlineCode>let</InlineCode> and constants
          with <InlineCode>const</InlineCode>
        </>
      ),
    },
    {
      content: (
        <>
          Functions are defined with <InlineCode color="purple">fn</InlineCode>{" "}
          keyword and always return a value
        </>
      ),
    },
    {
      content: (
        <>
          Statements end with semicolons <InlineCode color="cyan">;</InlineCode>
        </>
      ),
    },
    {
      content: (
        <>
          Code blocks are enclosed in braces{" "}
          <InlineCode color="cyan">{"{}"}</InlineCode>
        </>
      ),
    },
    {
      content: (
        <>
          String concatenation uses the{" "}
          <InlineCode color="orange">+</InlineCode> operator
        </>
      ),
    },
  ];

  return (
    <Card className="bg-[var(--tokyo-bg-dark)]/60 border-[var(--tokyo-comment)]/50 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 bg-[var(--tokyo-yellow)]/5 pointer-events-none"></div>
      <CardHeader className="pb-2 relative p-4 sm:p-6">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[var(--tokyo-yellow)]/10 rounded-full filter blur-3xl"></div>
        <CardTitle className="text-lg sm:text-xl font-bold text-[var(--tokyo-fg)] flex items-center gap-2">
          <Terminal
            size={16}
            className="text-[var(--tokyo-yellow)] sm:w-[18px] sm:h-[18px]"
          />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-[var(--tokyo-fg)] mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base">
          Ready to start coding in Enigma? Here's a simple "Hello World" program
          to get you started:
        </p>
        <div className="bg-tokyo-bg-dark/80 border border-tokyo-comment/30 rounded-lg p-3 sm:p-5 font-mono text-xs sm:text-sm text-[var(--tokyo-fg)] mb-6 sm:mb-8 backdrop-blur-sm relative overflow-hidden">
          <div className="overflow-x-auto">
            {highlightSyntax(`// Define a greeting function
let greet = fn(name) {
  return "Hello, " + name + "!";
};

// Call the function
let message = greet("World");

// Print to console
puts(message);  // Outputs: Hello, World!`)}
          </div>
        </div>

        <h3 className="text-tokyo-fg font-medium mb-2 sm:mb-3 text-base sm:text-lg">
          Key Points to Remember:
        </h3>
        <ul className="text-tokyo-fg space-y-2 sm:space-y-3 mb-5 sm:mb-6 ml-1">
          {keyPoints.map((point, index) => (
            <KeyPoint key={index}>{point.content}</KeyPoint>
          ))}
        </ul>

        <div className="bg-tokyo-bg-dark rounded-xl p-4 sm:p-6 border border-tokyo-comment/50 backdrop-blur-md flex flex-col sm:flex-row items-start gap-3 sm:gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-16 h-16 sm:w-20 sm:h-20 bg-tokyo-yellow/20 rounded-full filter blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-16 h-16 sm:w-20 sm:h-20 bg-tokyo-yellow/10 rounded-full filter blur-2xl"></div>
          <div className="text-tokyo-yellow bg-tokyo-yellow/10 p-2 rounded-lg flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-6 sm:h-6"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="relative">
            <h4 className="text-[var(--tokyo-fg)] font-medium text-base sm:text-lg mb-1 sm:mb-2">
              Pro Tip
            </h4>
            <p className="text-[var(--tokyo-fg)] leading-relaxed text-sm sm:text-base">
              Try exploring the interactive editor in this tool to experiment
              with Enigma code. You can write code and instantly see the tokens
              and AST representation to better understand how the language
              works.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStarted;
