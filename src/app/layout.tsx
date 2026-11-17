import type { Metadata } from "next";
import { displayFont, uiFont } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/app.css";
import "@/styles/drishti-ui.css";
import "@/styles/motion.css";
import "@/styles/glass.css";
import "@/styles/spatial.css";
import "@/styles/brand.css";

export const metadata: Metadata = {
  title: "યોજના દૃષ્ટિ | Yojana Drishti — Gujarat Welfare Portal & GIS",
  description: "ગુજરાત રાજ્યની તમામ કલ્યાણકારી સરકારી યોજનાઓ, પાત્રતા અને ગામ-સ્તર ભૌગોલિક વિશ્લેષણ પોર્ટલ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="portal-theme">{children}</body>
    </html>
  );
}
