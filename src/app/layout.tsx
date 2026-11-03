import type { Metadata } from "next";
import { displayFont, uiFont } from "@/lib/fonts";
import { GujaratBackdrop } from "@/components/glass/GujaratBackdrop";
import "@/styles/tokens.css";
import "@/styles/app.css";
import "@/styles/drishti-ui.css";
import "@/styles/motion.css";
import "@/styles/glass.css";

export const metadata: Metadata = {
  title: "યોજના દૃષ્ટિ | Yojana Drishti — Gujarat State Scheme Geo-Intelligence",
  description: "ગુજરાત સરકારની યોજનાઓ માટે પારદર્શક, ગામ-સ્તરીય ભૂ-આધારિત માહિતી અને લાભાર્થી મંચ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="gu" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="dr-glass">
        <GujaratBackdrop />
        {children}
      </body>
    </html>
  );
}
