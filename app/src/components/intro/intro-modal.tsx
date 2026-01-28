import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetStarted from "./get-started";
import InteractiveDevelopment from "./interactive-development";
import CoreFeatures from "./core-features";
import Welcome from "./welcome";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Enigma",
      subtitle: "An Interactive Programming Language Explorer",
      content: <Welcome />,
    },
    {
      title: "Core Language Features",
      subtitle: "Everything you need to build real programs",
      content: <CoreFeatures />,
    },
    {
      title: "Interactive Development Tools",
      subtitle: "See how your code works at every level",
      content: <InteractiveDevelopment />,
    },
    {
      title: "Get Started",
      subtitle: "Ready to explore programming language internals?",
      content: <GetStarted onClose={onClose} setCurrentStep={setCurrentStep} />,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-[50] m-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--tokyo-comment)]/30 bg-[var(--tokyo-bg)] shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg)]/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--tokyo-blue)]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <polyline points="4,17 10,11 4,5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--tokyo-fg)]">
                  {steps[currentStep].title}
                </h2>
                <p className="text-lg text-[var(--tokyo-comment)]">
                  {steps[currentStep].subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--tokyo-comment)] transition-colors hover:bg-[var(--tokyo-bg-highlight)]/50 hover:text-[var(--tokyo-fg)]"
              title="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(90vh-200px)] px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg)]/50 px-6 py-4">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-[var(--tokyo-blue)]"
                    : "bg-[var(--tokyo-comment)]"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="rounded-lg border border-[var(--tokyo-comment)] px-4 py-2 text-[var(--tokyo-fg)] transition-colors hover:bg-[var(--tokyo-bg-highlight)]"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 rounded-lg bg-[var(--tokyo-blue)] px-4 py-2 text-white transition-colors hover:bg-[var(--tokyo-blue)]/80"
              >
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroModal;
