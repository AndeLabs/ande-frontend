import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Database, Layers, Lock, Cpu } from 'lucide-react';

const FlowItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </div>
);

const contracts = [
    { name: 'StabilityEngine', description: 'Mantiene la paridad 1:1 de ABOB con el boliviano.' },
    { name: 'P2POracleV2', description: 'Provee datos de precios de forma descentralizada y segura.' },
    { name: 'ANDEToken', description: 'El token de gobernanza para votar y participar en el ecosistema.' },
    { name: 'AbobToken', description: 'La stablecoin que representa el valor del boliviano en la red.' },
]

export default function AndeChainInfraSection() {
  return (
    <section id="andechain" className="w-full py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Infraestructura: AndeChain
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Construido sobre una base técnica robusta para garantizar soberanía, seguridad y escalabilidad.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <FlowItem icon={<Database className="h-8 w-8" />} label="Usuario & ABOB-Pay" />
            <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90 md:rotate-0" />
            <FlowItem icon={<Layers className="h-8 w-8" />} label="AndeChain Rollup" />
            <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90 md:rotate-0" />
            <FlowItem icon={<Cpu className="h-8 w-8" />} label="Celestia DA Layer" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-headline text-2xl font-semibold text-accent">¿Qué es un Rollup Soberano?</h3>
                <p className="text-muted-foreground">
                    A diferencia de los rollups tradicionales, un rollup soberano como AndeChain maneja su propia secuenciación y liquidación. Esto significa que la comunidad de AndeChain, a través del token ANDE, tiene el control total sobre el futuro de la red, sin depender de otra blockchain para su validez.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-2xl font-semibold text-accent">¿Cómo ayuda Celestia?</h3>
                <p className="text-muted-foreground">
                    Celestia actúa como una capa de Disponibilidad de Datos (DA). En lugar de procesar transacciones, Celestia se especializa en asegurar que los datos del rollup de AndeChain estén siempre disponibles para quien los necesite. Esto hace que AndeChain sea más seguro, escalable y económico.
                </p>
            </div>
        </div>
        
        <div className="mt-16">
            <h3 className="font-headline text-2xl font-semibold text-center text-primary">Contratos Clave</h3>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contracts.map(contract => (
                    <Card key={contract.name} className="bg-background">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="h-5 w-5 text-primary" />
                                <span className="font-code">{contract.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{contract.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
