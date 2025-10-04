import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PiggyBank, Store, Landmark, Cpu, Database, Save } from 'lucide-react';

const challenges = [
  {
    icon: <PiggyBank className="h-10 w-10 text-primary" />,
    title: "Economía Personal",
    problem: "Inflación, falta de acceso a herramientas de ahorro y escasa educación financiera.",
    solution: "ABOB permite ahorrar en una moneda estable. Ande-Aprende educa y recompensa el conocimiento.",
    tech: "StabilityEngine, Gamificación",
    techIcon: <Save className="h-4 w-4 text-muted-foreground" />,
  },
  {
    icon: <Store className="h-10 w-10 text-primary" />,
    title: "MYPEs y Negocios",
    problem: "Pagos lentos, comisiones altas y contabilidad informal que dificulta el acceso a crédito.",
    solution: "ABOB-Pay ofrece pagos instantáneos y un libro contable digital inmutable para un historial crediticio on-chain.",
    tech: "Rollup Soberano, Smart Contracts",
    techIcon: <Database className="h-4 w-4 text-muted-foreground" />,
  },
  {
    icon: <Landmark className="h-10 w-10 text-primary" />,
    title: "Finanzas Nacionales",
    problem: "Baja inclusión financiera, desconfianza en el sistema y necesidad de modernización.",
    solution: "AndeChain provee una infraestructura transparente, soberana y auditable que fomenta la confianza y la inclusión.",
    tech: "Celestia DA, P2POracle",
    techIcon: <Cpu className="h-4 w-4 text-muted-foreground" />,
  },
];

export default function ProblemSolutionSection() {
  return (
    <section id="problema-solucion" className="w-full py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            El Problema y Nuestra Solución
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AndeChain nace para resolver desafíos clave en la economía boliviana a través de tecnología blockchain soberana.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {challenges.map((challenge, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {challenge.icon}
                  <CardTitle className="font-headline text-2xl">{challenge.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="font-semibold text-primary">Problema</h3>
                  <p className="text-muted-foreground text-sm mt-1">{challenge.problem}</p>
                  <h3 className="font-semibold text-primary mt-4">Solución</h3>
                  <p className="text-muted-foreground text-sm mt-1">{challenge.solution}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-2">
                    {challenge.techIcon}
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {challenge.tech}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
