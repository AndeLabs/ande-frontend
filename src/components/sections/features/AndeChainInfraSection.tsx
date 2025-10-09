
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Database, Cpu, Shield } from "lucide-react";

const techStack = [
  {
    icon: Layers,
    name: "Rollup Soberano EVM",
    description: "Construimos sobre la base más sólida y universal del ecosistema blockchain. Nuestra compatibilidad con la Máquina Virtual de Ethereum (EVM) garantiza que cualquier desarrollador pueda desplegar contratos y DApps existentes sin fricción.",
  },
  {
    icon: Database,
    name: "Celestia para Disponibilidad de Datos",
    description: "Utilizamos Celestia como nuestra capa de Disponibilidad de Datos (DA). Esto nos permite heredar la seguridad de una red más grande y reducir drásticamente los costos de transacción, al no tener que almacenar todos los datos en nuestra propia cadena.",
  },
  {
    icon: Cpu,
    name: "Motor de Ejecución: Reth",
    description: "AndeChain opera con Reth (Rust Ethereum), un cliente de ejecución de alto rendimiento. Esto nos proporciona una velocidad y eficiencia excepcionales para procesar transacciones y ejecutar contratos inteligentes.",
  },
  {
    icon: Shield,
    name: "Seguridad por Diseño",
    description: "Al separar las capas de consenso, disponibilidad de datos y ejecución, creamos una arquitectura robusta y modular que minimiza los riesgos y maximiza la seguridad para los fondos y aplicaciones de nuestros usuarios.",
  },
];

export default function AndeChainInfraSection() {
  return (
    <section id="andechain" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Infraestructura Robusta y Escalable</h2>
          <p className="mt-4 text-lg text-muted-foreground">Combinamos las tecnologías más avanzadas para crear una blockchain de nueva generación.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {techStack.map((tech, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <tech.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
