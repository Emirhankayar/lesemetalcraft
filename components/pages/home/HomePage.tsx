"use client";
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { BenefitsSectionSkeleton, ContactSectionSkeleton, FeaturesSectionSkeleton, HeroSectionSkeleton } from '@/components/alerts/skeletons';

const HeroSection = dynamic(() => import("@/components/sections/home/hero"), {
  loading: () => <HeroSectionSkeleton />,
  ssr: false
});

const BenefitsSection = dynamic(() => import("@/components/sections/home/benefits"), {
  loading: () => <BenefitsSectionSkeleton />,
  ssr: false
});

const FeaturesSection = dynamic(() => import("@/components/sections/home/features"), {
  loading: () => <FeaturesSectionSkeleton />,
  ssr: false
});

const ContactSection = dynamic(() => import("@/components/sections/home/contact"), {
  loading: () => <ContactSectionSkeleton />,
  ssr: false
});

const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px'
  });

  return <div ref={ref}>{inView ? children : null}</div>;
};

export default function HomePage() {
  return (
    <div className="container flex flex-col mx-auto gap-32">
      <div >
        <HeroSection />
        
        <LazySection>
          <BenefitsSection />
        </LazySection>
        
        <LazySection>
          <FeaturesSection />
        </LazySection>
        
        <LazySection>
          <ContactSection />
        </LazySection>
      </div>
    </div>
  );
}