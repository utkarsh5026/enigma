import { motion } from "framer-motion";

const CoreFeatures = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          {
            icon: (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="4,17 10,11 4,5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            ),
            title: "Variables & Types",
            desc: "let, const declarations with dynamic typing",
            example: 'let name = "Alice"\nconst age = 25',
            color: "text-[var(--tokyo-blue)]",
          },
          {
            icon: (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="6" y1="3" x2="6" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="m18 9 2.5-2.5" />
                <path d="m18 9-2.5-2.5" />
              </svg>
            ),
            title: "Control Flow",
            desc: "if/else, while, for loops with rich conditions",
            example: "if (x > 10) {\n  print(x)\n}",
            color: "text-[var(--tokyo-purple)]",
          },
          {
            icon: (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
            ),
            title: "Functions",
            desc: "First-class functions with closures",
            example: "fn add(a, b) {\n  return a + b\n}",
            color: "text-[var(--tokyo-green)]",
          },
          {
            icon: (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            ),
            title: "Data Structures",
            desc: "Arrays, hashes, and objects",
            example: 'let arr = [1, 2, 3]\nlet obj = {"key": "value"}',
            color: "text-[var(--tokyo-orange)]",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-[var(--tokyo-comment)]/20 bg-[var(--tokyo-bg-dark)]/30 p-4 transition-colors hover:border-[var(--tokyo-blue)]/30"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className={feature.color}>{feature.icon}</div>
              <h4 className="font-semibold text-[var(--tokyo-fg)]">
                {feature.title}
              </h4>
            </div>
            <p className="mb-3 text-xs text-[var(--tokyo-comment)]">
              {feature.desc}
            </p>
            <div className="rounded bg-[var(--tokyo-bg)] p-2 font-mono text-xs text-[var(--tokyo-fg)]">
              {feature.example}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--tokyo-blue)]/20 bg-[var(--tokyo-blue)]/10 p-4">
        <h4 className="mb-2 flex items-center gap-2 font-semibold text-[var(--tokyo-fg)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tokyo-yellow)"
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" />
          </svg>
          Object-Oriented Programming
        </h4>
        <p className="mb-3 text-sm text-[var(--tokyo-comment)]">
          Full OOP support with classes, inheritance, and polymorphism:
        </p>
        <div className="rounded bg-[var(--tokyo-bg)] p-3 font-mono text-xs text-[var(--tokyo-fg)]">
          {`class Animal {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    return this.name + " makes a sound"
  }
}

class Dog extends Animal {
  speak() {
    return this.name + " barks!"
  }
}`}
        </div>
      </div>
    </div>
  );
};

export default CoreFeatures;
