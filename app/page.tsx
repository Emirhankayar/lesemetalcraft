import HomePage from "@/components/pages/home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LESE Metalcraft - Kaliteli Metal İşçiliği ve Tasarım",
  description: "LESE Metalcraft ile kaliteli metal ürünler keşfedin. Özel tasarım metal işçiliği, metal objeler ve endüstriyel çözümler.",
  keywords: ["metal işçiliği", "metalcraft", "özel tasarım", "endüstriyel çözümler"],
  authors: [{ name: "LESE Metalcraft" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lesemetalcraft.com",
    title: "LESE Metalcraft - Kaliteli Metal İşçiliği ve Tasarım",
    description: "LESE Metalcraft ile kaliteli metal ürünler keşfedin. Özel tasarım metal işçiliği, metal objeler ve endüstriyel çözümler.",
    siteName: "LESE Metalcraft",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Ana Sayfa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LESE Metalcraft - Kaliteli Metal İşçiliği ve Tasarım",
    description: "LESE Metalcraft ile kaliteli metal ürünler keşfedin. Özel tasarım metal işçiliği, metal objeler ve endüstriyel çözümler.",
    images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "cf-turnstile-site-key": "0x4AAAAAABnin9m5fe5lKY20",
    },
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
