import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";


interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Tangent",
    title: "Kalıp Tasarımı",
    description:
      "Kullanım amacınıza uygun envai çeşit kalıbı dijital ortamda tasarlıyoruz.",
  },
  {
    icon: "Anvil",
    title: "Kalıp Üretimi",
    description:
      "Tasarımı tamamlanan kalıpları yüksek hassasiyetle üretiyor, kullanıma hazır hale getiriyoruz.",

  },
  {
    icon: "Torus",
    title: "Mastar Tel Şekillendirme",
    description:
      "İstenilen ölçü ve forma uygun mastar telleri şekillendirerek üretim süreçlerinize destek sağlıyoruz.",

  },
  {
    icon: "Bolt",
    title: "Vida Üretimi",
    description:
      "Alçıpan vidası, akıllı vida ve pul dahil olmak üzere talebe özel ölçülerde vida üretimi yapıyoruz.",
  },
  {
    icon: "Cog",
    title: "İsteğe Özel Parçalar",
    description:
      "Projenize özel parça ihtiyaçlarınızı, teknik çizime dayalı olarak üretiyoruz.",
  },
    {
    icon: "MessageSquareMore",
    title: "Ve Daha Fazlası...",
    description:
      "Hizmetlerimiz hakkında daha fazlası için bizimle iletişime geçin.",
  },
];

const FeaturesSection = () => {
  return (
    <div
      id="services"
      className="my-32 mx-auto"
      aria-label="Hizmetlerimiz ve Özellikler"
    >
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4" aria-label="Hizmetlerimiz Başlığı">
        Hizmetlerimiz
      </h2>

      <h3
        className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8"
        aria-label="Hizmetlerimiz Açıklama"
      >
        Metal işleme ve kalıp üretiminde geniş hizmet yelpazemizle, projelerinize özel çözümler sunuyoruz.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Hizmetler Listesi">
        {featureList.map(({ icon, title, description }, idx) => (
          <div key={title}>
            <Card
              className="h-full bg-background border-0 shadow-none flex flex-col items-center text-center p-6"
              aria-label={`Hizmet Kartı: ${title}`}
            >
              <CardHeader className="flex flex-col items-center gap-4 mb-4">
                <div
                  className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center ring-8 ring-primary/10"
                  aria-label={`${title} İkonu`}
                >
                  <Icon
                    name={icon as keyof typeof icons}
                    color="currentColor"
                    size={32}
                    className="text-primary"
                  />
                </div>
                <CardTitle aria-label={`Hizmet Başlığı: ${title}`}>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground" aria-label={`Hizmet Açıklaması: ${title}`}>
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturesSection; 