import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Github } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-mockup');

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5">
      {/* Grid Pattern Background - Inspired by Arbitrum */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent/20"
        >
          <defs>
            <pattern id="andeGrid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50"/>
            </pattern>
            <pattern id="andeGridLarge" width="240" height="240" patternUnits="userSpaceOnUse">
              <rect width="240" height="240" fill="url(#andeGrid)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#andeGridLarge)" />
        </svg>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
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
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-accent/20 text-foreground hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-all duration-300"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border/50">
              <div className="text-center group">
                <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform duration-300">+2M</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Transacciones</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform duration-300">&lt;$0.01</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Costos</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform duration-300">&lt;2s</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Confirmación</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 group">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
              {/* Overlay effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* Animated background elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/30 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full filter blur-2xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -right-4 w-24 h-24 bg-secondary/30 rounded-full filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}