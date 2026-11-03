import type { Metadata } from "next";
import { displayFont, uiFont } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/app.css";
import "@/styles/drishti-ui.css";
import "@/styles/motion.css";
import "@/styles/glass.css";
import "@/styles/spatial.css";

export const metadata: Metadata = {
  title: "યોજના દૃષ્ટિ | Yojana Drishti — Scheme Directory & Gujarat Map",
  description: "ગુજરાત માટેની સરકારી યોજનાઓ શોધવા અને સમજવા માટેનું નમૂના જાહેર પોર્ટલ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="portal-theme">{children}</body>
    </html>
  );
}
