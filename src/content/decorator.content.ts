import type { Pattern } from "./types";

export const decorator: Pattern = {
  slug: "decorator",
  name: "Decorator",
  category: "structural",
  tagline: "Add behaviour dynamically — no subclass explosion.",
  problem:
    "You need to add responsibilities to objects at runtime: logging, caching, formatting, notifications. Creating a subclass for every combination leads to an exponential class hierarchy — LoggingCachingFormatter, CachingFormatter, LoggingFormatter, and so on.\n\nThe Decorator pattern wraps an object in another object that shares the same interface, adding behaviour before or after delegating to the wrapped component. Decorators can be stacked in any order, producing new combinations without new classes.",
  metaphor:
    "A bare core object sits at the centre. Concentric shells snap around it one by one — each a decorator. Light pulses inward through the shells when a message arrives, each layer adding its own colour before reaching the core, then the combined response pulses back out.",
  steps: [
    {
      title: "Bare component",
      description: "BaseNotifier implements Notifier and sends an email. It knows nothing about SMS or Slack.",
      sceneDescription: "A single node glows softly at the centre — the bare email notifier, no shells around it.",
      code: `interface Notifier {
  send(message: string): void;
}

class BaseNotifier implements Notifier {
  send(message: string): void {
    console.log(\`📧 Email: \${message}\`);
  }
}

let notifier: Notifier = new BaseNotifier();
notifier.send("Deploy complete");
// 📧 Email: Deploy complete`,
      highlightedLines: [5, 6, 7, 8],
      cameraPosition: [0, 5, 8],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Wrap with SMS decorator",
      description: "SMSDecorator holds a reference to the wrapped Notifier and calls it before adding its own SMS send. The caller still uses the Notifier interface.",
      sceneDescription: "A first shell materialises around the core. The signal now passes through it — email fires first, then SMS.",
      code: `class NotifierDecorator implements Notifier {
  constructor(protected wrapped: Notifier) {}
  send(message: string): void {
    this.wrapped.send(message); // delegate first
  }
}

class SMSDecorator extends NotifierDecorator {
  send(message: string): void {
    super.send(message);                       // email
    console.log(\`📱 SMS: \${message}\`);        // then SMS
  }
}

notifier = new SMSDecorator(notifier);
notifier.send("Deploy complete");
// 📧 Email: Deploy complete
// 📱 SMS: Deploy complete`,
      highlightedLines: [8, 9, 10, 11, 14],
      cameraPosition: [0, 6, 10],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Add Slack decorator",
      description: "SlackDecorator wraps the already-wrapped notifier. The stack is now: Slack → SMS → Email. Each layer is unaware of the others.",
      sceneDescription: "A second shell snaps around the first. Three layers glow — the outermost is Slack-purple.",
      code: `class SlackDecorator extends NotifierDecorator {
  send(message: string): void {
    super.send(message);                       // SMS → Email
    console.log(\`💬 Slack: \${message}\`);      // then Slack
  }
}

notifier = new SlackDecorator(notifier);`,
      highlightedLines: [1, 2, 3, 4, 8],
      cameraPosition: [0, 7, 12],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Combined behaviour fires",
      description: "One send() call traverses the full decorator chain. No class knows about all three channels — behaviour emerged from composition.",
      sceneDescription: "A request pulses inward through all three shells. Each lights up in sequence: Slack-purple, SMS-green, Email-cyan. The response pulses back out combined.",
      code: `notifier.send("🚨 Server is down!");
// 📧 Email: 🚨 Server is down!
// 📱 SMS: 🚨 Server is down!
// 💬 Slack: 🚨 Server is down!

// Order is determined by wrapping order — fully composable:
const altNotifier = new SlackDecorator(new BaseNotifier());
// Slack + Email only — no SMS`,
      highlightedLines: [1, 7, 8],
      cameraPosition: [6, 7, 8],
      cameraTarget: [2, 0, 0],
    },
  ],
  realWorldExample: {
    title: "Express.js middleware chain",
    language: "typescript",
    code: `import express, { Request, Response, NextFunction } from "express";

const app = express();

// Each middleware is a decorator — wraps the next handler
function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // delegate to next layer
}

function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) return res.sendStatus(401);
  next();
}

// Stack decorators in any order
app.use(logger);
app.use(auth);
app.get("/data", (_req, res) => res.json({ ok: true }));`,
  },
  antiPatterns: [
    {
      title: "Subclass explosion",
      description: "Creating a subclass for every channel combination scales as 2ⁿ. Adding a fourth channel (e.g. PagerDuty) doubles the class count again.",
      code: `// ❌ One class per combination — unsustainable
class EmailSMSNotifier extends BaseNotifier { }
class EmailSlackNotifier extends BaseNotifier { }
class SMSSlackNotifier extends BaseNotifier { }
class EmailSMSSlackNotifier extends BaseNotifier { }
// Add PagerDuty → 8 classes. Add one more → 16 classes.`,
    },
  ],
};
