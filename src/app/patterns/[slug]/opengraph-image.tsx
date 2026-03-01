import { ImageResponse } from "next/og";
import { getPattern } from "@/content";

export const runtime = "edge";
export const alt = "Design Pattern Visualizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const pattern = getPattern(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#94a3b8",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {pattern?.category ?? "pattern"}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {pattern?.name ?? "Pattern"}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {pattern?.tagline ?? ""}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "#475569",
          }}
        >
          design-pattern-visualizer.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
