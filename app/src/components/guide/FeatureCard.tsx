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
    <div className="mb-5">
      <div
        className={`bg-gradient-to-br from-[#161b22]/90 to-[#161b22]/70 border border-[#30363d]/40 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
          expanded ? "shadow-lg shadow-[#1a1b26]/10" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#30363d]/5 pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="text-[#4d9375] bg-[#4d9375]/10 p-2 rounded-lg">
              {icon}
            </div>
            <h3 className="font-medium text-white">{title}</h3>
          </div>
          <ChevronRight
            size={18}
            className={`text-[#8b949e] transition-transform duration-300 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {expanded && (
          <div className="px-4 pb-5 pt-1 border-t border-[#30363d]/30 relative overflow-hidden">
            {/* Decorative blurred circles */}
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-[#4d9375]/10 rounded-full filter blur-xl pointer-events-none"></div>
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#7aa2f7]/10 rounded-full filter blur-xl pointer-events-none"></div>

            <p className="text-[#a9b1d6] mb-4 leading-relaxed relative z-10">
              {description}
            </p>
            <div className="bg-[#0d1117]/80 border border-[#30363d]/30 rounded-lg p-4 font-mono text-sm overflow-x-auto text-[#e6edf3] backdrop-blur-sm relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4d9375]/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">{highlightSyntax(example)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
