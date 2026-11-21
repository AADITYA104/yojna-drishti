import type { Metadata } from "next";
import { displayFont, uiFont } from "@/lib/fonts";
import { ScrollRevealProvider } from "@/components/motion/ScrollRevealProvider";
import "@/styles/tokens.css";
import "@/styles/app.css";
import "@/styles/drishti-ui.css";
import "@/styles/motion.css";
import "@/styles/glass.css";
import "@/styles/spatial.css";
import "@/styles/brand.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yojana-drishti.gujarat.gov.in"),
  title: {
    default: "યોજના દૃષ્ટિ | Yojana Drishti",
    template: "%s | Yojana Drishti",
  },
  description: "ગુજરાત રાજ્યની મહિલા કલ્યાણકારી યોજનાઓ અને ભૌગોલિક પહોંચ વિશ્લેષણ મંચ (Yojana Drishti).",
  applicationName: "Yojana Drishti",
  keywords: [
    "Yojana Drishti",
    "Gujarat Schemes",
    "Women Empowerment",
    "GIS Analytics",
    "Vahali Dikri",
    "Ganga Swarupa",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="portal-theme">
        <ScrollRevealProvider />
        {children}
      </body>
    </html>
  );
}
