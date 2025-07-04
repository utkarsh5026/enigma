import React, { useState } from "react";
import { Code, Terminal, Grid, BookOpen } from "lucide-react";
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
    className={`px-8 py-4 text-sm font-medium relative transition-colors ${
      isActive ? "text-tokyo-green" : "text-tokyo-fg-dark hover:text-tokyo-fg"
    }`}
    onClick={() => onClick(tab.id)}
  >
    <span className="flex items-center gap-2">
      {tab.icon}
      {tab.label}
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
    <ScrollArea className="w-full py-8 relative max-h-screen">
      <div className="relative z-10 mb-12 text-center">
        <div className="inline-flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <div className="relative bg-tokyo-bg p-3 rounded-full border-none">
              <Terminal size={40} className="text-tokyo-green" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-tokyo-green via-tokyo-blue to-tokyo-purple text-transparent bg-clip-text">
            Enigma Programming Language
          </h1>
        </div>
        <p className="text-tokyo-fg text-lg max-w-3xl mx-auto leading-relaxed">
          A dynamically-typed language with first-class functions, closures, and
          a clean, expressive syntax. Designed for readability and productivity.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex justify-center mb-10 border-b border-tokyo-comment/40">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {renderTabContent()}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default LanguageGuide;
