import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { ModelHealthIndicator } from "@/components/layout/model-health-indicator";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";
import { ModelHealthProvider } from "@/lib/model-health-context";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindLens",
  description: "MindLens — structured cognitive-behavioral analysis tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlex.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      {/* Inline script runs before paint — applies saved theme to avoid flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased font-sans">
        {/* Animated nebula background */}
        <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />
          <div className="bg-grid" />
          <div className="bg-vignette" />
        </div>

        <I18nProvider>
          <ModelHealthProvider>
            <div className="pt-8">
              <TopNav />
            </div>
            <main className="mx-auto max-w-5xl px-4 pb-16 pt-12">
              {children}
            </main>
            <ModelHealthIndicator />
            <Toaster />
          </ModelHealthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
