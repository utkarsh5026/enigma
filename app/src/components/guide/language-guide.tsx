import React, { useState } from "react";
import { Code, Grid, BookOpen } from "lucide-react";
import {
  LanguageFeatures,
  SyntaxReference,
  CodeExamples,
  GettingStarted,
} from "./tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TabType = "overview" | "examples" | "reference";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactElement;
}

interface TabButtonProps {
  tab: TabConfig;
  isActive: boolean;
  onClick: (tabId: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => (
  <button
    className={`relative px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors sm:px-6 sm:py-4 sm:text-sm ${
      isActive ? "text-tokyo-green" : "text-tokyo-fg-dark hover:text-tokyo-fg"
    }`}
    onClick={() => onClick(tab.id)}
  >
    <span className="flex items-center gap-1.5 sm:gap-2">
      {tab.icon}
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
    </span>
    {isActive && (
      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-tokyo-green/50"></span>
    )}
  </button>
);

const LanguageGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs: TabConfig[] = [
    {
      id: "overview",
      label: "Language Overview",
      icon: <Grid size={16} />,
    },
    {
      id: "examples",
      label: "Code Examples",
      icon: <Code size={16} />,
    },
    {
      id: "reference",
      label: "Syntax Reference",
      icon: <BookOpen size={16} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <LanguageFeatures />
            <GettingStarted />
          </div>
        );
      case "examples":
        return <CodeExamples />;
      case "reference":
        return <SyntaxReference />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="relative max-h-screen w-full py-4 sm:py-8">
      <div className="relative z-10 mb-8 px-4 text-center sm:mb-12">
        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:mb-6 sm:flex-row sm:gap-4">
          <h1 className="text-center text-2xl font-bold text-tokyo-green sm:text-left sm:text-3xl lg:text-4xl">
            Enigma Programming Language
          </h1>
        </div>
        <p className="mx-auto max-w-3xl px-2 text-sm leading-relaxed text-tokyo-fg sm:text-base lg:text-lg">
          A dynamically-typed language with first-class functions, closures, and
          a clean, expressive syntax. Designed for readability and productivity.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="mb-6 border-b border-tokyo-comment/40 sm:mb-10">
        <div className="overflow-x-auto">
          <div className="flex min-w-max justify-center px-4 sm:justify-center">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {renderTabContent()}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default LanguageGuide;
