import { Metadata } from "next";
import { getProductMetadata } from "@/data/loaders";
import ProductDetailPage from "@/components/pages/product/ProductPage";

interface Props {
  params: Promise<{ productId: string }>;
}

interface ImageMetadata {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;

  const metadata = await getProductMetadata(productId);

  if (!metadata) {
    console.log("No metadata found");
    return {
      title: "Ürün Bulunamadı - LESE Metalcraft",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  console.log("Metadata title:", metadata.title);

  const baseMetadata: Metadata = {
    title: metadata.title || "LESE Metalcraft",
    description: metadata.description || "LESE Metalcraft ürün sayfası",
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title || "LESE Metalcraft",
      description: metadata.description || "LESE Metalcraft ürün sayfası",
      type: "website",
      url: `https://lesemetalcraft.com/magaza/${productId}`,
      siteName: "LESE Metalcraft",
      images:
        metadata.images?.map((img: ImageMetadata) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          alt: img.alt,
        })) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title || "LESE Metalcraft",
      description: metadata.description || "LESE Metalcraft ürün sayfası",
      images: metadata.images?.map((img: ImageMetadata) => img.url) || [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  if (metadata.price && metadata.currency) {
    baseMetadata.other = {
      "product:price:amount": metadata.price.toString(),
      "product:price:currency": metadata.currency,
      "product:availability": metadata.availability || "in_stock",
    };
  }

  return baseMetadata;
}

export default async function ProductPage({ params }: Props) {
  return (
    <div className="container">
      <section
        id="product"
        className="flex flex-col py-32 mx-auto max-w-6xl"
        aria-label="Ürün Detayları"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ürün Detayları
          </h2>
        </div>
        <ProductDetailPage />
      </section>
    </div>
  );
}
