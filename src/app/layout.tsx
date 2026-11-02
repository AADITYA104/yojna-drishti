import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/app.css";

export const metadata: Metadata = {
  title: "યોજના દૃષ્ટિ | Yojana Drishti",
  description: "ગુજરાતની સરકારી યોજનાઓ માટે ભૂ-આધારિત માહિતી મંચ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="gu"><body>{children}</body></html>;
}
