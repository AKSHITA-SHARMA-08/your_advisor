import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YourAdvisor | Finance Chatbot",
  description: "Professional AI Financial Advisor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
