import { BookOpen } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { highlightSyntax } from "./syntax";
import { Button } from "@/components/ui/button";

const GuideTab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3 sm:p-4">
      <Card className="border-tokyo-comment/50 bg-tokyo-bg-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-bold text-tokyo-fg flex items-center gap-2">
            <BookOpen className="text-tokyo-purple" size={16} />
            Enigma Language Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-xs sm:text-sm text-tokyo-fg mb-3 sm:mb-4 leading-relaxed">
            Enigma is a dynamically-typed language with first-class functions,
            closures, and a clean syntax. Here's a quick overview of the key
            features:
          </p>

          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <div className="bg-tokyo-bg-dark/80 rounded-lg p-2.5 sm:p-3 border border-tokyo-comment/30 shadow-sm backdrop-blur-sm">
              <h3 className="font-medium text-tokyo-cyan mb-1 sm:mb-1.5 text-sm sm:text-base">
                Variables & Functions
              </h3>
              <div className="text-xs font-mono text-tokyo-fg bg-tokyo-bg-dark/60 p-2 rounded border border-tokyo-comment/20 overflow-x-auto">
                {highlightSyntax(
                  `let x = 42;\nconst PI = 3.14;\n\nlet greet = fn(name) {\n  return "Hello, " + name;\n};`
                )}
              </div>
            </div>

            <div className="bg-tokyo-bg-dark/80 rounded-lg p-2.5 sm:p-3 border border-tokyo-comment/30 shadow-sm backdrop-blur-sm">
              <h3 className="font-medium text-tokyo-cyan mb-1 sm:mb-1.5 text-sm sm:text-base">
                Control Flow
              </h3>
              <div className="text-xs font-mono text-tokyo-fg bg-tokyo-bg-dark/60 p-2 rounded border border-tokyo-comment/20 overflow-x-auto">
                {highlightSyntax(
                  `if (x > 10) {\n  return "greater";\n} else {\n  return "smaller";\n}\n\nwhile (count < 5) {\n  count = count + 1;\n}`
                )}
              </div>
            </div>

            <div className="bg-tokyo-bg-dark/80 rounded-lg p-2.5 sm:p-3 border border-tokyo-comment/30 shadow-sm backdrop-blur-sm">
              <h3 className="font-medium text-tokyo-cyan mb-1 sm:mb-1.5 text-sm sm:text-base">
                Data Structures
              </h3>
              <div className="text-xs font-mono text-tokyo-fg bg-tokyo-bg-dark/60 p-2 rounded border border-tokyo-comment/20 overflow-x-auto">
                {highlightSyntax(
                  `let array = [1, 2, 3, 4];\nlet hash = {"name": "John", "age": 30};`
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <p className="text-tokyo-fg-dark text-xs order-2 sm:order-1">
              View the examples dropdown for more code samples
            </p>
            <Button
              className="bg-tokyo-purple hover:bg-tokyo-purple/80 text-white py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto order-1 sm:order-2 cursor-pointer"
              onClick={() => navigate("/guide")}
            >
              <BookOpen size={14} className="sm:w-4 sm:h-4" />
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
