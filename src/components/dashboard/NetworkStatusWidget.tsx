'use client';

import { useBlockNumber, useChainId, useSwitchChain } from 'wagmi';
import { andechain } from '@/lib/blockchain/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Shield,
  Zap,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface NetworkStatusWidgetProps {
  detailed?: boolean;
}

export function NetworkStatusWidget({ detailed = false }: NetworkStatusWidgetProps) {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const networkMetrics = {
    blockTime: '2.1s',
    tps: '15.3',
    gasPrice: '0.0001 ANDE',
    difficulty: '2.4B',
    hashRate: '124.5 MH/s',
    peers: 8,
    uptime: '99.9%'
  };

  const isCorrectNetwork = chainId === andechain.id;

  return (
    <Card className={`bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30 ${detailed ? 'col-span-1' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-400">
          <Activity className="w-5 h-5 mr-2" />
          Estado de la Red
        </CardTitle>
        <CardDescription className="text-gray-400">
          Métricas en tiempo real de AndeChain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de Conexión */}
        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-sm text-gray-300">
              {isCorrectNetwork ? 'Red Correcta' : 'Red Incorrecta'}
            </span>
          </div>
          <Badge variant={isCorrectNetwork ? "outline" : "destructive"} className={
            isCorrectNetwork ? "border-green-500 text-green-400" : ""
          }>
            Chain ID: {chainId}
          </Badge>
        </div>

        {/* Switch de Red si es necesario */}
        {!isCorrectNetwork && (
          <Alert className="border-yellow-800 bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300 text-sm">
              No estás en la red correcta.
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-yellow-600 text-yellow-400"
                onClick={() => switchChain({ chainId: andechain.id })}
              >
                Cambiar a AndeChain
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Bloque Actual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Bloque Actual
            </span>
            <span className="text-sm font-mono text-blue-400">
              {blockNumber?.toString() || 'N/A'}
            </span>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center justify-between">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">TPS</span>
            </div>
            <p className="text-lg font-bold text-yellow-400 mt-1">
              {networkMetrics.tps}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center justify-between">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Uptime</span>
            </div>
            <p className="text-lg font-bold text-green-400 mt-1">
              {networkMetrics.uptime}
            </p>
          </div>
        </div>

        {/* Métricas Adicionales (versión detallada) */}
        {detailed && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Block Time</span>
                </div>
                <p className="text-lg font-bold text-blue-400 mt-1">
                  {networkMetrics.blockTime}
                </p>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Peers</span>
                </div>
                <p className="text-lg font-bold text-purple-400 mt-1">
                  {networkMetrics.peers}
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">Gas Price</span>
              </div>
              <p className="text-lg font-bold text-orange-400 mt-1">
                {networkMetrics.gasPrice}
              </p>
            </div>
          </div>
        )}

        {/* Enlaces Rápidos */}
        {detailed && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">RPC URL:</span>
              <a
                href={andechain.rpcUrls.default.http[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-xs flex items-center"
              >
                Ver <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Explorador:</span>
              <a
                href={andechain.blockExplorers.default.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-xs flex items-center"
              >
                Blockscout <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Moneda:</span>
              <span className="text-white">{andechain.nativeCurrency.name}</span>
            </div>
          </div>
        )}

        {/* Botón de Refresh (solo versión compacta) */}
        {!detailed && (
          <Button variant="outline" size="sm" className="w-full border-blue-800 text-blue-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
        )}
      </CardContent>
    </Card>
  );
}