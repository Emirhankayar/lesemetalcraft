"use client";

import { Button } from "@/components/ui/button";
import { User, Store, Send} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();

  return (
    
      <section className="grid place-items-center lg:max-w-screen-xl gap-10 mx-auto py-20 md:py-32 px-4">
<div className="space-y-8 text-center w-full">
  {/* Mobile Heading */}
  <div className="text-3xl sm:text-4xl font-bold leading-tight md:hidden">
    <h1 className="flex flex-wrap justify-center gap-x-2 gap-y-2">
      <span>Metalde</span>
      <span className="text-transparent bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">Güven</span>
      <span>ve</span>
      <span className="text-transparent bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">Kalite</span>
      <span>Odaklı</span>
      <span>Hizmetler</span>
    </h1>
  </div>

  {/* Desktop Heading */}
  <div className="hidden md:block text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto">
    <h1>
      Metalde{" "}
      <span className="text-transparent bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">
        Güven
      </span>{" "}
      ve{" "}
      <span className="text-transparent bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">
        Kalite
      </span>{" "}
      Odaklı Hizmetler
    </h1>
  </div>

  {/* Subtext */}
  <p className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
    Tüm metal ürünleriniz için özel tasarım çözümler sunuyoruz. Kalıptan vidaya, hassas üretim ve güvenilir kaliteyle.
  </p>

  {/* Button */}
  <div className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
    <Link href="/auth">
      <Button className="bg-blue-200 font-bold group/arrow">
        Hesap Oluştur
        <User className="size-5 ml-2 group-hover/arrow:translate-y-1 transition-transform" />
      </Button>
    </Link>
    <Link href="/magaza?page=1&limit=10">
      <Button className="bg-pink-200 font-bold group/arrow">
        Mağazaya Git
        <Store className="size-5 ml-2 group-hover/arrow:translate-y-1 transition-transform" />
      </Button>
    </Link>
    <Link href="#contact">
      <Button className="bg-green-200 font-bold group/arrow">
        İletişime Geç
        <Send className="size-5 ml-2 group-hover/arrow:translate-y-1 transition-transform" />
      </Button>
    </Link>
  </div>
</div>


        {/* Video Section */}
        <div className="relative group mt-14 w-full px-4">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <video
            className="w-full max-w-[1200px] mx-auto rounded-lg relative border border-t-2 border-secondary border-t-primary/30"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={theme === "light" ? "/hero.mp4" : "/hero.mp4"} type="video/mp4" />
            Tarayıcınızın video desteği yok.
          </video>
          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </section>

  );
};
