import AuthSection from "./sections/auth";
export default function AuthPage() {
  return (
    <div className="container">
      <div className="flex flex-col py-32 mx-auto max-w-6xl">
              <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Giriş</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hesap bilgilerinizi girerek LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.
        </p>
      </div>
        <AuthSection />
      </div>
    </div>
  );
}
