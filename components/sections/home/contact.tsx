"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Map, Clock, Mail, Phone, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormData, ContactFormErrors } from "@/lib/types";

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "Kalıp Tasarımı-Üretimi",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};
    
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "İsim en az 2 karakter olmalıdır";
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Soyisim en az 2 karakter olmalıdır";
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Lütfen bir konu seçiniz";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { firstName, lastName, email, subject, message } = formData;
      
      // Create mailto link with proper encoding
      const mailToLink = `mailto:lesemetal.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Merhaba ben, ${firstName} ${lastName}, email adresim ${email}.\n\n${message}`
      )}`;
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      window.location.href = mailToLink;
      
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "Kalıp Tasarımı-Üretimi",
        message: "",
      });
      
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto py-24 sm:py-32" aria-label="İletişim Bölümü">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-bold" aria-label="İletişim Başlığı">İletişim</h2>
          </div>

          <div className="flex flex-col gap-12" aria-label="İletişim Bilgileri">
            <div>
              <div className="flex gap-2 mb-1">
                <Map aria-label="Adres İkonu" />
                <div className="font-bold">Adres</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Üçevler,+34.+Sk.+No:55,+16120+Nilüfer,+Bursa,+Türkiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block ml-1 px-4 rounded hover:bg-primary/80 transition border-2"
                  aria-label="Haritada Aç"
                >
                  Haritada Aç
                </a>
              </div>
              <div aria-label="Adres Bilgisi">Üçevler, 34. Sk. No:55, 16120 Nilüfer, Bursa, Türkiye</div>
            </div>

            <div>
              <div className="flex flex-col md:flex-row gap-2 mb-1">
                <Phone aria-label="Telefon İkonu" />
                <div className="font-bold">Telefon Numarası</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1 inline-block">
                  <a
                    href="tel:+905393301213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-28 text-center ml-1 px-4 rounded hover:bg-primary/80 border-2 transition"
                    aria-label="Telefonla Ara"
                  >
                    Ara
                  </a>
                  <a
                    href="https://wa.me/905393301213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-28 text-center px-4 rounded hover:bg-green-600 border-2 border-green-600 transition text-primary"
                    aria-label="WhatsApp ile İletişime Geç"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <span aria-label="Telefon Numarası Bilgisi">+90 539 330 12 13</span>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <Mail aria-label="Email İkonu" />
                <div className="font-bold">Email</div>
              </div>
              <div aria-label="Email Bilgisi">lesemetal.info@gmail.com</div>
            </div>

            <div>
              <div className="flex gap-2">
                <Clock aria-label="Çalışma Saatleri İkonu" />
                <div className="font-bold">Çalışma Saatleri</div>
              </div>
              <div>
                <div aria-label="Çalışma Günleri">Pazartesi - Cumartesi</div>
                <div aria-label="Çalışma Saatleri">08:00 - 18:00</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-muted/60 dark:bg-card" aria-label="İletişim Formu Kartı">
          <CardHeader className="text-primary text-2xl">
            <h3 className="text-2xl font-bold" aria-label="Mesaj Gönder Başlığı">Mesaj Gönder</h3>
            <p className="text-base text-muted-foreground" aria-label="Mesaj Gönder Açıklama">
              Formu doldurarak bizimle iletişime geçebilirsiniz.
            </p>
          </CardHeader>
          <CardContent>
            <form
              className="grid w-full gap-4"
              aria-label="İletişim Formu"
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="flex flex-col md:!flex-row gap-8">
                <div className="w-full space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    İsim
                  </label>
                  <Input 
                    id="firstName"
                    placeholder="İsim" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-destructive' : ''}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm font-medium text-destructive" role="alert">{errors.firstName}</p>
                  )}
                </div>
                <div className="w-full space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Soyisim
                  </label>
                  <Input 
                    id="lastName"
                    placeholder="Soyisim" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-destructive' : ''}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm font-medium text-destructive" role="alert">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email_adresi@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm font-medium text-destructive" role="alert">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Konu
                </label>
                <Select
                  onValueChange={(value) => handleInputChange('subject', value)}
                  value={formData.subject}
                >
                  <SelectTrigger id="subject" className={errors.subject ? 'border-destructive' : ''} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined}>
                    <SelectValue placeholder="Bir konu seçiniz." />
                  </SelectTrigger>
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
                {errors.subject && (
                  <p id="subject-error" className="text-sm font-medium text-destructive" role="alert">{errors.subject}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mesaj
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Açıklama..."
                  className="resize-none"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  aria-label="Mesaj"
                />
              </div>

              <Button 
                className="mt-4" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-label="Gönder"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    Gönder
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </section>
    </section>
  );
};

export default ContactSection;