import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "Kaliteli İşçilik",
    description:
      "Her detayda özenli ve dayanıklı üretim.",
  },
  {
    icon: "PocketKnife",
    title: "Kişiye Özel Çözümler",
    description:
      "İhtiyacınıza uygun özel tasarım ve üretim.",
  },
  {
    icon: "Clock",
    title: "Zamanında Teslimat",
    description:
    "Söz verdiğimiz zamanda, eksiksiz teslimat.",
  },
  {
    icon: "CirclePercent",
    title: "Esnek Üretim",
    description:
       "Küçükten büyüğe geniş yelpazede üretim desteği.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="about" className="container mx-auto py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
        

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hakkımızda
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Sektördeki 42 yıllık uzmanlığımızı, LESE Metalcraft Ltd. Şti. markamız altında üretim ve inovasyonla birleştirdik.

          
          </p>
          <p className="text-xl text-muted-foreground mb-8">Kalıp tasarımı, özel vida üretimi, mastar tel şekillendirme ve isteğe özel parça imalatı gibi alanlarda yüksek hassasiyetle çalışıyor, hem küçük ölçekli hem de büyük projelere çözüm sunuyoruz. Kaliteli işçilik, zamanında teslimat ve müşteri memnuniyeti temel önceliklerimizdir.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
