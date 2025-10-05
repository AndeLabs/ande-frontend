import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Smartphone, Layers, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-animation');

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'ABOB: Estabilidad y Ahorro',
    description: 'Una stablecoin anclada al boliviano para proteger tu poder adquisitivo.',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: 'ABOB-Pay: Pagos Fáciles',
    description: 'Pagos instantáneos y bimonetarios desde tu celular, sin intermediarios.',
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: 'AndeChain: Transparencia Soberana',
    description: 'Un rollup soberano sobre Celestia que garantiza seguridad y disponibilidad de datos.',
  },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
       {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="absolute inset-0 -z-10 object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/30 dark:bg-background/50"></div>
      <div className="container relative text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Soberanía Financiera desde Bolivia: <span className="text-accent">AndeChain + ABOB</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            La stablecoin boliviana y el rollup soberano sobre Celestia que abren las puertas a una nueva economía digital.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Probar ABOB-Pay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Unirse a la Testnet
            </Button>
          </div>
        </div>
      </div>
      <div className="container mt-20 sm:mt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-col items-center text-center">
                {feature.icon}
                <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
