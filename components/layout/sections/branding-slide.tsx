"use client";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import Image from "next/image"; 
import leseicon from "../../icons/g14.svg";

const REPEAT_COUNT = 7; 

export const BrandingSlideComponent = () => {
  return (
    <section id="branding" className="max-w-[75%] mx-auto py-8">
      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {Array.from({ length: REPEAT_COUNT }).map((_, index) => (
            <div
              key={index}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Image
                src={leseicon}
                alt={`Branding ${index + 1}`}
                width={100}
                height={32}
                className="mr-16"
              />
              • •
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
