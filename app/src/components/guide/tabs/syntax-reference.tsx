import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories } from "../data";
import { nodeDescriptions, nodeExamples } from "../../utils/astUtils";
import { highlightSyntax } from "../syntax";
import { ScrollArea } from "@/components/ui/scroll-area";

const ReferenceCard: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {Object.entries(categories).map(([category, nodeTypes]) => (
        <div key={category} className="relative">
          <div className="ml-2 sm:ml-4">
            <h3 className="text-base sm:text-lg font-medium text-tokyo-fg mb-3 sm:mb-4 flex items-center">
              <span className="bg-gradient-to-r from-tokyo-green to-tokyo-blue bg-clip-text text-transparent">
                {category}
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType}
                  className="bg-gradient-to-br from-tokyo-bg-dark to-tokyo-bg-dark/70 border-none rounded-lg p-3 sm:p-4 backdrop-blur-sm hover:border-tokyo-comment/70 transition-colors duration-300 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                      <Badge
                        className={cn(
                          "font-mono text-xs py-1 px-2 text-tokyo-fg shadow-sm bg-tokyo-bg-dark font-bold border border-tokyo-comment/40"
                        )}
                      >
                        {nodeType}
                      </Badge>
                    </div>
                    <p className="text-[var(--tokyo-fg)] text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
                      {nodeDescriptions[nodeType]}
                    </p>
                    {nodeExamples[nodeType] && (
                      <div className="bg-tokyo-bg-dark/80 rounded-md p-2 sm:p-3 text-xs font-mono border border-tokyo-comment/30 backdrop-blur-sm">
                        <ScrollArea className="h-[80px] sm:h-[100px]" dir="ltr">
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
    <div className="bg-tokyo-bg-dark/60 p-3 sm:p-4 rounded-lg border-none backdrop-blur-md relative overflow-hidden">
      <div
        className={`absolute -top-4 -left-4 w-8 h-8 sm:w-12 sm:h-12 ${getColorClass(
          type
        )} rounded-full filter blur-xl`}
      ></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-tokyo-bg-dark text-tokyo-fg backdrop-blur-sm text-xs">
            {title}
          </Badge>
        </div>
        <p className="text-[var(--tokyo-fg)] text-xs sm:text-sm leading-relaxed">
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
      <div className="mb-6 sm:mb-8 bg-gradient-to-br from-tokyo-bg-dark to-tokyo-bg-dark/60 rounded-xl p-4 sm:p-6 border-none backdrop-blur-md relative overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-tokyo-fg mb-2 sm:mb-3 relative z-10">
          Syntax Reference
        </h2>
        <p className="text-[var(--tokyo-fg)] leading-relaxed relative z-10 text-sm sm:text-base">
          A comprehensive reference of Enigma's syntax and language constructs.
          Use this guide to understand the building blocks of the language and
          how they fit together.
        </p>
      </div>

      <ReferenceCard />

      <div className="mt-8 sm:mt-10 bg-gradient-to-br from-[var(--tokyo-bg-dark)]/80 to-[var(--tokyo-bg-dark)]/60 rounded-xl p-4 sm:p-6 border border-[var(--tokyo-comment)]/50 backdrop-blur-md">
        <h3 className="text-base sm:text-lg font-medium text-[var(--tokyo-fg)] mb-2 sm:mb-3">
          Understanding AST Nodes
        </h3>
        <p className="text-[var(--tokyo-fg)] mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base">
          Each syntax element in Enigma corresponds to a node in the Abstract
          Syntax Tree (AST). The AST view in the editor shows how your code is
          parsed and structured by the language interpreter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
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
