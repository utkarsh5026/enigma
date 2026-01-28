import { BookOpen } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { highlightSyntax } from "./syntax";
import { Button } from "@/components/ui/button";

const GuideTab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3 sm:p-4">
      <Card className="border-tokyo-comment/50 bg-tokyo-bg-dark/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="p-4 pb-2 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-tokyo-fg sm:text-lg">
            <BookOpen className="text-tokyo-purple" size={16} />
            Enigma Language Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6">
          <p className="mb-3 text-xs leading-relaxed text-tokyo-fg sm:mb-4 sm:text-sm">
            Enigma is a dynamically-typed language with first-class functions,
            closures, and a clean syntax. Here's a quick overview of the key
            features:
          </p>

          <div className="mb-3 space-y-2 sm:mb-4 sm:space-y-3">
            <div className="rounded-lg border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-2.5 shadow-sm backdrop-blur-sm sm:p-3">
              <h3 className="mb-1 text-sm font-medium text-tokyo-cyan sm:mb-1.5 sm:text-base">
                Variables & Functions
              </h3>
              <div className="overflow-x-auto rounded border border-tokyo-comment/20 bg-tokyo-bg-dark/60 p-2 font-mono text-xs text-tokyo-fg">
                {highlightSyntax(
                  `let x = 42;\nconst PI = 3.14;\n\nlet greet = fn(name) {\n  return "Hello, " + name;\n};`
                )}
              </div>
            </div>

            <div className="rounded-lg border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-2.5 shadow-sm backdrop-blur-sm sm:p-3">
              <h3 className="mb-1 text-sm font-medium text-tokyo-cyan sm:mb-1.5 sm:text-base">
                Control Flow
              </h3>
              <div className="overflow-x-auto rounded border border-tokyo-comment/20 bg-tokyo-bg-dark/60 p-2 font-mono text-xs text-tokyo-fg">
                {highlightSyntax(
                  `if (x > 10) {\n  return "greater";\n} else {\n  return "smaller";\n}\n\nwhile (count < 5) {\n  count = count + 1;\n}`
                )}
              </div>
            </div>

            <div className="rounded-lg border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-2.5 shadow-sm backdrop-blur-sm sm:p-3">
              <h3 className="mb-1 text-sm font-medium text-tokyo-cyan sm:mb-1.5 sm:text-base">
                Data Structures
              </h3>
              <div className="overflow-x-auto rounded border border-tokyo-comment/20 bg-tokyo-bg-dark/60 p-2 font-mono text-xs text-tokyo-fg">
                {highlightSyntax(
                  `let array = [1, 2, 3, 4];\nlet hash = {"name": "John", "age": 30};`
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
            <p className="order-2 text-xs text-tokyo-fg-dark sm:order-1">
              View the examples dropdown for more code samples
            </p>
            <Button
              className="order-1 flex w-full cursor-pointer items-center gap-1.5 rounded-md bg-tokyo-purple px-3 py-2 text-xs text-white transition-all hover:bg-tokyo-purple/80 sm:order-2 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm"
              onClick={() => navigate("/guide")}
            >
              <BookOpen size={14} className="sm:h-4 sm:w-4" />
              <span className="sm:hidden">Full Docs</span>
              <span className="hidden sm:inline">View Full Documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideTab;
