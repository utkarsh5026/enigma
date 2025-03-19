import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categories } from "./data";
import { nodeDescriptions, nodeExamples } from "../utils/astUtils";
import { highlightSyntax } from "./syntax";

const getBadgeColor = (nodeType: string): string => {
  if (nodeType.includes("Statement")) return "bg-purple-600";
  if (nodeType.includes("Expression")) return "bg-blue-600";
  if (nodeType.includes("Literal")) return "bg-green-600";
  return "bg-orange-600";
};

const SyntaxReference: React.FC = () => {
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([category, nodeTypes]) => (
        <div key={category}>
          <h3 className="text-lg font-medium text-white mb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType}
                className="bg-[#161b22] border border-[#30363d] rounded-md p-3 hover:bg-[#1c2128] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={cn("font-mono text-xs", getBadgeColor(nodeType))}
                  >
                    {nodeType}
                  </Badge>
                </div>
                <p className="text-[#8b949e] text-sm mb-2">
                  {nodeDescriptions[nodeType]}
                </p>
                {nodeExamples[nodeType] && (
                  <div className="bg-[#0d1117] rounded-md p-2 text-xs font-mono">
                    {highlightSyntax(nodeExamples[nodeType])}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SyntaxReference;
