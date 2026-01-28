import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { languageFeatures } from "../data";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { highlightSyntax } from "../syntax";

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
    <div className="mb-3 sm:mb-5">
      <div
        className={`bg-tokyo-bg-dark border-none rounded-lg overflow-hidden cursor-pointer transition-all duration-300 `}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-3 sm:p-4 flex items-center justify-between relative min-h-14 sm:min-h-auto">
          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="text-tokyo-green bg-tokyo-green/10 p-1.5 sm:p-2 rounded-lg">
              {icon}
            </div>
            <h3 className="font-medium text-tokyo-fg text-sm sm:text-base">
              {title}
            </h3>
          </div>
          <ChevronRight
            size={16}
            className={`text-tokyo-fg-dark transition-transform duration-300 sm:w-4.5 sm:h-4.5 ${expanded ? "rotate-90" : ""
              }`}
          />
        </div>

        {expanded && (
          <div className="px-3 sm:px-4 pb-4 sm:pb-5 pt-1 border-t border-tokyo-comment/30 relative overflow-hidden">
            <p className="text-tokyo-fg mb-3 sm:mb-4 leading-relaxed relative z-10 text-sm sm:text-base">
              {description}
            </p>
            <div className="bg-tokyo-bg-dark/80 border border-tokyo-comment/30 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto text-tokyo-fg backdrop-blur-sm relative">
              <div className="relative z-10">{highlightSyntax(example)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LanguageFeatures = () => {
  return (
    <Card className="bg-tokyo-bg-dark/60 border-none backdrop-blur-xl mb-8 sm:mb-10 overflow-hidden">
      <div className="absolute inset-0 bg-tokyo-green/5 pointer-events-none"></div>
      <CardHeader className="pb-2 relative p-4 sm:p-6">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-tokyo-green/10 rounded-full filter blur-3xl"></div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-tokyo-fg">
          Language Features
        </CardTitle>
        <CardDescription className="text-tokyo-fg text-sm sm:text-base">
          Key elements and capabilities of the Enigma language
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-4 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {languageFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              icon={feature.icon}
              description={feature.description}
              example={feature.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageFeatures;
