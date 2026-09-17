import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Open a business account — Ethica MFB",
  description:
    "Prepare your Ethica MFB business account application, documents, officer details and signatory information in one place.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
