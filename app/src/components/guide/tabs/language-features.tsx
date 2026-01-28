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
        className={`cursor-pointer overflow-hidden rounded-lg border-none bg-tokyo-bg-dark transition-all duration-300`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative flex min-h-14 items-center justify-between p-3 sm:min-h-auto sm:p-4">
          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-tokyo-green/10 p-1.5 text-tokyo-green sm:p-2">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-tokyo-fg sm:text-base">
              {title}
            </h3>
          </div>
          <ChevronRight
            size={16}
            className={`text-tokyo-fg-dark transition-transform duration-300 sm:h-4.5 sm:w-4.5 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {expanded && (
          <div className="relative overflow-hidden border-t border-tokyo-comment/30 px-3 pt-1 pb-4 sm:px-4 sm:pb-5">
            <p className="relative z-10 mb-3 text-sm leading-relaxed text-tokyo-fg sm:mb-4 sm:text-base">
              {description}
            </p>
            <div className="relative overflow-x-auto rounded-lg border border-tokyo-comment/30 bg-tokyo-bg-dark/80 p-3 font-mono text-xs text-tokyo-fg backdrop-blur-sm sm:p-4 sm:text-sm">
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
    <Card className="mb-8 overflow-hidden border-none bg-tokyo-bg-dark/60 backdrop-blur-xl sm:mb-10">
      <div className="pointer-events-none absolute inset-0 bg-tokyo-green/5"></div>
      <CardHeader className="relative p-4 pb-2 sm:p-6">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-tokyo-green/10 blur-3xl filter sm:h-32 sm:w-32"></div>
        <CardTitle className="text-xl font-bold text-tokyo-fg sm:text-2xl">
          Language Features
        </CardTitle>
        <CardDescription className="text-sm text-tokyo-fg sm:text-base">
          Key elements and capabilities of the Enigma language
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-4 pt-0 sm:p-6">
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
