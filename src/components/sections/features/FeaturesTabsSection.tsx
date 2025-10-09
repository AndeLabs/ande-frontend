'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, BarChart3, Code, Users, Lock } from 'lucide-react';

const features = [
  {
    id: 'performance',
    title: 'Rendimiento Superior',
    icon: Zap,
    description: 'El entorno de ejecución más rápido con tiempos de bloque, límites de gas y almacenamiento de datos optimizados para una experiencia confiable de usuario y desarrollador.',
    metrics: [
      { label: 'Tiempo de Bloque', value: '<2 segundos' },
      { label: 'TPS', value: '2,000+' },
      { label: 'Costo por Tx', value: '<$0.01' }
    ]
  },
  {
    id: 'ecosystem',
    title: 'Ecosistema Vibrante',
    icon: Users,
    description: 'Únete a una comunidad creciente de desarrolladores, usuarios y socios que están construyendo el futuro financiero de Latinoamérica.',
    metrics: [
      { label: 'Desarrolladores', value: '100+' },
      { label: 'Aplicaciones', value: '50+' },
      { label: 'Usuarios Activos', value: '10K+' }
    ]
  },
  {
    id: 'modularity',
    title: 'Modularidad Escalable',
    icon: Code,
    description: 'Arquitectura modular que permite escalar infinitamente usando Celestia como capa de disponibilidad de datos, garantizando costos mínimos.',
    metrics: [
      { label: 'Escalabilidad', value: 'Infinita' },
      { label: 'DA Layer', value: 'Celestia' },
      { label: 'Upgradability', value: '100%' }
    ]
  },
  {
    id: 'devex',
    title: 'Excepcional para Desarrolladores',
    icon: BarChart3,
    description: 'Herramientas completas, documentación detallada y compatibilidad total con EVM para que los desarrolladores puedan construir sin fricciones.',
    metrics: [
      { label: 'Compatibilidad EVM', value: '100%' },
      { label: 'Lenguajes', value: 'Solidity, Vyper' },
      { label: 'Tooling', value: 'Completo' }
    ]
  },
  {
    id: 'security',
    title: 'Seguridad Máxima',
    icon: Shield,
    description: 'Validadores descentralizados, pruebas de penetración continuas y auditorías de terceros para garantizar la seguridad de todos los activos.',
    metrics: [
      { label: 'Validadores', value: '50+' },
      { label: 'Auditorías', value: '10+' },
      { label: 'Uptime', value: '99.9%' }
    ]
  },
  {
    id: 'sovereignty',
    title: 'Soberanía Total',
    icon: Lock,
    description: 'Control total sobre la gobernanza y el roadmap del protocolo, asegurando que los intereses de Latinoamérica siempre sean la prioridad.',
    metrics: [
      { label: 'Gobernanza', value: 'On-chain' },
      { label: 'Decentralización', value: '100%' },
      { label: 'Control Comunitario', value: 'Total' }
    ]
  }
];

export default function FeaturesTabsSection() {
  const [activeTab, setActiveTab] = useState('performance');

  const activeFeature = features.find(f => f.id === activeTab);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Características Técnicas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora las capacidades técnicas que hacen de AndeChain la infraestructura
            blockchain más avanzada para Latinoamérica.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Button
                key={feature.id}
                variant={activeTab === feature.id ? "default" : "outline"}
                onClick={() => setActiveTab(feature.id)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === feature.id
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                    : "hover:bg-accent/10 hover:border-accent/40 hover:text-accent"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {feature.title}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeFeature && (
          <div className="max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Text Content */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/20">
                        <activeFeature.icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">
                        {activeFeature.title}
                      </h3>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {activeFeature.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {activeFeature.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-2xl font-bold text-accent mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}