import type { ReactNode } from "react";
import { Providers } from "@/app/provider";
import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Open a business account — Ethica MFB",
  description:
    "Prepare your Ethica MFB business account application, documents, officer details and signatory information in one place.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
