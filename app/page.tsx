import { BenefitsSection } from "@/components/layout/sections/benefits";
import { ContactSection } from "@/components/layout/sections/contact";
import { FeaturesSection } from "@/components/layout/sections/features";
import { HeroSection } from "@/components/layout/sections/hero";


export const metadata = {
  title: "LESE - Metalcraft",
  description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com",
    title: "LESE - Metalcraft",
    description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE - Metalcraft",
      },
    ],
  },
};


export default function Home() {
  return (
    <>
    <div id="main" className="container mx-auto px-4 py-32 max-w-6xl">

      <HeroSection />
      {/* <SponsorsSection /> */}
      <BenefitsSection />
      <FeaturesSection />
      {/* <ServicesSection /> */}
      {/* <TestimonialSection /> */}
      {/*<TeamSection />*/}

  
      <ContactSection />
      {/*<FAQSection />*/}
    </div>
    </>
  );
}
