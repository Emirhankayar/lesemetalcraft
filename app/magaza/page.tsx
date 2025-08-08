import { Metadata } from "next";
import { getShopPageMetadata } from "@/data/loaders";
import ShopPage from "@/components/pages/shop/ShopPage";

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 12;

  const metadata = await getShopPageMetadata(page, limit);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
      url: `https://lesemetalcraft.com/magaza${
        page > 1 ? `?page=${page}` : ""
      }`,
      siteName: "LESE Metalcraft",
      images: [
        {
          url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "LESE Metalcraft Mağaza",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: ["https://www.lesemetalcraft.com/android-chrome-512x512.png"],
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
}

export default async function Shop({ searchParams }: Props) {
  return (
    <div className="container">
      <section
        id="product"
        className="flex flex-col py-32 mx-auto max-w-6xl"
        aria-label="Ürünlerimiz"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ürünlerimiz
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kalite ve değer açısından özenle seçilmiş, özel ürün koleksiyonumuzu
            keşfedin.
          </p>
        </div>
        <ShopPage />
      </section>
    </div>
  );
}
