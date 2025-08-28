"use client";
import { memo } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  isLCP?: boolean;
  className?: string;
}

const BLUR_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const OptimizedImage = memo(
  ({
    src,
    alt,
    width = 400,
    height = 400,
    isLCP = false,
    className = "",
  }: OptimizedImageProps) => (
    <Image
      src={src || "/placeholder-product.jpg"}
      alt={alt}
      width={width}
      height={height}
      priority={isLCP}
      className={className}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
      style={{ objectFit: "cover" }}
    />
  )
);

OptimizedImage.displayName = "OptimizedImage";
export default OptimizedImage;
