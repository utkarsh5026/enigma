import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories } from "../data";
import {
  nodeDescriptions,
  nodeExamples,
} from "../../analysis/ast/hooks/ast-utils";
import { highlightSyntax } from "../syntax";
import { ScrollArea } from "@/components/ui/scroll-area";

const ReferenceCard: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {Object.entries(categories).map(([category, nodeTypes]) => (
        <div key={category} className="relative">
          <div className="ml-2 sm:ml-4">
            <h3 className="mb-3 flex items-center text-base font-medium text-tokyo-fg sm:mb-4 sm:text-lg">
              <span className="text-tokyo-green">{category}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType}
                  className="group relative overflow-hidden rounded-lg border-none bg-tokyo-bg-dark p-3 backdrop-blur-sm transition-colors duration-300 hover:border-tokyo-comment/70 sm:p-4"
                >
                  <div className="relative z-10">
                    <div className="mb-2 flex items-center gap-2 sm:mb-2.5">
                      <Badge
                        className={cn(
                          "border border-tokyo-comment/40 bg-tokyo-bg-dark px-2 py-1 font-mono text-xs font-bold text-tokyo-fg shadow-sm"
                        )}
                      >
                        {nodeType}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs leading-relaxed text-tokyo-fg sm:mb-3 sm:text-sm">
                      {nodeDescriptions[nodeType]}
                    </p>
                    {nodeExamples[nodeType] && (
                      <div className="rounded-md border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-2 font-mono text-xs backdrop-blur-sm sm:p-3">
                        <ScrollArea className="h-20 sm:h-25" dir="ltr">
                          <div className="text-xs sm:text-sm">
                            {highlightSyntax(nodeExamples[nodeType])}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ASTNodeCardProps {
  type: "statements" | "expressions" | "literals";
  title: string;
  description: string;
}

const ASTNodeCard: React.FC<ASTNodeCardProps> = ({
  type,
  title,
  description,
}) => {
  const getColorClass = (nodeType: string) => {
    switch (nodeType) {
      case "statements":
        return "bg-tokyo-purple/20";
      case "expressions":
        return "bg-tokyo-blue/20";
      case "literals":
        return "bg-[var(--tokyo-green)]/20";
      default:
        return "bg-tokyo-purple/20";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border-none bg-tokyo-bg-dark/60 p-3 backdrop-blur-md sm:p-4">
      <div
        className={`absolute -top-4 -left-4 h-8 w-8 sm:h-12 sm:w-12 ${getColorClass(
          type
        )} rounded-full blur-xl filter`}
      ></div>
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="bg-tokyo-bg-dark text-xs text-tokyo-fg backdrop-blur-sm">
            {title}
          </Badge>
        </div>
        <p className="text-xs leading-relaxed text-[var(--tokyo-fg)] sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

const SyntaxReference = () => {
  const astNodeTypes = [
    {
      type: "statements" as const,
      title: "Statements",
      description:
        "Statements are complete instructions that perform actions. Examples: variable declarations, return statements, loops.",
    },
    {
      type: "expressions" as const,
      title: "Expressions",
      description:
        "Expressions are code that evaluates to a value. Examples: function calls, operations, literals.",
    },
    {
      type: "literals" as const,
      title: "Literals",
      description:
        "Literals are fixed values in the code. Examples: integers, strings, booleans, arrays.",
    },
  ];

  return (
    <div>
      <div className="relative mb-6 overflow-hidden rounded-xl border-none bg-tokyo-bg-dark p-4 backdrop-blur-md sm:mb-8 sm:p-6">
        <h2 className="relative z-10 mb-2 text-lg font-bold text-tokyo-fg sm:mb-3 sm:text-xl">
          Syntax Reference
        </h2>
        <p className="relative z-10 text-sm leading-relaxed text-[var(--tokyo-fg)] sm:text-base">
          A comprehensive reference of Enigma's syntax and language constructs.
          Use this guide to understand the building blocks of the language and
          how they fit together.
        </p>
      </div>

      <ReferenceCard />

      <div className="mt-8 rounded-xl border border-[var(--tokyo-comment)]/50 bg-[var(--tokyo-bg-dark)]/70 p-4 backdrop-blur-md sm:mt-10 sm:p-6">
        <h3 className="mb-2 text-base font-medium text-[var(--tokyo-fg)] sm:mb-3 sm:text-lg">
          Understanding AST Nodes
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-[var(--tokyo-fg)] sm:mb-5 sm:text-base">
          Each syntax element in Enigma corresponds to a node in the Abstract
          Syntax Tree (AST). The AST view in the editor shows how your code is
          parsed and structured by the language interpreter.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {astNodeTypes.map((nodeType) => (
            <ASTNodeCard
              key={nodeType.type}
              type={nodeType.type}
              title={nodeType.title}
              description={nodeType.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyntaxReference;
