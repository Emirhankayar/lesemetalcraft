import { ProductDetailSection } from "@/components/layout/sections/product-detail";
import { supabase } from "@/lib/sbClient";

const createProductMetadata = (productName: string, productDescription: string, productId: string) => {
  const title = `${productName} - LESE Metalcraft`;
  const description = `${productDescription} | LESE Metalcraft hassas metal işleme ürünleri.`;
  const url = `https://lesemetalcraft.com/magaza/${productId}`;

  return {
    title,
    description,
    keywords: [
      productName,
      "LESE Metalcraft",
      "hassas metal işleme",
      "endüstriyel ürünler",
      "özel üretim",
      "metal parçalar"
    ].join(", "),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: `${productName} - LESE Metalcraft`,
        },
      ],
      siteName: "LESE Metalcraft",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
      creator: "@lesemetalcraft",
      site: "@lesemetalcraft",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

export async function generateMetadata({ params }: { params: { productId: string } }) {
  try {
    const { data } = await supabase.rpc('get_product_with_details', {
      product_uuid: params.productId,
      user_uuid: null,
      comments_limit: 0
    });

    if (data?.product) {
      return createProductMetadata(
        data.product.name,
        data.product.description,
        params.productId
      );
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }

  // Fallback metadata
  return createProductMetadata(
    "Ürün Detayı",
    "LESE Metalcraft kaliteli metal işleme ürünleri ve özel üretim çözümleri",
    params.productId
  );
}

export default function Shop() {
  return (
    <>
      <ProductDetailSection />
    </>
  );
}