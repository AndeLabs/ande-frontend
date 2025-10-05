import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Vote, Map, Users } from "lucide-react";
import Link from "next/link";

const communityMapImage = PlaceHolderImages.find(img => img.id === 'community-map');

const socialLinks = [
    { name: "Discord", href: "#" },
    { name: "Telegram", href: "#" },
    { name: "GitHub", href: "#" },
    { name: "Docs", href: "#" },
    { name: "Whitepaper", href: "#" },
]

export default function CommunitySection() {
  return (
    <section id="comunidad" className="w-full py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Comunidad y Gobernanza
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AndeChain es un proyecto de todos y para todos. Fomentamos la adopción, la transparencia y la pertenencia.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Vote className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl text-accent">Gobernanza con veANDE</h3>
                        <p className="text-muted-foreground mt-1">Al bloquear tus tokens ANDE, recibes veANDE (vote-escrowed ANDE), que te otorga poder de voto en las decisiones del protocolo y una parte de los ingresos generados. ¡Tu voz cuenta!</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl text-accent">Embajadores Locales</h3>
                        <p className="text-muted-foreground mt-1">Estamos construyendo una red de comunidades en toda Bolivia. Conviértete en un embajador y ayuda a llevar la soberanía financiera a tu región.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {socialLinks.map(link => (
                        <Button key={link.name} variant="outline" asChild>
                            <Link href={link.href}>{link.name}</Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border">
                {communityMapImage && (
                    <Image
                        src={communityMapImage.imageUrl}
                        alt={communityMapImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={communityMapImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-md">
                        <h3 className="font-semibold text-foreground flex items-center gap-2"><Map className="h-5 w-5 text-primary"/>Comunidades Activas</h3>
                        <p className="text-sm text-muted-foreground">La Paz, Cochabamba, Santa Cruz</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
