import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CardCalc - Card Show Calculator",
  description: "Quick percentage calculator for card show vendors. Calculate discounted prices with customizable percentage steps.",
  keywords: ["calculator", "card show", "percentage calculator", "price calculator", "discount calculator"],
  authors: [{ name: "samirjdev" }],
  creator: "samirjdev",
  publisher: "samirjdev",
  metadataBase: new URL("https://cardcalc.club"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CardCalc - Card Show Calculator",
    description: "Quick percentage calculator for card show vendors. Calculate discounted prices with customizable percentage steps.",
    url: "https://cardcalc.club",
    siteName: "CardCalc",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CardCalc - Card Show Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardCalc - Card Show Calculator",
    description: "Quick percentage calculator for card show vendors. Calculate discounted prices with customizable percentage steps.",
    images: ["/og-image.png"],
    creator: "@samirjdev",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CardCalc",
  },
  icons: {
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CardCalc" />
      </head>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (prefersDark ? 'night' : 'light');
                document.documentElement.classList.add(theme);
                
                // Update theme-color meta tag for iOS
                const themeColorMap = {
                  'light': '#ffffff',
                  'night': '#0f172a',
                  'dark': '#000000',
                  'tsg': '#1a3d47'
                };
                const themeColor = themeColorMap[theme] || themeColorMap['light'];
                let metaThemeColor = document.querySelector('meta[name="theme-color"]');
                if (!metaThemeColor) {
                  metaThemeColor = document.createElement('meta');
                  metaThemeColor.setAttribute('name', 'theme-color');
                  document.head.appendChild(metaThemeColor);
                }
                metaThemeColor.setAttribute('content', themeColor);
                
                if (theme === 'tsg') {
                  document.body.style.background = 'radial-gradient(ellipse at center, hsl(195 70% 20%), hsl(195 70% 12%))';
                  document.body.style.minHeight = '100vh';
                  document.body.style.minHeight = '-webkit-fill-available';
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
