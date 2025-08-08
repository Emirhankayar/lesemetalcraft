import AuthPage from "@/components/pages/auth/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap - LESE Metalcraft",
  description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
  keywords: ["giriş yap", "üye girişi", "kayıt ol", "hesap", "oturum aç"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lesemetalcraft.com/auth",
    title: "Giriş Yap - LESE Metalcraft",
    description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
    siteName: "LESE Metalcraft",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Giriş",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giriş Yap - LESE Metalcraft",
    description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
    images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
  },
  robots: {
    index: false, 
    follow: true,
  },
  
};

export default function Auth() {
  return (
    <main className="min-h-screen bg-background">
      <AuthPage />
    </main>
  );
}