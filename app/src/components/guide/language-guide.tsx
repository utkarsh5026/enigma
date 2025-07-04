import React, { useState } from "react";
import { Code, Grid, BookOpen } from "lucide-react";
import GettingStarted from "./getting-stared";
import { LanguageFeatures, SyntaxReference, CodeExamples } from "./tabs";
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
    className={`px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium relative transition-colors whitespace-nowrap ${
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
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-tokyo-green/80 to-tokyo-green/20"></span>
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
    <ScrollArea className="w-full py-4 sm:py-8 relative max-h-screen">
      <div className="relative z-10 mb-8 sm:mb-12 text-center px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-tokyo-green via-tokyo-blue to-tokyo-purple text-transparent bg-clip-text text-center sm:text-left">
            Enigma Programming Language
          </h1>
        </div>
        <p className="text-tokyo-fg text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-2">
          A dynamically-typed language with first-class functions, closures, and
          a clean, expressive syntax. Designed for readability and productivity.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="mb-6 sm:mb-10 border-b border-tokyo-comment/40">
        <div className="overflow-x-auto">
          <div className="flex justify-center sm:justify-center min-w-max px-4">
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

      <div className="max-w-4xl mx-auto relative z-10 px-4">
        {renderTabContent()}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default LanguageGuide;
