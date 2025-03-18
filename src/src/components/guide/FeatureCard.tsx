import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { highlightSyntax } from "./syntax";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  example: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  description,
  example,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4">
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden cursor-pointer transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#4d9375]">{icon}</div>
            <h3 className="font-medium text-white">{title}</h3>
          </div>
          <ChevronRight
            size={18}
            className={`text-[#8b949e] transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {expanded && (
          <div className="px-4 pb-4 border-t border-[#30363d] pt-3">
            <p className="text-[#8b949e] mb-3">{description}</p>
            <div className="bg-[#0d1117] rounded-md p-3 font-mono text-sm overflow-x-auto text-[#e6edf3]">
              {highlightSyntax(example)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
