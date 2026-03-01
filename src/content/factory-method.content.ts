import type { Pattern } from "./types";

export const factoryMethod: Pattern = {
  slug: "factory-method",
  name: "Factory Method",
  category: "creational",
  tagline: "Let subclasses decide which objects to create.",
  problem:
    "You need to create objects, but the exact type shouldn't be hardcoded in the calling code. As requirements evolve, you'd have to modify the creator every time a new product type is introduced — violating the Open/Closed Principle.\n\nThe Factory Method pattern defines an interface for creating an object but lets subclasses decide which class to instantiate. The creator never needs to know the concrete type it's working with.",
  metaphor:
    "Three specialised assembly machines sit on a factory floor. A client sends a single 'produce' command — each machine delegates to its own internal fabricator, and a different product materialises on the conveyor belt.",
  steps: [
    {
      title: "Client calls the factory",
      description: "The client holds a reference to an abstract Application and calls run(). It never touches concrete classes.",
      sceneDescription: "A request node (client) sends a signal to the abstract factory node at centre stage.",
      code: `// Client only knows the abstract type
const app: Application = new WebApp();
app.run(); // triggers createLogger() internally`,
      highlightedLines: [2, 3],
      cameraPosition: [0, 6, 12],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Factory delegates to subclass",
      description: "WebApp overrides createLogger() and decides to return a ConsoleLogger. The parent's run() method calls the factory method without knowing the result type.",
      sceneDescription: "The factory node lights up and routes the signal to a ConcreteCreator node (WebApp).",
      code: `abstract class Application {
  // Factory method — subclasses override this
  abstract createLogger(): Logger;

  run(): void {
    const logger = this.createLogger(); // delegates
    logger.log("App started");
  }
}

class WebApp extends Application {
  createLogger(): Logger {
    return new ConsoleLogger(); // concrete decision
  }
}`,
      highlightedLines: [2, 11, 12],
      cameraPosition: [-3, 4, 8],
      cameraTarget: [-1, 0, 0],
    },
    {
      title: "Product materialises",
      description: "ConsoleLogger implements the Logger interface. The factory method returns it; run() calls log() without caring about the concrete type.",
      sceneDescription: "A product node (ConsoleLogger) spawns and glows — the assembly is complete.",
      code: `interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(\`[Console] \${message}\`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(\`[File] \${message}\`);
  }
}`,
      highlightedLines: [5, 6, 7, 8],
      cameraPosition: [3, 4, 8],
      cameraTarget: [1, 0, 0],
    },
  ],
  realWorldExample: {
    title: "React field factory",
    language: "typescript",
    code: `type FieldType = "text" | "select" | "checkbox";

function createField(type: FieldType): React.ReactNode {
  switch (type) {
    case "text":     return <TextInput />;
    case "select":   return <SelectInput />;
    case "checkbox": return <CheckboxInput />;
  }
}

// Form builder only calls the factory
fields.map(({ type }) => createField(type))`,
  },
  antiPatterns: [
    {
      title: "Giant switch in caller",
      description: "Constructing objects directly in client code with if/switch means every new product type forces a change in the caller — the opposite of Open/Closed.",
      code: `// ❌ Caller knows every concrete type
function run(type: string) {
  let logger;
  if (type === "web")    logger = new ConsoleLogger();
  else if (type === "server") logger = new FileLogger();
  // add new type → edit this function
  logger.log("started");
}`,
    },
  ],
};
