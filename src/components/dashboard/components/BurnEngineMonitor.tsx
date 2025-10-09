'use client';

import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Flame,
  Timer,
  Zap,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const BURN_ENGINE_ADDRESS = '0x...'; // Reemplazar con dirección real
const BURN_ENGINE_ABI = [
  { name: 'lastScheduledBurnTimestamp', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'andeToken', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { name: 'scheduledBurn', inputs: [], outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'impulsiveBurn', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable', type: 'function' }
];

export function BurnEngineMonitor() {
  const [timeUntilNextBurn, setTimeUntilNextBurn] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [burnRate, setBurnRate] = useState(0);

  const { data: lastBurnTimestamp } = useReadContract({
    address: BURN_ENGINE_ADDRESS as `0x${string}`,
    abi: BURN_ENGINE_ABI,
    functionName: 'lastScheduledBurnTimestamp',
  });

  useEffect(() => {
    const calculateTimeUntilNextBurn = () => {
      if (!lastBurnTimestamp) return;

      const SCHEDULE_PERIOD = 90 * 24 * 60 * 60 * 1000; // 90 días en ms
      const lastBurn = Number(lastBurnTimestamp) * 1000;
      const now = Date.now();
      const nextBurn = lastBurn + SCHEDULE_PERIOD;

      setTimeUntilNextBurn(Math.max(0, nextBurn - now));
    };

    calculateTimeUntilNextBurn();
    const interval = setInterval(calculateTimeUntilNextBurn, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [lastBurnTimestamp]);

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getBurnProgress = () => {
    const SCHEDULE_PERIOD = 90 * 24 * 60 * 60 * 1000;
    const progress = ((SCHEDULE_PERIOD - timeUntilNextBurn) / SCHEDULE_PERIOD) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800/30">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-400">
          <Flame className="w-5 h-5 mr-2" />
          Motor de Quema Deflacionaria
        </CardTitle>
        <CardDescription className="text-gray-400">
          Monitorea el sistema de quema dual-track de ANDE tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del Sistema */}
        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Sistema Activo</span>
          </div>
          <Badge variant="outline" className="border-orange-500 text-orange-400">
            Dual-Track
          </Badge>
        </div>

        {/* Próxima Quema Programada */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center">
              <Timer className="w-4 h-4 mr-2" />
              Próxima Quema Programada
            </span>
            <span className="text-sm font-mono text-orange-400">
              {formatTimeRemaining(timeUntilNextBurn)}
            </span>
          </div>
          <Progress value={getBurnProgress()} className="h-2 bg-black/30" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progreso del período</span>
            <span>{getBurnProgress().toFixed(1)}%</span>
          </div>
        </div>

        {/* Estadísticas de Quema */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center justify-between">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Quema Impulsiva</span>
            </div>
            <p className="text-lg font-bold text-yellow-400 mt-1">
              {totalBurned.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">ANDE este período</p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center justify-between">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Quema Programada</span>
            </div>
            <p className="text-lg font-bold text-red-400 mt-1">
              {(burnRate * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">Tasa de deflación</p>
          </div>
        </div>

        {/* Alertas de Sistema */}
        <Alert className="border-orange-800 bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-300 text-sm">
            El sistema de quema dual-track reduce automáticamente la oferta de ANDE mediante quemas programadas (90 días)
            y quemas impulsivas basadas en condiciones del mercado.
          </AlertDescription>
        </Alert>

        {/* Información Detallada */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Mecanismo:</span>
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Programado + Impulsivo
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Período:</span>
            <span className="text-white">90 días</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Estado:</span>
            <Badge variant="outline" className="border-green-500 text-green-400">
              Operativo
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}