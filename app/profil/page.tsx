import ProfilePage from "@/components/pages/profile/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profilim - LESE Metalcraft",
  description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
  keywords: ["profil", "hesap", "sipariş geçmişi", "kullanıcı hesabı", "hesap ayarları"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lesemetalcraft.com/profil",
    title: "Profilim - LESE Metalcraft",
    description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
    siteName: "LESE Metalcraft",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Profil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profilim - LESE Metalcraft",
    description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
    images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
  },
  robots: {
    index: false, 
    follow: true,
  },
  
};

export default function Profile() {
  return (
    <>   
      <ProfilePage />
    </>
  );
}
