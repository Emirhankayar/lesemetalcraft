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
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAAAAAAB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoU7UAgAAAQ"
      sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
      style={{ objectFit: "cover" }}
    />
  )
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;