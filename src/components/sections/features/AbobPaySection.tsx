import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader, SectionWrapper } from "@/components/ui/layouts";
import { Wallet, Target, BookMarked, FileCheck, Download, Smartphone } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const abobPayImage = PlaceHolderImages.find(img => img.id === 'abob-pay-mockup');

const features = [
  { icon: <Wallet className="h-6 w-6 text-primary" />, title: "Billetera Bimonetaria", description: "Gestiona Bolivianos (Bs) y ABOB en un solo lugar." },
  { icon: <Target className="h-6 w-6 text-primary" />, title: "Ahorro por Metas", description: "Automatiza tus ahorros y protégelos con stablecoins." },
  { icon: <BookMarked className="h-6 w-6 text-primary" />, title: "Libro Digital Contable", description: "Registro inmutable de tus transacciones para MYPEs." },
  { icon: <FileCheck className="h-6 w-6 text-primary" />, title: "Historial Crediticio On-Chain", description: "Construye un perfil financiero auditable y transparente." },
];

export default function AbobPaySection() {
  return (
    <SectionWrapper id="abob-pay">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <SectionHeader
            badge="La App"
            title="ABOB-Pay: Tu Centro Financiero"
            description="Una aplicación diseñada para la vida real, que combina la simplicidad de uso con el poder de la tecnología blockchain."
            variant="left"
            size="lg"
          />

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-accent p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Smartphone className="mr-2 h-5 w-5" />
              Descargar APK (Testnet)
            </Button>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Documentación
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-[320px] h-[640px] bg-slate-800 rounded-[40px] border-[14px] border-slate-900 shadow-2xl">
            {abobPayImage && (
              <Image
                src={abobPayImage.imageUrl}
                alt={abobPayImage.description}
                width={320}
                height={640}
                className="absolute inset-0 w-full h-full object-cover rounded-[26px]"
                data-ai-hint={abobPayImage.imageHint}
              />
            )}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-lg"></div>
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}