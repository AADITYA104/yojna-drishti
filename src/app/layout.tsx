import type { Metadata } from "next";
import { displayFont, uiFont } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/app.css";
import "@/styles/drishti-ui.css";
import "@/styles/motion.css";

export const metadata: Metadata = {
  title: "યોજના દૃષ્ટિ | Yojana Drishti",
  description: "ગુજરાતની સરકારી યોજનાઓ માટે ભૂ-આધારિત માહિતી મંચ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
