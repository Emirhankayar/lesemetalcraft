import { ProductList } from "@/components/layout/sections/product-list";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 10;
  
  const baseTitle = "Mağaza - LESE Metalcraft";
  const baseDescription = "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.";
  
  const title = page > 1 
    ? `${baseTitle} - Sayfa ${page}`
    : baseTitle;
    
  const description = page > 1 
    ? `${baseDescription} Sayfa ${page} - ${limit} ürün gösteriliyor.`
    : baseDescription;
    
  const baseUrl = "https://lesemetalcraft.com/magaza";
  const searchParamsString = new URLSearchParams();
  
  if (page > 1) searchParamsString.set("page", page.toString());
  if (limit !== 10) searchParamsString.set("limit", limit.toString());
  
  const canonicalUrl = searchParamsString.toString() 
    ? `${baseUrl}?${searchParamsString.toString()}`
    : baseUrl;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "LESE Metalcraft - Mağaza",
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
      creator: "@lesemetalcraft",
      site: "@lesemetalcraft",
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
  };
}

export default async function ProductListPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <ProductList />
    </>
  );
}
