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
    <div className="mb-5">
      <div
        className={`bg-gradient-to-br from-tokyo-bg-dark to-tokyo-bg-dark/70 border-none rounded-lg overflow-hidden cursor-pointer transition-all duration-300 `}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3 relative z-10">
            <div className="text-tokyo-green bg-tokyo-green/10 p-2 rounded-lg">
              {icon}
            </div>
            <h3 className="font-medium text-[var(--tokyo-fg)]">{title}</h3>
          </div>
          <ChevronRight
            size={18}
            className={`text-[var(--tokyo-fg-dark)] transition-transform duration-300 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {expanded && (
          <div className="px-4 pb-5 pt-1 border-t border-tokyo-comment/30 relative overflow-hidden">
            <p className="text-[var(--tokyo-fg)] mb-4 leading-relaxed relative z-10">
              {description}
            </p>
            <div className="bg-tokyo-bg-dark/80 border border-tokyo-comment/30 rounded-lg p-4 font-mono text-sm overflow-x-auto text-tokyo-fg backdrop-blur-sm relative">
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
    <Card className="bg-tokyo-bg-dark/60 border-none backdrop-blur-xl mb-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-tokyo-green/5 to-tokyo-blue/5 pointer-events-none"></div>
      <CardHeader className="pb-2 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tokyo-green/10 rounded-full filter blur-3xl"></div>
        <CardTitle className="text-2xl font-bold text-tokyo-fg">
          Language Features
        </CardTitle>
        <CardDescription className="text-tokyo-fg">
          Key elements and capabilities of the Enigma language
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3">
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
