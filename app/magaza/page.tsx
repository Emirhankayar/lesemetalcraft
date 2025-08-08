import ShopPage from "@/components/pages/shop/ShopPage";


export default async function ProductListPage() {
  return ( 
    <>
    <div className="container">
      <section id="product" className="flex flex-col py-32 mx-auto max-w-6xl" aria-label="Ürünlerimiz">
            <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ürünlerimiz
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kalite ve değer açısından özenle seçilmiş, özel ürün
            koleksiyonumuzu keşfedin.
          </p>
        </div>
        <ShopPage /> 
      </section>
    </div>
    </>
  );
}

