import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { FooterSection } from "@/components/layout/footer";
import type { Viewport } from "next";
import QueryProvider from '@/components/providers/query-provider'

// Optimize font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export const metadata: Metadata = {
  title: "LESE - Metal Craft",
  description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
  keywords: "metal işleme, kalıp tasarımı, vida üretimi, mastar tel, Bursa",
  authors: [{ name: "LESE Metalcraft" }],
  creator: "LESE Metalcraft",
  publisher: "LESE Metalcraft",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lesemetalcraft.com",
    title: "LESE - Metal Craft",
    description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
    siteName: "LESE Metalcraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "LESE - Metal Craft",
    description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr-TR" suppressHydrationWarning>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload critical assets */}
        <link rel="preload" href="/hero.mp4" as="video" type="video/mp4" />

        {/* Critical CSS - inline the most important styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical above-the-fold styles */
            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body { 
              margin: 0; 
              padding: 0; 
              min-height: 100vh;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 0 1rem; 
            }
            /* Hide loading content to prevent FOUC */
            .loading-hidden { 
              opacity: 0; 
              transition: opacity 0.2s ease-in-out; 
            }
            .loading-visible { 
              opacity: 1; 
            }
            /* Critical navigation styles */
            nav {
              position: sticky;
              top: 0;
              z-index: 50;
              backdrop-filter: blur(8px);
              border-bottom: 1px solid rgba(0,0,0,0.1);
            }
          `,
          }}
        />

        {/* Defer non-critical CSS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Load non-critical CSS after critical content
            function loadCSS(href, media) {
              var ss = document.createElement('link');
              ss.rel = 'stylesheet';
              ss.href = href;
              ss.media = media || 'all';
              document.head.appendChild(ss);
            }
            
            // Load after DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                // Add any non-critical CSS loads here if needed
              });
            }
          `,
          }}
        />

        {/* Defer Cloudflare email decode script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Defer email decode to not block critical path
            window.addEventListener('load', function() {
              if (window.location.hostname.includes('lesemetalcraft.com')) {
                var script = document.createElement('script');
                script.src = '/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js';
                script.async = true;
                document.head.appendChild(script);
              }
            });
          `,
          }}
        />
      </head>

      <body
        className={cn(
          "min-h-screen bg-background loading-hidden",
          inter.className
        )}
      >
        {/* Progressive enhancement script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Remove loading class as soon as body is available
            document.body.classList.remove('loading-hidden');
            document.body.classList.add('loading-visible');
          `,
          }}
        />
        <QueryProvider>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
          <Navbar />
          <main>{children}</main>
          <div className="my-20">
            <FooterSection />
          </div>
        </ThemeProvider>
          </QueryProvider>

        {/* Analytics and non-critical scripts - load after everything else */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Load analytics and other non-critical scripts after page load
            window.addEventListener('load', function() {
              // Add your analytics code here
              // Example: Google Analytics, Facebook Pixel, etc.
              
              // Service worker registration (if you have one)
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(function() {
                  // Silently fail if no service worker
                });
              }
            });
            
            // Prefetch likely next pages on hover
            function prefetchOnHover() {
              const links = document.querySelectorAll('a[href^="/"]');
              links.forEach(link => {
                link.addEventListener('mouseenter', function() {
                  if (link.href && !link.dataset.prefetched) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                    link.dataset.prefetched = 'true';
                  }
                }, { once: true });
              });
            }
            
            // Initialize prefetching after page load
            window.addEventListener('load', prefetchOnHover);
          `,
          }}
        />
      </body>
    </html>
  );
}
