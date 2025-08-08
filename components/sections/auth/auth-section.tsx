"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/sbClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthSection() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectTo(`${window.location.origin}/`);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.replace("/");
      }
      if (event === "SIGNED_OUT") {
        router.replace("/auth");
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);
  return (
      <section className="container flex items-center justify-center mx-auto">
      <div className="w-full max-w-md shadow-xl p-6 rounded-lg border bg-card text-card-foreground outline">
        {redirectTo && (
          <Auth
            supabaseClient={supabase}
            providers={["google"]}
            redirectTo={redirectTo}
            localization={{
            variables: {
              sign_up: {
                email_label: "E-posta adresi",
                password_label: "Şifre",
                email_input_placeholder: "E-posta adresiniz",
                password_input_placeholder: "Şifreniz",
                button_label: "Kaydol",
                loading_button_label: "Kaydoluyor...",
                social_provider_text: "{{provider}} ile devam et",
                link_text: "Hesabınız yok mu? Kaydolun",
                confirmation_text: "E-posta adresinizi kontrol edin"
              },
              sign_in: {
                email_label: "E-posta adresi",
                password_label: "Şifre",
                email_input_placeholder: "E-posta adresiniz",
                password_input_placeholder: "Şifreniz",
                button_label: "Giriş Yap",
                loading_button_label: "Giriş yapılıyor...",
                social_provider_text: "{{provider}} ile giriş yap",
                link_text: "Zaten hesabınız var mı? Giriş yapın",
              },
              magic_link: {
                email_input_label: "E-posta adresi",
                email_input_placeholder: "E-posta adresiniz",
                button_label: "Sihirli bağlantı gönder",
                loading_button_label: "Sihirli bağlantı gönderiliyor...",
                link_text: "Sihirli bağlantı ile giriş yap",
                confirmation_text: "Sihirli bağlantı için e-postanızı kontrol edin"
              },
              forgotten_password: {
                email_label: "E-posta adresi",
                password_label: "Şifre",
                email_input_placeholder: "E-posta adresiniz",
                button_label: "Şifre sıfırlama talimatları gönder",
                loading_button_label: "Gönderiliyor...",
                link_text: "Şifrenizi mi unuttunuz?",
                confirmation_text: "Şifre sıfırlama talimatları için e-postanızı kontrol edin"
              },
              update_password: {
                password_label: "Yeni şifre",
                password_input_placeholder: "Yeni şifreniz",
                button_label: "Şifreyi güncelle",
                loading_button_label: "Şifre güncelleniyor...",
                confirmation_text: "Şifreniz başarıyla güncellendi"
              },
              verify_otp: {
                email_input_label: "E-posta adresi",
                email_input_placeholder: "E-posta adresiniz",
                phone_input_label: "Telefon numarası",
                phone_input_placeholder: "Telefon numaranız",
                token_input_label: "Doğrulama kodu",
                token_input_placeholder: "Doğrulama kodunuz",
                button_label: "Doğrula",
                loading_button_label: "Doğrulanıyor..."
              }
            }
          }}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",         
                  brandAccent: "hsl(var(--primary))",   
                  inputBackground: "hsl(var(--background))",
                  inputText: "hsl(var(--foreground))",
                  inputBorder: "hsl(var(--border))",
                  inputBorderFocus: "hsl(var(--primary))",
                  inputBorderHover: "hsl(var(--primary))",
                  
                  
                  
                },
              },
            },
            className: {
              container: "space-y-4"},
 }}
          />
        )}
      </div>
    </section>
  );
}
