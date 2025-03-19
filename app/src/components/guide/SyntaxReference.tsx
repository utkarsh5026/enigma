import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories } from "./data";
import { nodeDescriptions, nodeExamples } from "../utils/astUtils";
import { highlightSyntax } from "./syntax";

const getBadgeColor = (nodeType: string): string => {
  if (nodeType.includes("Statement"))
    return "bg-gradient-to-r from-purple-600 to-purple-500";
  if (nodeType.includes("Expression"))
    return "bg-gradient-to-r from-blue-600 to-blue-500";
  if (nodeType.includes("Literal"))
    return "bg-gradient-to-r from-green-600 to-green-500";
  return "bg-gradient-to-r from-orange-600 to-orange-500";
};

const SyntaxReference: React.FC = () => {
  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([category, nodeTypes]) => (
        <div key={category} className="relative">
          {/* Subtle decorative elements */}
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#4d9375]/60 to-transparent rounded-full"></div>

          <div className="ml-4">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <span className="bg-gradient-to-r from-[#4d9375] to-[#7aa2f7] bg-clip-text text-transparent">
                {category}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType}
                  className="bg-gradient-to-br from-[#161b22]/90 to-[#161b22]/70 border border-[#30363d]/40 rounded-lg p-4 backdrop-blur-sm hover:border-[#30363d]/70 transition-colors duration-300 relative overflow-hidden group"
                >
                  {/* Decorative blurred circles that appear on hover */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-[#4d9375]/10 rounded-full filter blur-xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-[#7aa2f7]/10 rounded-full filter blur-xl pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Badge
                        className={cn(
                          "font-mono text-xs py-1 px-2 text-white shadow-sm",
                          getBadgeColor(nodeType)
                        )}
                      >
                        {nodeType}
                      </Badge>
                    </div>
                    <p className="text-[#a9b1d6] text-sm mb-3 leading-relaxed">
                      {nodeDescriptions[nodeType]}
                    </p>
                    {nodeExamples[nodeType] && (
                      <div className="bg-[#0d1117]/80 rounded-md p-3 text-xs font-mono border border-[#30363d]/30 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                          {highlightSyntax(nodeExamples[nodeType])}
                        </div>
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

export default SyntaxReference;
