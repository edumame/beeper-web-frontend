import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopAppBar } from "@/components/top-app-bar";
import { SideNav } from "@/components/side-nav";
import { BottomNav } from "@/components/bottom-nav";
import { IdentityGate } from "@/components/identity-gate";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beeper — Async Claude delegation",
  description:
    "Async, allowlisted, Claude-to-Claude task delegation between two humans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} light h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col font-body-sm">
        <TopAppBar />
        <SideNav />
        <div className="flex-1 flex flex-col md:pl-60 pt-10 pb-12 md:pb-0">
          <IdentityGate>{children}</IdentityGate>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
