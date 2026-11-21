import { Noto_Sans_Gujarati, Inter } from "next/font/google";

// Noto Sans Gujarati: authoritative Gujarati typography with complete diacritic coverage.
export const displayFont = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-next",
  display: "swap",
});

// Inter: crisp Latin and numeric UI face, pairing seamlessly with Noto Sans Gujarati.
export const uiFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui-next",
  display: "swap",
});

