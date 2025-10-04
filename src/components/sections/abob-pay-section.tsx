import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, Target, BrainCircuit, BookMarked, FileCheck, Download } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import AndeAprendeSection from "./ande-aprende-section";

const abobPayImage = PlaceHolderImages.find(img => img.id === 'abob-pay-mockup');

const features = [
  { icon: <Wallet className="h-6 w-6 text-accent" />, title: "Billetera Bimonetaria", description: "Gestiona Bolivianos (Bs) y ABOB en un solo lugar." },
  { icon: <Target className="h-6 w-6 text-accent" />, title: "Ahorro por Metas", description: "Automatiza tus ahorros y protégelos con stablecoins." },
  { icon: <BookMarked className="h-6 w-6 text-accent" />, title: "Libro Digital Contable", description: "Registro inmutable de tus transacciones para MYPEs." },
  { icon: <FileCheck className="h-6 w-6 text-accent" />, title: "Historial Crediticio On-Chain", description: "Construye un perfil financiero auditable y transparente." },
];

export default function AbobPaySection() {
  return (
    <section id="abob-pay" className="w-full py-16 md:py-24">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <div className="relative w-[300px] h-[600px] bg-slate-800 rounded-[40px] border-[14px] border-slate-900 shadow-2xl">
            {abobPayImage && (
              <Image
                src={abobPayImage.imageUrl}
                alt={abobPayImage.description}
                width={400}
                height={800}
                className="absolute inset-0 w-full h-full object-cover rounded-[26px]"
                data-ai-hint={abobPayImage.imageHint}
              />
            )}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-lg"></div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <span className="text-primary font-semibold">La App</span>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mt-2">
              ABOB-Pay: Tu Centro Financiero
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Una aplicación diseñada para la vida real, que combina la simplicidad de uso con el poder de la tecnología blockchain.
            </p>
          </div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Descargar APK (Testnet) <Download className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <AndeAprendeSection />
    </section>
  );
}
