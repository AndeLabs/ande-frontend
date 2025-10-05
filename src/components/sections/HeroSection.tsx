
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <div className="container py-20 sm:py-28">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Soberanía Financiera para los Andes
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Construimos AndeChain, una infraestructura de pagos moderna, eficiente y descentralizada, diseñada para la inclusión y el desarrollo económico de la región.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard">
              <Button>Lanzar Dashboard</Button>
            </Link>
            <Link href="#andechain">
              <Button variant="secondary">Conocer más</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
