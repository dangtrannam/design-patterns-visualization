import { Layers, Code2, Heart } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Interactive 3D Scenes",
    description:
      "Every pattern ships with a Three.js scene you can rotate and explore. Watch components interact in real time.",
  },
  {
    icon: Code2,
    title: "Step-by-Step Code",
    description:
      "Each scene step syncs with a highlighted TypeScript snippet so you see exactly how the pattern translates to code.",
  },
  {
    icon: Heart,
    title: "Free & Open Source",
    description:
      "No paywalls, no sign-ups. Fork it, extend it, or contribute a new pattern scene on GitHub.",
  },
];

export function ValueProp() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Why This Tool?
        </h2>
        <p className="text-muted-foreground">
          Reading about patterns is one thing. Seeing them move is another.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
