import { Separator } from "@/components/ui/separator";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
        <Separator className="my-6" />
        <div
        className="text-center text-sm text-muted-foreground">
          <p>
          © 2025 Lese Metalcraft Ltd. Şti. Tüm hakları saklıdır.
          </p>
        </div>
    </footer>
  );
};
