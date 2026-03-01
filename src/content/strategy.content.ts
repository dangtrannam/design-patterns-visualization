import type { Pattern } from "./types";

export const strategy: Pattern = {
  slug: "strategy",
  name: "Strategy",
  category: "behavioral",
  tagline: "Swap algorithms at runtime without touching the client.",
  problem:
    "You have a class that needs to perform a task — sorting, payments, compression — and the algorithm must be selectable at runtime. Embedding every variant in the class with if/else chains makes it fragile: adding a new algorithm means editing tested code.\n\nThe Strategy pattern extracts each algorithm into its own class behind a common interface. The context holds a reference to the interface and delegates execution to whatever strategy is currently set — swapping algorithms without changing a line of context code.",
  metaphor:
    "A context node has an open slot in its centre. Three interchangeable algorithm blocks float nearby. At runtime, one snaps in — the context lights up with that strategy's colour. Swap the block, the colour changes instantly.",
  steps: [
    {
      title: "Define the strategy interface",
      description: "All sorting algorithms implement SortStrategy. The Sorter context depends only on this interface — never on concrete classes.",
      sceneDescription: "The interface contract glows at the top. Three algorithm blocks hover below it, each connected by a dashed line showing they fulfil the contract.",
      code: `interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length - i - 1; j++)
        if (arr[j] > arr[j + 1])
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    return arr;
  }
}`,
      highlightedLines: [1, 2, 3],
      cameraPosition: [0, 5, 10],
      cameraTarget: [0, 0, 0],
    },
    {
      title: "Context delegates to the strategy",
      description: "Sorter holds a strategy reference. sort() simply calls through — the context is oblivious to which algorithm runs.",
      sceneDescription: "The context node's slot snaps the BubbleSort block in. A request flows in, passes straight through to the algorithm block, and a result flows out.",
      code: `class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data); // pure delegation
  }
}

const sorter = new Sorter(new BubbleSort());
console.log(sorter.sort([3, 1, 4, 1, 5]));`,
      highlightedLines: [8, 9],
      cameraPosition: [5, 5, 6],
      cameraTarget: [2, 0, 0],
    },
    {
      title: "Strategy swapped at runtime",
      description: "A single setStrategy() call replaces the algorithm. The client code stays identical — only the strategy object changes.",
      sceneDescription: "The BubbleSort block ejects from the slot with a flash. QuickSort snaps in — the context node pulses a different colour but is otherwise unchanged.",
      code: `class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;
    const [pivot, ...rest] = data;
    return [
      ...this.sort(rest.filter(x => x <= pivot)),
      pivot,
      ...this.sort(rest.filter(x => x > pivot)),
    ];
  }
}

// Runtime swap — no changes to Sorter
sorter.setStrategy(new QuickSort());
console.log(sorter.sort([3, 1, 4, 1, 5]));`,
      highlightedLines: [14, 15],
      cameraPosition: [0, 5, 10],
      cameraTarget: [0, 0, 0],
    },
  ],
  realWorldExample: {
    title: "Payment processing",
    language: "typescript",
    code: `interface PaymentStrategy {
  charge(amount: number): void;
}

class CreditCard implements PaymentStrategy {
  charge(amount: number) { console.log(\`Card charged \$\${amount}\`); }
}
class PayPal implements PaymentStrategy {
  charge(amount: number) { console.log(\`PayPal charged \$\${amount}\`); }
}
class Crypto implements PaymentStrategy {
  charge(amount: number) { console.log(\`Crypto sent \$\${amount}\`); }
}

class Checkout {
  constructor(private payment: PaymentStrategy) {}
  setPayment(p: PaymentStrategy) { this.payment = p; }
  complete(total: number) { this.payment.charge(total); }
}

const checkout = new Checkout(new CreditCard());
checkout.setPayment(new Crypto()); // user changed mind
checkout.complete(49.99);`,
  },
  antiPatterns: [
    {
      title: "if/else algorithm selection in context",
      description: "Every new algorithm requires opening the Sorter class and adding another branch — classic Open/Closed violation.",
      code: `// ❌ Context must be modified for every new algorithm
class Sorter {
  sort(data: number[], type: string): number[] {
    if (type === "bubble") { /* ... */ }
    else if (type === "quick") { /* ... */ }
    // add merge sort → edit this class
    return data;
  }
}`,
    },
  ],
};
