'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";

const ecosystemPartners = [
  {
    name: "Celestia",
    description: "Capa de disponibilidad de datos modular que permite escalar infinitamente",
    logo: "/api/placeholder/120/60",
    category: "Infraestructura",
    website: "https://celestia.org"
  },
  {
    name: "Reth",
    description: "Cliente Ethereum escrito en Rust para máximo rendimiento",
    logo: "/api/placeholder/120/60",
    category: "Infraestructura",
    website: "https://paradigm.xyz/reth"
  },
  {
    name: "Foundry",
    description: "Framework de desarrollo para smart contracts",
    logo: "/api/placeholder/120/60",
    category: "Herramientas",
    website: "https://book.getfoundry.sh"
  },
  {
    name: "Wagmi",
    description: "React Hooks para integración con Ethereum",
    logo: "/api/placeholder/120/60",
    category: "Herramientas",
    website: "https://wagmi.sh"
  },
  {
    name: "Viem",
    description: "Interface TypeScript de bajo nivel para Ethereum",
    logo: "/api/placeholder/120/60",
    category: "Herramientas",
    website: "https://viem.sh"
  },
  {
    name: "Next.js",
    description: "Framework React para producción",
    logo: "/api/placeholder/120/60",
    category: "Frontend",
    website: "https://nextjs.org"
  }
];

const dApps = [
  {
    name: "Ande Bridge",
    description: "Puente cross-chain para transferencia de activos",
    category: "DeFi",
    status: "Activo",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    name: "Billetera Ande",
    description: "Wallet bimonetaria con soporte fiat y crypto",
    category: "Wallet",
    status: "Beta",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    name: "Ande Pay",
    description: "Sistema de pagos para merchants",
    category: "Pagos",
    status: "Próximamente",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    name: "Ande DAO",
    description: "Plataforma de gobernanza on-chain",
    category: "Gobernanza",
    status: "Activo",
    color: "from-orange-500/20 to-red-500/20"
  }
];

export default function EcosystemSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ecosistema AndeChain
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una red vibrante de socios estratégicos, herramientas de desarrollo y aplicaciones
            descentralizadas que están construyendo el futuro financiero de Latinoamérica.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Socios Estratégicos
            </h3>
            <p className="text-muted-foreground">
              Colaboramos con las mejores empresas de tecnología blockchain del mundo
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ecosystemPartners.map((partner, index) => (
              <Card
                key={index}
                className="group border-border/50 hover:border-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-sm text-accent font-medium mb-2">
                        {partner.category}
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {partner.name}
                      </h4>
                    </div>
                    <div className="w-20 h-10 bg-accent/10 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">
                        {partner.name.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {partner.description}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:text-accent/80 hover:bg-accent/10 p-0 h-auto font-medium group"
                    asChild
                  >
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Visitar sitio
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* dApps Showcase */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Aplicaciones del Ecosistema
            </h3>
            <p className="text-muted-foreground">
              Descubre las aplicaciones que ya están funcionando en AndeChain
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {dApps.map((dApp, index) => (
              <Card
                key={index}
                className={`group border-0 bg-gradient-to-br ${dApp.color} hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs font-medium rounded text-white">
                          {dApp.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          dApp.status === 'Activo'
                            ? 'bg-green-500/20 text-green-300'
                            : dApp.status === 'Beta'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {dApp.status}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {dApp.name}
                      </h4>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  <p className="text-white/90 leading-relaxed">
                    {dApp.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-8 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl border border-accent/20">
            <div className="text-left">
              <h4 className="text-2xl font-bold text-foreground mb-2">
                ¿Quieres construir en AndeChain?
              </h4>
              <p className="text-muted-foreground">
                Únete a nuestra comunidad de desarrolladores y empieza a construir el futuro
              </p>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Comenzar a Desarrollar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}