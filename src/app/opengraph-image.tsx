import { ImageResponse } from "next/og";

export const alt = "Efe İnşaat - Pimapen, Cam Balkon, Pergole ve Sineklik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#121816",
          backgroundImage:
            "linear-gradient(135deg, #0e1a17 0%, #16241f 45%, #2f433e 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(111,154,140,0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -140,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(85,127,114,0.16)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 28,
            background: "linear-gradient(135deg, #6f9a8c, #557f72)",
            marginBottom: 36,
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >
          <span style={{ fontSize: 60 }}>🏗️</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#eef3f0",
            letterSpacing: -1,
          }}
        >
          Efe İnşaat
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 30,
            color: "#c2d7ce",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Pimapen · Cam Balkon · Pergole · Sineklik
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "14px 32px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#9bbcb0",
            fontSize: 26,
          }}
        >
          Ataşehir, İstanbul · info@efeinşaat.com
        </div>
      </div>
    ),
    { ...size }
  );
}
