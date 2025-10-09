import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Github } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-mockup');

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Soberanía Financiera
                <span className="text-accent"> para Latinoamérica</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                AndeChain es el rollup soberano sobre Celestia que empodera
                la economía boliviana con tecnología blockchain de vanguardia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
              <Button variant="ghost" size="lg">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">+2M</div>
                <div className="text-sm text-muted-foreground">Transacciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">&lt;$0.01</div>
                <div className="text-sm text-muted-foreground">Costos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">&lt;2s</div>
                <div className="text-sm text-muted-foreground">Confirmación</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}