"use client";
import { useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShopProducts } from "@/data/loaders";

import dynamic from "next/dynamic";
import { PopularProductsSkeleton, ProductCardSkeleton, PaginationControlsSkeleton } from "@/components/alerts/skeletons";

const PopularProducts = dynamic(() => import("@/components/sections/shop/product-popular-carousel"), {
  loading: () => <PopularProductsSkeleton />,
  ssr: false
});
const ProductCard = dynamic(() => import("@/components/sections/shop/product-card"), {
  loading: () => <ProductCardSkeleton />,
  ssr: false
});
const PaginationControls = dynamic(() => import("@/components/sections/shop/pagination-controls"), {
  loading: () => <PaginationControlsSkeleton />,
  ssr: false
});

const ShopPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
    [searchParams]
  );
  
  const pageSize = useMemo(
    () => parseInt(searchParams.get("limit") || "12"),
    [searchParams]
  );

  const { data: products, isLoading, error } = useShopProducts({ 
    currentPage, 
    pageSize 
  });

  const productsList = products?.products ?? [];
  const pagination = products?.pagination;
  const userAuthenticated = products?.user_authenticated ?? false;
  const totalPages = pagination ? Math.ceil(pagination.total_count / pageSize) : 0;

  const updateURL = useCallback(
    (newPage: number, newPageSize?: number) => {
      const params = new URLSearchParams(searchParams);
      
      if (newPage === 0) {
        params.delete("page");
      } else {
        params.set("page", (newPage + 1).toString());
      }
      
      if (newPageSize !== undefined) {
        if (newPageSize === 12) {
          params.delete("limit");
        } else {
          params.set("limit", newPageSize.toString());
        }
      }
      
      const newUrl = params.toString() ? `/magaza?${params.toString()}` : "/magaza";
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  const handleNextPage = () => {
    if (pagination?.has_next) {
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <>
      <PopularProducts maxResults={8} autoplayDelay={3000} />

      {pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={pagination.total_count || 0}
          hasNextPage={pagination.has_next || false}
          loading={isLoading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}

      {productsList.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          aria-label="Ürün Listesi"
        >
          {productsList.map((product: any, index: number) => (
            <ProductCard
              key={product.id}
              product={product}
              userAuthenticated={userAuthenticated}
              isLCP={index === 0}
              priority={index < 4}
            />
          ))}
        </div>
      )}

      {pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={pagination.total_count || 0}
          hasNextPage={pagination.has_next || false}
          loading={isLoading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}
    </>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<PopularProductsSkeleton />}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;