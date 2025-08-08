import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cloneElement, ReactNode, isValidElement } from "react";

type AuthAlertProps = {
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  icon?: ReactNode;
};

export function AuthAlert({
  description = "Alışveriş sepetinizi görüntülemek için lütfen giriş yapın.",
  buttonText = "Giriş Yap",
  buttonHref = "/auth",
  icon,
}: AuthAlertProps) {
  const iconElement =
    icon && isValidElement(icon)
      ? cloneElement(
          icon as React.ReactElement<any>,
          {
            className:
              "h-16 w-16 text-muted-foreground mx-auto my-8 " +
              ((icon as React.ReactElement<any>).props.className || ""),
          }
        )
      : <Info className="h-16 w-16 text-muted-foreground mx-auto my-8" />;

  return (
    <section className="container mx-auto max-w-3xl py-24 px-4">
      <Alert>
        <AlertDescription className="text-center flex flex-col justify-center items-center py-8">
          {iconElement}
          <h3 className="text-xl font-semibold mb-2">
            - Giriş Gereklidir -
          </h3>
          <p className="text-muted-foreground">{description}</p>
          <Link href={buttonHref}>
            <Button
              variant="outline"
              style={{ backgroundColor: "#3235d1", color: "white", borderColor: "#3235d1" }}
              className="text-base hover:opacity-90 transition mt-8 w-full"
            >
              {buttonText}
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    </section>
  );
}