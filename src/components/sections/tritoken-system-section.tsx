import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, RefreshCw } from "lucide-react";

const tokens = [
  { token: 'ABOB', role: 'Stablecoin', use: 'Medio de pago y ahorro estable, anclado 1:1 al boliviano.' },
  { token: 'ANDE', role: 'Gobernanza', use: 'Voto en propuestas, recompensas por staking y colateral para acuñar ABOB.' },
  { token: 'veANDE', role: 'Soberanía', use: 'Aumenta el poder de voto y la participación en los ingresos del protocolo.' },
];

const TokenFlowCard = ({ name, className }: { name: string, className?: string }) => (
    <div className={`flex items-center justify-center p-4 h-24 w-24 rounded-full border-2 bg-card ${className}`}>
        <span className="font-bold text-lg">{name}</span>
    </div>
)

export default function TritokenSystemSection() {
  return (
    <section id="tritoken" className="w-full py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            El Sistema Tri-Token
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tres tokens, un ecosistema. La economía de AndeChain está diseñada para la estabilidad, la gobernanza y el crecimiento a largo plazo.
          </p>
        </div>

        <Card className="mt-12 p-6">
          <Accordion type="single" collapsible className="w-full">
            {tokens.map((token, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-headline text-xl">
                  <span className="font-bold font-code text-primary">{token.token}</span>
                  <span className="text-muted-foreground font-normal text-lg ml-4">- {token.role}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {token.use}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-16 flex flex-col items-center">
            <h3 className="font-headline text-2xl font-semibold text-center mb-8">Flujo Circular de Valor</h3>
            <div className="relative flex items-center justify-center w-full max-w-lg h-64">
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <TokenFlowCard name="ANDE" className="border-primary"/>
                </div>
                <div className="absolute bottom-0 left-0">
                    <TokenFlowCard name="ABOB" className="border-accent"/>
                </div>
                 <div className="absolute bottom-0 right-0">
                    <TokenFlowCard name="veANDE" className="border-secondary-foreground"/>
                </div>
                
                <RefreshCw className="h-32 w-32 text-primary/10 absolute" />

                <ArrowRight className="h-8 w-8 text-muted-foreground absolute left-[28%] top-[35%] -rotate-[60deg]"/>
                <ArrowRight className="h-8 w-8 text-muted-foreground absolute right-[28%] top-[35%] rotate-[60deg]"/>
                <ArrowRight className="h-8 w-8 text-muted-foreground absolute bottom-[10%] left-1/2 -translate-x-1/2 rotate-[180deg]"/>

                <span className="absolute top-1/2 left-[20%] text-sm text-muted-foreground -rotate-45">Staking & Colateral</span>
                <span className="absolute top-1/2 right-[20%] text-sm text-muted-foreground rotate-45">Acuñar & Usar</span>
                <span className="absolute bottom-[25%] left-1/2 -translate-x-1/2 text-sm text-muted-foreground">Votar & Participar</span>

            </div>
        </div>

      </div>
    </section>
  );
}
