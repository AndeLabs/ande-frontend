'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Building, Users, Zap } from "lucide-react";

const products = [
  {
    id: 'bridge',
    title: 'Ande Bridge',
    description: 'Puentes cross-chain seguros y rápidos para conectar activos entre múltiples blockchains con la confianza de Celestia.',
    icon: Zap,
    color: 'bg-gradient-to-br from-accent to-accent/80',
    hoverColor: 'hover:from-accent hover:to-accent/90',
    actions: [
      { label: 'Lanzar Bridge', href: '/dashboard/bridge', primary: true },
      { label: 'Documentación', href: '#docs', primary: false }
    ]
  },
  {
    id: 'wallet',
    title: 'Billetera Bimonetaria',
    description: 'Gestión simultánea de activos digitales y fiat con soporte para pesos bolivianos y stablecoins.',
    icon: Wallet,
    color: 'bg-gradient-to-br from-primary to-primary/80',
    hoverColor: 'hover:from-primary hover:to-primary/90',
    actions: [
      { label: 'Crear Cuenta', href: '/dashboard/billetera', primary: true },
      { label: 'Tutorial', href: '#tutorial', primary: false }
    ]
  },
  {
    id: 'governance',
    title: 'Gobernanza DAO',
    description: 'Participa democráticamente en el futuro de AndeChain con votaciones transparentes y recompensas por staking.',
    icon: Users,
    color: 'bg-gradient-to-br from-secondary to-secondary/80',
    hoverColor: 'hover:from-secondary hover:to-secondary/90',
    actions: [
      { label: 'Gobernar', href: '/dashboard/governance', primary: true },
      { label: 'Whitepaper', href: '#whitepaper', primary: false }
    ]
  },
  {
    id: 'infra',
    title: 'Ande Infraestructura',
    description: 'Rollup soberano sobre Celestia con escalabilidad infinita y costos mínimos para desarrolladores.',
    icon: Building,
    color: 'bg-gradient-to-br from-accent/90 to-accent/70',
    hoverColor: 'hover:from-accent hover:to-accent/80',
    actions: [
      { label: 'Desarrollar', href: '/dashboard', primary: true },
      { label: 'GitHub', href: '#github', primary: false }
    ]
  }
];

export default function ProductsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Construye el Futuro Financiero
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un ecosistema completo de herramientas financieras descentralizadas diseñadas
            para empoderar la economía de Latinoamérica.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-xl p-6 text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/20 border border-accent/20 hover:border-accent/40"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`grid-${product.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${product.id})`} />
                  </svg>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                    <Icon className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-white/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 space-y-3">
                    {product.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.primary ? "default" : "outline"}
                        size="sm"
                        className={`w-full justify-center group/btn ${
                          action.primary
                            ? "bg-white text-accent hover:bg-white/90 hover:scale-105 transition-all duration-300"
                            : "border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                        }`}
                        asChild
                      >
                        <a href={action.href}>
                          {action.label}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}