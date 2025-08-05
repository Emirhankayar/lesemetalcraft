"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/sbClient";
import { ProductCard } from "@/components/ui/product-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ProductsResponse } from "@/lib/types";

export const ProductList = () => {
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Math.max(
    0,
    parseInt(searchParams.get("page") || "1") - 1
  );
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const updateURL = (newPage: number, newPageSize?: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage === 0) {
      params.delete("page");
    } else {
      params.set("page", (newPage + 1).toString());
    }

    if (newPageSize !== undefined) {
      if (newPageSize === 10) {
        params.delete("limit");
      } else {
        params.set("limit", newPageSize.toString());
      }
    }

    const newUrl = params.toString()
      ? `/magaza?${params.toString()}`
      : "/magaza?page=1&limit=10";
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase.rpc("get_shop_products", {
          page_limit: pageSize,
          page_offset: currentPage * pageSize,
        });

        if (data) {
          setProducts(data as ProductsResponse);
        }

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data);
          console.log("Products:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize]);

  const handleNextPage = () => {
    if (products?.pagination?.has_next) {
      updateURL(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      updateURL(currentPage - 1);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const newPageSize = Number(newSize);
    updateURL(0, newPageSize);
  };
  const handlePageJump = (pageNumber: number) => {
    updateURL(pageNumber);
  };
  const totalPages = products?.pagination
    ? Math.ceil(products.pagination.total_count / pageSize)
    : 0;

  if (loading || !products) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading products list...</p>
      </section>
    );
  }

  return (
    <section id="product" className="container mx-auto px-4 py-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Our Products</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our curated collection of premium products, carefully
          selected for quality and value.
        </p>
      </div>

      {products?.pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={products.pagination.total_count}
          hasNextPage={products.pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}

      {/* Products Grid */}
      {products?.products?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              userAuthenticated={products.user_authenticated}
            />
          ))}
        </div>
      ) : (
        <Alert className="my-8">
          <AlertDescription className="text-center py-8">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or check back later.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Pagination */}
      {products?.pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={products.pagination.total_count}
          hasNextPage={products.pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}
    </section>
  );
};
