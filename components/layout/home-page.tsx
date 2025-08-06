"use client";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/layout/sections/hero";

const BenefitsSection = dynamic(
  () => import("@/components/layout/sections/benefits").then((mod) => mod.BenefitsSection),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
  }
);

const FeaturesSection = dynamic(
  () => import("@/components/layout/sections/features").then((mod) => mod.FeaturesSection),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
  }
);

const ContactSection = dynamic(
  () => import("@/components/layout/sections/contact").then((mod) => mod.ContactSection),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />
  }
);

export default function HomePage() {
  return (
    <div className="container">
      <div className="flex flex-col py-32 mx-auto max-w-6xl gap-32">

      {/* Load hero immediately - it's above the fold */}
      <HeroSection />
      
      {/* Lazy load below-the-fold content */}
      <BenefitsSection />
      <FeaturesSection />
      <ContactSection />
      </div>
    </div>
  );
}