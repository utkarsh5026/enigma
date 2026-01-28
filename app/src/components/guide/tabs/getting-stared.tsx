import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import { highlightSyntax } from "../syntax";

interface KeyPointProps {
  children: React.ReactNode;
}

const KeyPoint: React.FC<KeyPointProps> = ({ children }) => (
  <li className="flex items-start gap-2 sm:gap-3">
    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--tokyo-green)]/10 p-1 text-[var(--tokyo-green)] sm:h-5 sm:w-5">
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
      className={`rounded bg-[var(--tokyo-bg-dark)]/80 px-1.5 py-0.5 text-xs sm:px-2 sm:text-sm ${getColorClass()}`}
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
    <Card className="overflow-hidden border-[var(--tokyo-comment)]/50 bg-[var(--tokyo-bg-dark)]/60 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[var(--tokyo-yellow)]/5"></div>
      <CardHeader className="relative p-4 pb-2 sm:p-6">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[var(--tokyo-yellow)]/10 blur-3xl filter sm:h-32 sm:w-32"></div>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-[var(--tokyo-fg)] sm:text-xl">
          <Terminal
            size={16}
            className="text-[var(--tokyo-yellow)] sm:h-[18px] sm:w-[18px]"
          />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6">
        <p className="mb-4 text-sm leading-relaxed text-[var(--tokyo-fg)] sm:mb-5 sm:text-base">
          Ready to start coding in Enigma? Here's a simple "Hello World" program
          to get you started:
        </p>
        <div className="relative mb-6 overflow-hidden rounded-lg border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-3 font-mono text-xs text-[var(--tokyo-fg)] backdrop-blur-sm sm:mb-8 sm:p-5 sm:text-sm">
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

        <h3 className="mb-2 text-base font-medium text-tokyo-fg sm:mb-3 sm:text-lg">
          Key Points to Remember:
        </h3>
        <ul className="mb-5 ml-1 space-y-2 text-tokyo-fg sm:mb-6 sm:space-y-3">
          {keyPoints.map((point, index) => (
            <KeyPoint key={index}>{point.content}</KeyPoint>
          ))}
        </ul>

        <div className="relative flex flex-col items-start gap-3 overflow-hidden rounded-xl border border-tokyo-comment/50 bg-tokyo-bg-dark p-4 backdrop-blur-md sm:flex-row sm:gap-4 sm:p-6">
          <div className="absolute -top-10 -left-10 h-16 w-16 rounded-full bg-tokyo-yellow/20 blur-2xl filter sm:h-20 sm:w-20"></div>
          <div className="absolute -right-10 -bottom-10 h-16 w-16 rounded-full bg-tokyo-yellow/10 blur-2xl filter sm:h-20 sm:w-20"></div>
          <div className="flex-shrink-0 rounded-lg bg-tokyo-yellow/10 p-2 text-tokyo-yellow">
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
              className="sm:h-6 sm:w-6"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="relative">
            <h4 className="mb-1 text-base font-medium text-[var(--tokyo-fg)] sm:mb-2 sm:text-lg">
              Pro Tip
            </h4>
            <p className="text-sm leading-relaxed text-[var(--tokyo-fg)] sm:text-base">
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
