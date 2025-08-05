import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { FooterSection } from "@/components/layout/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LESE - Metal Craft",
  description: "We produce metal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr-TR" suppressHydrationWarning>
      
<meta name="viewport" content="width=device-width, initial-scale=1" />
  <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

          {children}
          
          <FooterSection />
        </ThemeProvider>
      </body>
    </html>
  );
}
