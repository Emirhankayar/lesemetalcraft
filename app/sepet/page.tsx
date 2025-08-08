import CheckoutPage from '@/components/pages/cart/CartPage';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sepetim - LESE Metalcraft",
  description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
  keywords: ["sepet", "alışveriş sepeti", "satın al", "metal ürünler", "sipariş"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lesemetalcraft.com/sepet",
    title: "Sepetim - LESE Metalcraft",
    description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
    siteName: "LESE Metalcraft",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Sepet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sepetim - LESE Metalcraft",
    description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
    images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
  },
  robots: {
    index: false, 
    follow: true,
  },
  
};

export default function CheckoutRoute() {
  return (
    <>
      <CheckoutPage />
    </>
  );
}
