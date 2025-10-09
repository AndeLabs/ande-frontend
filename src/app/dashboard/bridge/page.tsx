'use client';

import { BridgeWidget } from '@/components/dashboard/BridgeWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Database } from 'lucide-react';

export default function BridgePage() {
  return (
    <main className="flex-1 space-y-8 py-8">
      <div className="container mx-auto px-4">
        {/* Header del Puente con colores Ande Labs */}
        <div className="ande-gradient-primary rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Puente Cross-Chain
              </h1>
              <p className="text-white/90 mt-2">
                Transferencias seguras con Celestia Data Availability
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="ande-primary">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Celestia DA
              </Badge>
              <Badge variant="ande-success">
                <Database className="w-4 h-4 mr-2" />
                Secure
              </Badge>
            </div>
          </div>
        </div>

        {/* Contenido principal del puente */}
        <BridgeWidget />

        <Card variant="ande-gradient" className="p-6">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">Información del Puente</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-foreground dark:text-white font-medium mb-3">Características de Seguridad</h4>
              <ul className="text-sm text-ande-gray space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-success rounded-full mr-2"></div>
                  Celestia Data Availability Layer
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-success rounded-full mr-2"></div>
                  Verificación por Blobstream
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-success rounded-full mr-2"></div>
                  Validación criptográfica
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-success rounded-full mr-2"></div>
                  Relayer descentralizado
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground dark:text-white font-medium mb-3">Redes Soportadas</h4>
              <ul className="text-sm text-ande-gray space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-blue rounded-full mr-2"></div>
                  AndeChain ←→ Ethereum
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-blue rounded-full mr-2"></div>
                  AndeChain ←→ Polygon
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-blue rounded-full mr-2"></div>
                  AndeChain ←→ BSC
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-ande-gray rounded-full mr-2"></div>
                  Más redes próximamente
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}