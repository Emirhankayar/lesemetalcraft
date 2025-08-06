import { Metadata } from "next";
import { supabase } from "@/lib/sbClient";
import ProductDetailPage from "@/components/layout/product-page";

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
    maxVideoPreview: -1,
    maxImagePreview: "large", 
    maxSnippet: -1,
  },
},

  };
};

export async function generateMetadata(
  { params }: { params: Promise<{ productId: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const { data } = await supabase.rpc('get_product_with_details', {
      product_uuid: resolvedParams.productId,
      user_uuid: null,
      comments_limit: 0
    });

    if (data?.product) {
      return createProductMetadata(
        data.product.name,
        data.product.description,
        resolvedParams.productId
      );
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }

  return createProductMetadata(
    "Ürün Detayı",
    "LESE Metalcraft kaliteli metal işleme ürünleri ve özel üretim çözümleri",
    resolvedParams.productId
  );
}

export default function Shop() {
  return (
    <>
      <ProductDetailPage />
    </>
  );
}
