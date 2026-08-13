import { ImageResponse } from "next/og";

export const alt = "Geet — Neon Music Player";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BAR_HEIGHTS = [140, 250, 190, 300];
const BAR_WIDTHS = [42, 42, 42, 42];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 20%, #3b1566 0%, #22093f 45%, #0e0420 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 18,
            marginBottom: 48,
          }}
        >
          {BAR_HEIGHTS.map((height, i) => (
            <div
              key={i}
              style={{
                width: BAR_WIDTHS[i],
                height,
                borderRadius: 10,
                background: "linear-gradient(to bottom, #f0abfc 0%, #c084fc 45%, #67e8f9 100%)",
                boxShadow: "0 0 40px rgba(192, 132, 252, 0.45)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#f0abfc",
            textShadow: "0 0 48px rgba(240, 171, 252, 0.6)",
          }}
        >
          Geet
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: 1,
            color: "#c4b5fd",
          }}
        >
          Stream music with a live neon visualizer
        </div>
      </div>
    ),
    { ...size }
  );
}
