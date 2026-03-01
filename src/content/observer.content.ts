import type { Pattern } from "./types";

export const observer: Pattern = {
  slug: "observer",
  name: "Observer",
  category: "behavioral",
  tagline: "One change, many reactions — without tight coupling.",
  problem:
    "When one object's state changes, several others need to know about it. Directly calling each dependent's update method creates tight coupling — the source must know about every listener, and adding a new one means modifying the source.\n\nThe Observer pattern defines a one-to-many dependency: a subject maintains a list of observers and notifies them automatically on state change. Observers register and unregister themselves without the subject caring who they are.",
  metaphor:
    "A central event hub pulses with light. Subscriber nodes orbit it, connected by glowing wires. When the hub emits, particle streams race outward along each wire — every subscriber lights up in reaction.",
  steps: [
    {
      title: "Observers subscribe",
      description: "Observers register themselves with the EventEmitter. The emitter holds only an interface reference — it doesn't know their concrete types.",
      sceneDescription: "Subscriber nodes fly in and attach to the central hub with glowing connection wires.",
      code: `interface Observer<T> {
  update(data: T): void;
}

class EventEmitter<T> {
  protected observers: Observer<T>[] = [];

  subscribe(o: Observer<T>): void {
    this.observers.push(o);
  }

  unsubscribe(o: Observer<T>): void {
    this.observers = this.observers.filter(obs => obs !== o);
  }
}`,
      highlightedLines: [8, 9, 10],
      cameraPosition: [0, 8, 10],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Subject emits an event",
      description: "StockTicker changes its price and calls notify(). The emitter iterates every registered observer and calls update() — the source stays decoupled from receivers.",
      sceneDescription: "The hub flashes. Particle streams burst outward along every subscriber wire simultaneously.",
      code: `class StockTicker extends EventEmitter<number> {
  private price = 0;

  setPrice(price: number): void {
    this.price = price;
    this.notify(price); // broadcast to all observers
  }

  private notify(data: number): void {
    this.observers.forEach(o => o.update(data));
  }
}`,
      highlightedLines: [5, 6, 9, 10],
      cameraPosition: [0, 6, 6],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Observers react independently",
      description: "Each observer handles the notification in its own way. Adding a new observer never touches StockTicker.",
      sceneDescription: "Each subscriber node pulses with its own colour — one logs, one triggers an alert — all from the same event.",
      code: `class PriceLogger implements Observer<number> {
  update(price: number): void {
    console.log(\`Price updated: \${price}\`);
  }
}

class PriceAlert implements Observer<number> {
  update(price: number): void {
    if (price > 100) console.warn(\`Alert: price hit \${price}!\`);
  }
}

// Wire it up
const ticker = new StockTicker();
ticker.subscribe(new PriceLogger());
ticker.subscribe(new PriceAlert());
ticker.setPrice(105); // both observers fire`,
      highlightedLines: [14, 15, 16, 17],
      cameraPosition: [6, 5, 6],
      cameraTarget: [2, 0, 0],
    },
  ],
  realWorldExample: {
    title: "DOM addEventListener",
    language: "typescript",
    code: `// The DOM EventTarget is a built-in Observer implementation
const button = document.querySelector<HTMLButtonElement>("#submit")!;

// Subscribe
const logClick = () => console.log("clicked");
button.addEventListener("click", logClick);

// Multiple independent observers on the same subject
button.addEventListener("click", () => sendAnalytics("button_click"));

// Unsubscribe
button.removeEventListener("click", logClick);`,
  },
  antiPatterns: [
    {
      title: "Direct method calls (tight coupling)",
      description: "Calling dependents directly means the subject must import and instantiate each one. Every new subscriber requires modifying the source.",
      code: `// ❌ StockTicker knows about every consumer
class StockTicker {
  private logger = new PriceLogger();
  private alert  = new PriceAlert();

  setPrice(price: number): void {
    this.price = price;
    this.logger.log(price);  // hard dependency
    this.alert.check(price); // add subscriber → edit here
  }
}`,
    },
  ],
};
