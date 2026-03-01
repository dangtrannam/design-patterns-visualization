import type { Pattern } from "./types";

export const singleton: Pattern = {
  slug: "singleton",
  name: "Singleton",
  category: "creational",
  tagline: "One instance. Always. Everywhere.",
  problem:
    "Some resources — database connections, config stores, loggers — must exist as exactly one instance. If any part of the system can freely construct them, you risk duplicated state, resource exhaustion, or conflicting configuration.\n\nThe Singleton pattern ensures a class has only one instance and provides a global access point to it. A private constructor prevents external instantiation; a static method returns the cached instance, creating it on first call.",
  metaphor:
    "A single glowing orb hovers at the centre of the scene. Every request arrow that flies in converges on the same orb — no duplicates ever spawn. The first request ignites it; all others simply find it already burning.",
  steps: [
    {
      title: "First call — instance created",
      description: "The static getInstance() method checks whether an instance exists. On first call it does not, so the private constructor runs exactly once.",
      sceneDescription: "The orb is dark. The first request arrow strikes it — it ignites with a burst of cyan light.",
      code: `class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly id: string;

  // Private constructor blocks direct instantiation
  private constructor() {
    this.id = Math.random().toString(36).slice(2, 8);
    console.log(\`Connection \${this.id} created\`);
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}`,
      highlightedLines: [11, 12, 13],
      cameraPosition: [0, 5, 10],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Subsequent calls — same instance returned",
      description: "Every call after the first finds an existing instance and returns it directly. The constructor is never called again — db1 and db2 are the same object.",
      sceneDescription: "Multiple request arrows converge on the orb. Each is deflected back with the same identifier — no new orb spawns.",
      code: `// All callers receive the identical instance
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
const db3 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true
console.log(db2 === db3); // true

db1.query("SELECT * FROM users");
// [Connection a3f9c2] SELECT * FROM users`,
      highlightedLines: [5, 6],
      cameraPosition: [0, 8, 8],
      cameraTarget: [0, 0, 0],
    },
  ],
  realWorldExample: {
    title: "Logger service",
    language: "typescript",
    code: `class Logger {
  private static instance: Logger | null = null;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    return (Logger.instance ??= new Logger());
  }

  log(message: string): void {
    const entry = \`[\${new Date().toISOString()}] \${message}\`;
    this.logs.push(entry);
    console.log(entry);
  }

  getLogs(): string[] { return [...this.logs]; }
}

// Anywhere in the codebase — same logger, same log array
Logger.getInstance().log("Server started");`,
  },
  antiPatterns: [
    {
      title: "Global mutable variable",
      description: "Exporting a plain module-level instance looks similar but provides no controlled initialisation, no lazy creation, and is trivially reassignable.",
      code: `// ❌ Anyone can reassign or create more instances
export let db = new DatabaseConnection();

// Somewhere else in the codebase:
db = new DatabaseConnection(); // second instance — state diverges`,
    },
  ],
};
