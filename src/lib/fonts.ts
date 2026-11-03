import { Rasa, Hind_Vadodara } from "next/font/google";

// Rasa: a Gujarati + Latin serif with real calligraphic character. Headlines and big numbers.
export const displayFont = Rasa({
  subsets: ["gujarati", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-next",
  display: "swap",
});

// Hind Vadodara: clean Gujarati + Latin UI face. Body, tables, forms.
export const uiFont = Hind_Vadodara({
  subsets: ["gujarati", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui-next",
  display: "swap",
});
