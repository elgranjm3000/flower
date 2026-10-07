import { ImageResponse } from "next/og";

export const contentType = "image/png";

/** Imagen OpenGraph por defecto (1200×630) para cuando se comparte el sitio. */
export async function GET() {
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
          backgroundColor: "#0d1b2a",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, marginBottom: 24 }}>🌻</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          Sunflower by Company
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#d49e35", marginTop: 16 }}>
          Precios en USD y Bs. · Tasa oficial BCV
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#778598", marginTop: 12 }}>
          Envíos MRW · Tealca · Zoom a toda Venezuela
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
