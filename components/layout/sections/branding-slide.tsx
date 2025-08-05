"use client";
import Image from "next/image";
import leseicon from "../../icons/g14.svg";

const REPEAT_COUNT = 7;

export const BrandingSlideComponent = () => {
  return (
    <section id="branding" className="w-full mx-auto py-4">
      <div className="mx-auto overflow-hidden relative">
        <div className="flex animate-marquee hover:pause-marquee">
          {Array.from({ length: REPEAT_COUNT }).map((_, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center text-xl md:text-2xl font-medium whitespace-nowrap flex-shrink-0 mx-8"
            >
              <Image
                src={leseicon}
                alt={`Branding ${index + 1}`}
                width={100}
                height={32}
                className="mr-12"
              />
            </div>
          ))}
          {Array.from({ length: REPEAT_COUNT }).map((_, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center text-xl md:text-2xl font-medium whitespace-nowrap flex-shrink-0 mx-8"
            >
              <Image
                src={leseicon}
                alt={`Branding duplicate ${index + 1}`}
                width={100}
                height={32}
                className="mr-12"
              />
            </div>
          ))}
        </div>
        
        {/* Fade effect on edges */}
        <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10"></div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};