import Link from "next/link";
import Image from "next/image";
import { Github, Send, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const logoImage = PlaceHolderImages.find(img => img.id === 'ande-logo');


const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 0 0-10 10c0 4.97 3.58 9.1 8.2 9.85.6.11.82-.26.82-.58v-2.05c-3.48.75-4.22-1.68-4.22-1.68-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.95-.26 1.98-.4 3-.4s2.05.13 3 .4c2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.28c0 .32.22.69.83.58A10 10 0 0 0 22 12a10 10 0 0 0-10-10z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              {logoImage && (
                <Image
                  src={logoImage.imageUrl}
                  alt={logoImage.description}
                  width={24}
                  height={24}
                  className="rounded-full"
                  data-ai-hint={logoImage.imageHint}
                />
              )}
              <span className="font-headline text-lg font-bold">
                AndeChain
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Soberanía Financiera desde Bolivia: La stablecoin boliviana y el rollup soberano sobre Celestia.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div className="grid gap-2">
              <h4 className="font-semibold">Recursos</h4>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Whitepaper</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Documentación</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Testnet</Link>
            </div>
            <div className="grid gap-2">
              <h4 className="font-semibold">Comunidad</h4>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Gobernanza</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Embajadores</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>Contacto</Link>
            </div>
            <div className="grid gap-2">
              <h4 className="font-semibold">Social</h4>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Github className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#"><Send className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="#">
                     <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Discord</title><path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.369-.444.869-.608 1.259a18.579 18.579 0 0 0-5.485 0 11.12 11.12 0 0 0-.617-1.259.076.076 0 0 0-.079-.037A19.718 19.718 0 0 0 3.679 4.37a.07.07 0 0 0-.034.044c-.389 1.417-.743 3.33-.948 5.465a.074.074 0 0 0 .028.061 18.238 18.238 0 0 0 4.544 2.103.075.075 0 0 0 .085-.05.07.07 0 0 0-.015-.086 13.042 13.042 0 0 1-1.89-1.21c.121.05.243.099.363.147a1.08 1.08 0 0 0 .444.185.076.076 0 0 0 .092-.049c.202-.32.39-.658.562-1.013a.072.072 0 0 0-.014-.087 14.82 14.82 0 0 1-2.278-1.287.07.07 0 0 1 .002-.123c.24-.12.48-.239.719-.358.24-.12.48-.238.718-.357a.075.075 0 0 1 .099.002c.907.575 1.838 1.11 2.759 1.589a.075.075 0 0 0 .093-.001c.928-.48 1.859-1.014 2.77-1.589a.075.075 0 0 0 .099-.002c.478.238.957.477 1.435.717a.075.075 0 0 1 .002.123 14.717 14.717 0 0 1-2.278 1.287.072.072 0 0 0-.014.087c.172.355.36.693.562 1.013a.076.076 0 0 0 .092.049 1.09 1.09 0 0 0 .443-.185c.121-.048.243-.098.363-.147a13.04 13.04 0 0 1-1.889 1.21.07.07 0 0 0-.015.086.075.075 0 0 0 .085.05 18.238 18.238 0 0 0 4.544-2.103.075.075 0 0 0 .028-.061c-.205-2.135-.559-4.048-.948-5.465a.07.07 0 0 0-.034-.044Z"/></svg>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            Proyecto desarrollado para el Hackathon Fintech Bicentenario.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Disclaimer: ABOB es un activo experimental y no representa dinero fiduciario. Úselo bajo su propio riesgo.
          </p>
        </div>
      </div>
    </footer>
  );
}
