import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Design Pattern Visualizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { slug: string };
}

export default function OgImage({ params }: Props) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 64, fontWeight: 700 }}>
          {params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <p style={{ fontSize: 32, opacity: 0.6 }}>Design Pattern Visualizer</p>
      </div>
    ),
    size
  );
}
