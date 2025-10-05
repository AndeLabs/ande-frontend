
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Globe, Check } from "lucide-react";

const challenges = [
  {
    icon: User,
    title: "Economía Personal",
    problem: "Poca educación financiera, dependencia del efectivo y dificultad para ahorrar en un entorno bimonetario.",
    solutions: [
      "Billetera Bimonetaria Híbrida para control de gastos en Bs y $ (ABOB).",
      "Módulo de Ahorro por Metas con conversión automática a la stablecoin ABOB.",
      "Plataforma de educación financiera 'Ande-Aprende' con incentivos."
    ]
  },
  {
    icon: Building,
    title: "Finanzas para MYPEs",
    problem: "Falta de registros contables, dificultad para acceder a créditos y alta dependencia del papel.",
    solutions: [
      "Libro Digital Inmutable para un flujo de caja automático y transparente con ABOB.",
      "Historial Crediticio On-Chain verificable para facilitar el acceso a microcréditos.",
      "Pagos P2P instantáneos a proveedores con QR, reduciendo errores y costos."
    ]
  },
  {
    icon: Globe,
    title: "Inclusión Financiera Nacional",
    problem: "Baja bancarización en zonas rurales, desconfianza en instituciones y poco uso de pagos digitales.",
    solutions: [
      "Acceso a un 'Dólar Digital' (ABOB) sin fricción, solo con un smartphone.",
      "Pagos P2P descentralizados que no requieren cuentas bancarias tradicionales.",
      "Transparencia total en transacciones y reservas para construir confianza."
    ]
  }
];

export default function ProblemSolutionSection() {
  return (
    <section id="problema-solucion" className="py-16 sm:py-24 bg-muted/40">
      <div className="container">
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Soluciones Reales para Problemas Reales</h2>
            <p className="mt-4 text-lg text-muted-foreground">AndeChain no es solo tecnología, es una respuesta directa a los desafíos de la economía boliviana.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, i) => (
            <Card key={i}>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <challenge.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-destructive">El Desafío:</h4>
                  <p className="text-sm text-muted-foreground">{challenge.problem}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Nuestra Respuesta:</h4>
                  <ul className="space-y-2">
                    {challenge.solutions.map((solution, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
