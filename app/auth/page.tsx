import AuthSection from "@/components/layout/sections/auth";

export const metadata = {
  title: "Giriş Yap - LESE Metalcraft",
  description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/auth",
    title: "Giriş Yap - LESE Metalcraft",
    description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Giriş",
      },
    ],
  },
};

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background">
      <AuthSection />
    </main>
  );
}