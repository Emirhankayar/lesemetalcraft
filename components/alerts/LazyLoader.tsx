import { Loader2 } from "lucide-react";

interface LazyLoaderProps {
  className?: string;
}

export default function LazyLoader({ className = "h-96" }: LazyLoaderProps) {
  return (
    <div className={`${className} bg-transparent animate-pulse rounded-lg flex items-center justify-center mt-32`}>
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}