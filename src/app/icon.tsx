import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          background: "#E6E6E6",
          color: "#0E0E0E",
          borderRadius: "50%",
          fontFamily: "serif",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: 2,
          }}
        >
          Planète
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-1px",
          }}
        >
          IA
        </div>
      </div>
    ),
    { ...size }
  );
}
