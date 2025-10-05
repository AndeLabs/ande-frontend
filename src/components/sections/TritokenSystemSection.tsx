
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, CircleDollarSign, Flame } from "lucide-react";

const tokens = [
  {
    icon: Gem,
    name: "ANDE",
    role: "Token Nativo (Gas y Staking)",
    description: "ANDE es la moneda nativa de la red, diseñada para pagar las comisiones de transacción (gas) y para participar en el futuro mecanismo de consenso y gobernanza de la red a través del staking.",
    color: "primary"
  },
  {
    icon: CircleDollarSign,
    name: "aUSD",
    role: "Moneda Estable Descentralizada",
    description: "El sistema está diseñado para permitir la acuñación de aUSD, una moneda estable algorítmica vinculada al dólar. Su propósito es ofrecer un medio de intercambio confiable y resistente a la volatilidad.",
    color: "green-500"
  },
  {
    icon: Flame,
    name: "ABOB",
    role: "Token de Utilidad del Ecosistema",
    description: "ABOB está concebido como el token de utilidad para el ecosistema de pagos. El diseño económico contempla un mecanismo de quema de ABOB para contribuir a la estabilidad del sistema.",
    color: "orange-500"
  },
];

export default function TritokenSystemSection() {
  return (
    <section id="tritoken" className="py-16 sm:py-24 bg-muted/40">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Un Sistema Económico de Tres Tokens</h2>
          <p className="mt-4 text-lg text-muted-foreground">Nuestra arquitectura económica está diseñada para la estabilidad, utilidad y crecimiento.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tokens.map((token) => (
            <Card key={token.name} className={`border-${token.color}/30`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className={`bg-${token.color}/10 p-3 rounded-full`}>
                        <token.icon className={`h-6 w-6 text-${token.color}`} />
                    </div>
                    <CardTitle>{token.name}</CardTitle>
                </div>
                <p className="text-sm font-medium text-muted-foreground pt-2">{token.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{token.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
