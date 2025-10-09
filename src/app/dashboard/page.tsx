'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardHeader, SectionWrapper } from '@/components/ui/layouts';
import Link from 'next/link';
import {
  Activity,
  Vote,
  ArrowRightLeft,
  Zap,
  Wallet,
  Lock
} from 'lucide-react';

// Importamos los nuevos componentes potenciados
import { NetworkStatusWidget } from '@/components/dashboard/NetworkStatusWidget';
import { BurnEngineWidget } from '@/components/dashboard/BurnEngineWidget';
import { QuickStatsWidget } from '@/components/dashboard/QuickStatsWidget';
import { GovernanceWidget } from '@/components/dashboard/GovernanceWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Resumen de AndeChain"
        description="Vista general del ecosistema blockchain soberano para América Latina"
        badge="Red Activa"
        badgeVariant="success"
        background="gradient"
      />

      <SectionWrapper>
        <QuickStatsWidget />

        {/* Grid de resúmenes de cada sección */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Resumen Billetera */}
          <Card variant="ande-gradient">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-blue">
                <Wallet className="w-5 h-5 mr-2" />
                Billetera
              </CardTitle>
              <CardDescription>
                Gestiona tus activos ANDE, aUSD y aBOB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Balance ANDE:</span>
                  <span className="text-foreground font-bold">1,250.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Tokens detectados:</span>
                  <span className="text-foreground font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Transacciones:</span>
                  <span className="text-foreground font-bold">12</span>
                </div>
              </div>
              <Link href="/dashboard/billetera">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ir a Billetera Completa
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resumen Staking */}
          <Card variant="ande-peach">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-orange">
                <Lock className="w-5 h-5 mr-2" />
                Staking
              </CardTitle>
              <CardDescription>
                veANDE governance y aBOB yield (5% APY)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">veANDE bloqueados:</span>
                  <span className="text-foreground font-bold">500 ANDE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">aBOB staked:</span>
                  <span className="text-foreground font-bold">10,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">APY actual:</span>
                  <span className="text-ande-orange font-bold">5.0%</span>
                </div>
              </div>
              <Link href="/dashboard/staking">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ir a Staking Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resumen Gobernanza */}
          <Card variant="ande-lavender">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-lavender">
                <Vote className="w-5 h-5 mr-2" />
                Gobernanza
              </CardTitle>
              <CardDescription>
                Propuestas activas y poder de voto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Propuestas activas:</span>
                  <span className="text-foreground font-bold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Tu poder de voto:</span>
                  <span className="text-ande-lavender font-bold">2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Participación:</span>
                  <span className="text-foreground font-bold">85%</span>
                </div>
              </div>
              <Link href="/dashboard/governance">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ir a Gobernanza Completa
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resumen Puente */}
          <Card variant="ande-gradient">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-blue">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                Puente Cross-Chain
              </CardTitle>
              <CardDescription>
                Transferencias con Celestia DA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Puentes activos:</span>
                  <span className="text-foreground font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Último puente:</span>
                  <span className="text-ande-blue font-bold">Hace 2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">DA Status:</span>
                  <span className="text-ande-blue font-bold">Activo</span>
                </div>
              </div>
              <Link href="/dashboard/bridge">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ir a Puente Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resumen Red */}
          <Card variant="ande-peach">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-orange">
                <Activity className="w-5 h-5 mr-2" />
                Estado de Red
              </CardTitle>
              <CardDescription>
                Infraestructura y salud del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Block Number:</span>
                  <span className="text-foreground font-bold">15,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Gas Price:</span>
                  <span className="text-foreground font-bold">0.1 gwei</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Sequencers:</span>
                  <span className="text-ande-orange font-bold">2/2</span>
                </div>
              </div>
              <Link href="/dashboard/logs">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ver Logs en Vivo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resumen Tokenomics */}
          <Card variant="ande-gradient">
            <CardHeader>
              <CardTitle className="flex items-center text-ande-orange">
                <Zap className="w-5 h-5 mr-2" />
                Tokenomics
              </CardTitle>
              <CardDescription>
                ANDE deflacionario y emisión controlada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Supply Total:</span>
                  <span className="text-foreground font-bold">10M ANDE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Quemados:</span>
                  <span className="text-destructive font-bold">250K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ande-gray">Tasa deflación:</span>
                  <span className="text-ande-orange font-bold">2.5%</span>
                </div>
              </div>
              <Link href="/dashboard/analytics">
                <Button variant="ande-outline" className="w-full mt-4">
                  Ver Analíticas Completas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Widgets de estado en tiempo real */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <NetworkStatusWidget />
          <BurnEngineWidget />
          <GovernanceWidget />
        </div>
      </SectionWrapper>
    </div>
  );
}