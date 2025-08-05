"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Map, Clock, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "Kalıp Tasarımı-Üretimi",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    console.log(values);

    const mailToLink = `mailto:lesemetal.info@gmail.com?subject=${subject}&body=Merhaba ben, ${firstName} ${lastName}, email adresim ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
  }

  return (
    <section id="contact" className="container mx-auto py-24 sm:py-32">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">İletişim</h2>
          </div>


          <div className="flex flex-col gap-12">
            <div>
              <div className="flex gap-2 mb-1 ">
                <Map />
                <div className="font-bold">Adres</div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Üçevler,+34.+Sk.+No:55,+16120+Nilüfer,+Bursa,+Türkiye"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block ml-1 px-4 rounded hover:bg-primary/80 transition border-2"

              >
                Haritada Aç
              </a>
              </div>
              <div>Üçevler, 34. Sk. No:55, 16120 Nilüfer, Bursa, Türkiye</div>

            
            </div>

<div>
  <div className="flex flex-col md:flex-row gap-2 mb-1">
    <Phone />
    <div className="font-bold">Telefon Numarası</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1 inline-block">
    <a
      
      href="tel:+905393301213"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-28 text-center ml-1 px-4 rounded hover:bg-primary/80 border-2 transition"
      >
      Ara
    </a>
    <a
      href="https://wa.me/905393301213"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-28 text-center px-4 rounded hover:bg-green-600 border-2 border-green-600 transition text-primary"
      >
      WhatsApp
    </a>
      </div>
  </div>
  +90 539 330 12 13
</div>



            <div>
              <div className="flex gap-2 mb-1">
                <Mail />
                <div className="font-bold">Email</div>
              </div>

              <div>lesemetal.info@gmail.com</div>
            </div>

            <div>
              <div className="flex gap-2">
                <Clock />
                <div className="font-bold">Çalışma Saatleri</div>
              </div>

              <div>
                <div>Pazartesi - Cumartesi</div>
                <div>08:00 - 18:00</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="text-primary text-2xl"> </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <div className="flex flex-col md:!flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>İsim</FormLabel>
                        <FormControl>
                          <Input placeholder="İsim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Soyisim</FormLabel>
                        <FormControl>
                          <Input placeholder="Soyisim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email_adresi@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konu</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bir konu seçiniz." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kalıp Tasarımı-Üretimi">
                              Kalıp Tasarımı-Üretimi
                            </SelectItem>
                            <SelectItem value="Mastar Tel Şekillendirme">
                              Mastar Tel Şekillendirme
                            </SelectItem>
                            <SelectItem value="Vida Üretimi">
                              Vida Üretimi
                            </SelectItem>
                            <SelectItem value="İsteğe Özel Parçalar">
                              İsteğe Özel Parçalar
                            </SelectItem>
                            <SelectItem value="Bilgi Edinmek İstiyorum">
                              Bilgi Edinmek İstiyorum
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Açıklama..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="mt-4">Gönder</Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </section>
    </section>
  );
};
