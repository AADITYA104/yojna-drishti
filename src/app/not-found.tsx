import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 20%, #0c1c28 0%, #050b10 100%)",
        color: "#f8fafc",
        padding: "24px",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(56, 189, 248, 0.12)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          marginBottom: "24px",
        }}
      >
        <Compass size={36} />
      </div>

      <h1
        style={{
          fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, #1A1A1A 0%, #333333 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          margin: "12px 0 6px 0",
          color: "#ffffff",
        }}
      >
        પૃષ્ઠ મળ્યું નથી / Page Not Found
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          color: "rgba(255, 255, 255, 0.65)",
          maxWidth: "460px",
          lineHeight: 1.6,
          margin: "0 0 28px 0",
        }}
      >
        તમે શોધી રહ્યાં છો તે પૃષ્ઠ અથવા દૃશ્ય ઉપલબ્ધ નથી અથવા ખસેડવામાં આવ્યું છે.
        કૃપા કરીને મુખ્ય પોર્ટલ પર પાછા ફરો.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "11px 24px",
          borderRadius: "9999px",
          background: "rgba(56, 189, 248, 0.18)",
          border: "1px solid rgba(56, 189, 248, 0.4)",
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: "0.88rem",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
      >
        <Home size={16} />
        <span>મુખ્ય પૃષ્ઠ પર જાઓ / Return Home</span>
      </Link>
    </main>
  );
}
