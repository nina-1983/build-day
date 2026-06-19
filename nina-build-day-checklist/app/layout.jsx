import { Bodoni_Moda } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "The Build Day — Client Prep Checklist | Nina Mistry",
  description: "Get everything ready before your Build Day so we can fly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={bodoni.variable}>
        {children}
      </body>
    </html>
  );
}
