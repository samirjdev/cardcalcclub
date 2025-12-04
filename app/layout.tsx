import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CardCalc - Card Show Calculator",
  description: "Quick percentage calculator for card show vendors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (prefersDark ? 'night' : 'light');
                document.documentElement.classList.add(theme);
                if (theme === 'tsg') {
                  document.body.style.background = 'radial-gradient(ellipse at center, hsl(195 70% 20%), hsl(195 70% 12%))';
                  document.body.style.minHeight = '100vh';
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
