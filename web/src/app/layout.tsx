import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Maxgreen Mobility",
    template: "%s · Maxgreen Mobility",
  },
  description: "Green mobility solutions for businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();
  const preset = site.theme.presets[site.theme.activePreset];
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-theme={site.theme.activePreset}
      style={
        {
          ["--brand"]: preset.tokens.brand,
          ["--brand2"]: preset.tokens.brand2,
          ["--accent"]: preset.tokens.accent,
          ["--background"]: preset.tokens.background,
          ["--surface"]: preset.tokens.surface,
          ["--foreground"]: preset.tokens.foreground,
          ["--muted"]: preset.tokens.muted,
          ["--border"]: preset.tokens.border,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
