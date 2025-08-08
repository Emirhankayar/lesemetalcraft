import { memo } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Heart, MessageCircle, Eye } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PopularProductsSkeleton = memo(() => {
  return (
    <div className="mb-8" aria-label="Popüler Ürünler Yükleniyor">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="w-full">
        <div className="-ml-2 md:-ml-4">
          <div className="flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 flex-shrink-0"
              >
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <Skeleton className="h-4 mb-1 w-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2 sm:hidden">
          <p className="text-xs text-muted-foreground">
            ← Kaydırarak daha fazla ürün görebilirsiniz →
          </p>
        </div>
      </div>
    </div>
  );
});

PopularProductsSkeleton.displayName = "PopularProductsSkeleton";

export const PaginationControlsSkeleton = memo(() => {
  return (
    <div className="space-y-4 mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
        <div className="text-sm flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <span>-</span>
          <Skeleton className="h-4 w-8" />
          <span>/</span>
          <Skeleton className="h-4 w-12" />
          <span>sonuç</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span>Göster:</span>
          <div className="w-16 h-8 border rounded-md flex items-center justify-center">
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto">
        <div className="h-8 px-3 mr-2 sm:mr-4 border rounded-md flex items-center justify-center flex-shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-1 min-w-0 overflow-x-auto">
          {/* Mobile: fewer pages */}
          <div className="flex sm:hidden items-center gap-1">
            <Skeleton className="h-8 w-8 flex-shrink-0" />
            <Skeleton className="h-8 w-8 flex-shrink-0" />
            <div className="px-2 text-gray-500 flex-shrink-0">...</div>
            <Skeleton className="h-8 w-8 flex-shrink-0" />
          </div>
          
          {/* Desktop: more pages */}
          <div className="hidden sm:flex items-center gap-1">
            <Skeleton className="h-8 w-8 flex-shrink-0" />
            <Skeleton className="h-8 w-8 flex-shrink-0" />
            <Skeleton className="h-8 w-8 flex-shrink-0" />
            <div className="px-2 text-gray-500 flex-shrink-0">...</div>
            <Skeleton className="h-8 w-8 flex-shrink-0" />
          </div>
        </div>

        <div className="h-8 px-3 ml-2 sm:ml-4 border rounded-md flex items-center justify-center flex-shrink-0">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
});

PaginationControlsSkeleton.displayName = "PaginationControlsSkeleton";

export const ProductCardSkeleton = memo(() => {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <Skeleton className="h-6 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full h-10 flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
});

ProductCardSkeleton.displayName = "ProductCardSkeleton";

export const ProductDisplaySkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Gallery Section */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Skeleton className="w-full h-full" />
          {/* Featured Badge Skeleton */}
          <Skeleton className="absolute top-4 left-4 h-6 w-16 rounded-md" />
          {/* Navigation Buttons */}
          <Skeleton className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-md" />
          <Skeleton className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-md" />
        </div>
        
        {/* Thumbnail Images */}
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-20 h-20 rounded-md" />
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
        </div>

        {/* Price */}
        <Skeleton className="h-10 w-32" />

        {/* Variant Selection */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <div className="grid grid-cols-1 gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="p-3 rounded-lg border border-muted">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-12" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
          {/* Price Section */}
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-11 rounded-md" />
          <Skeleton className="h-11 w-11 rounded-md" />
        </div>

        {/* Cart Info Alert */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 rounded mt-0.5" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Product Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export const ProductCommentsSkeleton = ({
  showCommentForm = true,
  commentCount = 3
}) => {
  return (
    <div className="mt-16 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between sx:justify-start">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-1 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          
          {/* Rating Section */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-6 w-6 rounded" />
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="text-right">
              <Skeleton className="h-3 w-20 ml-auto" />
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-32 rounded-md" />
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {Array.from({ length: commentCount }, (_, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Skeleton key={i} className="h-3 w-3 rounded" />
                        ))}
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Skeleton key={i} className="h-4 w-4 rounded" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Comment Text */}
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Action Buttons (Hidden but keeping structure) */}
                <div className="flex items-center gap-4 pt-2 mt-2">
                  <Skeleton className="h-3 w-12 hidden" />
                  <Skeleton className="h-3 w-12 hidden" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ContactSectionSkeleton = memo(() => {
  return (
    <div className="mt-20">
    <section className="container mx-auto py-24 sm:py-32 relative max-w-6xl">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* İletişim title */}
          <div className="mb-4">
            <Skeleton className="h-10 w-32" /> {/* text-3xl md:text-4xl */}
          </div>

          <div className="flex flex-col gap-12">
            {/* Address */}
            <div>
              <div className="flex gap-2 mb-1">
                <Skeleton className="h-6 w-6" /> {/* Map icon */}
                <Skeleton className="h-6 w-12" /> {/* "Adres" */}
                <Skeleton className="h-8 w-24 rounded" /> {/* "Haritada Aç" button */}
              </div>
              <Skeleton className="h-5 w-80" /> {/* Address text */}
            </div>

            {/* Phone */}
            <div>
              <div className="flex flex-col md:flex-row gap-2 mb-1">
                <Skeleton className="h-6 w-6" /> {/* Phone icon */}
                <Skeleton className="h-6 w-32" /> {/* "Telefon Numarası" */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded" /> {/* "Ara" button */}
                  <Skeleton className="h-8 w-20 rounded" /> {/* "WhatsApp" button */}
                </div>
              </div>
              <Skeleton className="h-5 w-36" /> {/* Phone number */}
            </div>

            {/* Email */}
            <div>
              <div className="flex gap-2 mb-1">
                <Skeleton className="h-6 w-6" /> {/* Mail icon */}
                <Skeleton className="h-6 w-12" /> {/* "Email" */}
              </div>
              <Skeleton className="h-5 w-48" /> {/* Email address */}
            </div>

            {/* Working Hours */}
            <div>
              <div className="flex gap-2 mb-1">
                <Skeleton className="h-6 w-6" /> {/* Clock icon */}
                <Skeleton className="h-6 w-28" /> {/* "Çalışma Saatleri" */}
              </div>
              <Skeleton className="h-5 w-40 mb-1" /> {/* "Pazartesi - Cumartesi" */}
              <Skeleton className="h-5 w-24" /> {/* "08:00 - 18:00" */}
            </div>
          </div>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="text-primary text-2xl">
            <Skeleton className="h-8 w-32" /> {/* "Mesaj Gönder" */}
            <Skeleton className="h-5 w-64" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              {/* Name fields */}
              <div className="flex flex-col md:!flex-row gap-8 h-96">
               

              <Skeleton className="h-10 w-20 mt-4" /> {/* Submit button */}
            </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </section>
    </section>
    </div>
  );
});

export const HeroSectionSkeleton = memo(() => {
  return (
    <div className="grid place-items-center z-0 lg:max-w-screen-xl gap-10 mx-auto py-20 md:py-32 px-4">
      <div className="space-y-6 text-center w-full">        
        <div className="">
          <div className="text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            <div className="space-y-2 ">
              <div className="flex flex-wrap justify-center gap-4">
                <Skeleton className="h-12 lg:h-16 w-4/5" />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Skeleton className="h-12 lg:h-16 w-2/4" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md md:max-w-xl lg:max-w-2xl flex-col flex w-full justify-center items-center mx-auto">
          <Skeleton className="h-6 sm:h-7 w-4/5 mb-2" />
          <Skeleton className="h-6 sm:h-7 w-3/5" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <Skeleton className="h-10 w-32" /> 
          <Skeleton className="h-10 w-28" /> 
          <Skeleton className="h-10 w-32" /> 
        </div>
      </div>

      {/* Video Section */}
      <div className="relative group mt-14 w-full px-4 hidden sm:block mt-10">
        <Skeleton className="w-full max-w-5xl max-h-[900px] md:h-96 sm:max-h-128 mx-auto rounded-lg" />
      </div>
    </div>
  );
});

export const FeaturesSectionSkeleton = memo(() => {
  return (
    <div className="my-20">

    <section className="container py-24 sm:py-32 mx-auto max-w-6xl">
      <Skeleton className="h-10 md:h-12 w-48 mx-auto mb-4" /> 
      
      <div className="md:w-1/2 mx-auto mb-8">
        <Skeleton className="h-7 w-full mb-2" /> {/* text-xl subtitle line 1 */}
        <Skeleton className="h-7 w-3/4 mx-auto" /> {/* text-xl subtitle line 2 */}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card
          key={idx}
          className="h-full bg-background border-0 shadow-none flex flex-col items-center text-center p-6"
          >
            <CardHeader className="flex flex-col items-center gap-4 mb-4">
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center ring-8 ring-primary/10">
                <Skeleton className="w-8 h-8" />
              </div>
              <Skeleton className="h-6 w-32" /> {/* CardTitle */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
        </div>
  );
});

export const BenefitsSectionSkeleton = memo(() => {
  return (
    <div className="my-20">
    <section className="container mx-auto py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 lg:gap-24">
        <div>
          <Skeleton className="h-10 md:h-12 w-2/3 mb-6" /> {/* "Hakkımızda" text-3xl md:text-4xl */}
          
          {/* First paragraph - text-xl */}
          <div className="mb-4 space-y-6">
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-7 w-2/5" />
            <Skeleton className="h-7 w-3/5" />
          </div>
          
          
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Skeleton className="w-8 h-8 mb-6" /> {/* Icon */}
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>
                <Skeleton className="h-6 w-32" /> {/* CardTitle */}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
});

ContactSectionSkeleton.displayName = "ContactSectionSkeleton";
HeroSectionSkeleton.displayName = "HeroSectionSkeleton";
FeaturesSectionSkeleton.displayName = "FeaturesSectionSkeleton";
BenefitsSectionSkeleton.displayName = "BenefitsSectionSkeleton";
BenefitsSectionSkeleton.displayName = "BenefitsSectionSkeleton";
ProductCommentsSkeleton.displayName = 'ProductCommentsSkeleton';
ProductCardSkeleton.displayName = 'ProductCardSkeleton';
ProductDisplaySkeleton.displayName = 'ProductDisplaySkeleton';
PopularProductsSkeleton.displayName = 'PopularProductsSkeleton';
PaginationControlsSkeleton.displayName = 'PaginationControlsSkeleton';
