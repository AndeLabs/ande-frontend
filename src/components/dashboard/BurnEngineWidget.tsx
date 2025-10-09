'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Flame,
  Timer,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface BurnEngineWidgetProps {
  expanded?: boolean;
}

export function BurnEngineWidget({ expanded = false }: BurnEngineWidgetProps) {
  const [timeUntilNextBurn, setTimeUntilNextBurn] = useState(0);
  const [nextBurnAmount, setNextBurnAmount] = useState(0);
  const [totalBurned, setTotalBurned] = useState(250000);

  useEffect(() => {
    // Simular el tiempo hasta la próxima quema
    const calculateTimeUntilNextBurn = () => {
      const SCHEDULE_PERIOD = 90 * 24 * 60 * 60 * 1000; // 90 días en ms
      const lastBurn = Date.now() - (45 * 24 * 60 * 60 * 1000); // Simulación: hace 45 días
      const nextBurn = lastBurn + SCHEDULE_PERIOD;

      setTimeUntilNextBurn(Math.max(0, nextBurn - Date.now()));
    };

    calculateTimeUntilNextBurn();
    const interval = setInterval(calculateTimeUntilNextBurn, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getBurnProgress = () => {
    const SCHEDULE_PERIOD = 90 * 24 * 60 * 60 * 1000;
    const elapsed = SCHEDULE_PERIOD - timeUntilNextBurn;
    const progress = (elapsed / SCHEDULE_PERIOD) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <Card className={`bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800/30 ${expanded ? 'col-span-1' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-400">
          <Flame className="w-5 h-5 mr-2" />
          Motor de Quema
        </CardTitle>
        <CardDescription className="text-gray-400">
          Sistema deflacionario dual-track
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
              Próxima Quema
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
        {expanded && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Impulsiva</span>
              </div>
              <p className="text-lg font-bold text-yellow-400 mt-1">
                45,000
              </p>
              <p className="text-xs text-gray-500">ANDE este período</p>
            </div>

            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400">Programada</span>
              </div>
              <p className="text-lg font-bold text-red-400 mt-1">
                205,000
              </p>
              <p className="text-xs text-gray-500">ANDE estimados</p>
            </div>
          </div>
        )}

        {/* Estadísticas Compactas (versión no expandida) */}
        {!expanded && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Quemado:</span>
              <span className="text-sm font-bold text-red-400">
                {totalBurned.toLocaleString()} ANDE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Tasa Deflación:</span>
              <span className="text-sm font-bold text-orange-400">2.5%</span>
            </div>
          </div>
        )}

        {/* Alerta Informativa */}
        {expanded && (
          <Alert className="border-orange-800 bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300 text-sm">
              El sistema de quema dual-track reduce automáticamente la oferta de ANDE mediante quemas programadas (90 días) y quemas impulsivas basadas en condiciones del mercado.
            </AlertDescription>
          </Alert>
        )}

        {/* Información Detallada (solo versión expandida) */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Período:</span>
              <span className="text-white">90 días</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Última Quema:</span>
              <span className="text-white">Hace 45 días</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Estado:</span>
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operativo
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}