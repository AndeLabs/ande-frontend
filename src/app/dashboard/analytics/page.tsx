'use client';

import { BurnEngineWidget } from '@/components/dashboard/BurnEngineWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, BarChart3, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <main className="flex-1 space-y-8 py-8">
      <div className="container mx-auto px-4">
        {/* Header de Analytics con colores Ande Labs */}
        <div className="ande-gradient-primary rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Analíticas AndeChain
              </h1>
              <p className="text-white/90 mt-2">
                Métricas en tiempo real y estadísticas del ecosistema
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="ande-success">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Badge variant="ande-secondary">
                <TrendingUp className="w-3 h-3 mr-1" />
                Activo
              </Badge>
            </div>
          </div>
        </div>

        {/* Contenido principal de analytics con colores Ande Labs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="ande-gradient" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ande-orange/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground dark:text-white">
                <BarChart3 className="w-5 h-5 mr-2 text-ande-blue" />
                Estadísticas de la Red
              </CardTitle>
              <CardDescription className="text-ande-gray">
                Métricas en tiempo real de AndeChain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-ande-gray/10">
                  <span className="text-ande-gray">Total Supply ANDE:</span>
                  <span className="text-foreground font-bold">10,000,000 ANDE</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-ande-lavender/10">
                  <span className="text-ande-gray">Tokens Quemados:</span>
                  <span className="text-ande-orange font-bold flex items-center">
                    <Flame className="w-4 h-4 mr-1" />
                    250,000 ANDE
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-ande-peach/10">
                  <span className="text-ande-gray">Circulante:</span>
                  <span className="text-ande-blue font-bold">9,750,000 ANDE</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-ande-orange/10">
                  <span className="text-ande-gray">Tasa Deflación:</span>
                  <Badge variant="ande-primary" className="text-xs">2.5%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <BurnEngineWidget expanded={true} />
        </div>
      </div>
    </main>
  );
}