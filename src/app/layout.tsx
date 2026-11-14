import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VaultProvider } from "@/context/VaultContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VaultX — Cloud-Based Personal Password Manager",
  description:
    "Secure, modern, cloud-based personal password manager featuring zero-knowledge encryption, one-click field copying, and Neon PostgreSQL storage.",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VaultProvider>{children}</VaultProvider>
      </body>
    </html>
  );
}
