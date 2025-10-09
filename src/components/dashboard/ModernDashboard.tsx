'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useBlockNumber, useChainId, useSwitchChain } from 'wagmi';
import { andechain } from '@/lib/blockchain/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  TrendingUp,
  Wallet,
  Send,
  Lock,
  Unlock,
  Zap,
  Shield,
  ExternalLink,
  Coins,
  BarChart3,
  Vote,
  Bridge,
  Settings,
  Bell,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { TokenOverview } from './components/TokenOverview';
import { NetworkStatus } from './components/NetworkStatus';
import { QuickActions } from './components/QuickActions';
import { StakingCenter } from './components/StakingCenter';
import { GovernancePanel } from './components/GovernancePanel';
import { BridgeInterface } from './components/BridgeInterface';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BurnEngineMonitor } from './components/BurnEngineMonitor';

export function ModernDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== andechain.id) {
      switchChain({ chainId: andechain.id });
    }
  }, [isConnected, chainId, switchChain]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center">
              <Coins className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Bienvenido a AndeChain</CardTitle>
            <CardDescription>
              El ecosistema blockchain soberano para América Latina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Por favor, conecta tu billetera para acceder al dashboard y gestionar tus activos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Coins className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AndeChain Dashboard</h1>
                  <p className="text-sm text-gray-400">Ecosistema DeFi para América Latina</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Conectado
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-gray-300 border-gray-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-300 border-gray-600"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black/20 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Balance ANDE</p>
                  <p className="text-xl font-bold text-white">
                    {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}
                  </p>
                </div>
                <Coins className="text-purple-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Bloque Actual</p>
                  <p className="text-xl font-bold text-white">
                    {blockNumber?.toString() || 'N/A'}
                  </p>
                </div>
                <Activity className="text-blue-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Network ID</p>
                  <p className="text-xl font-bold text-white">{andechain.id}</p>
                </div>
                <Shield className="text-green-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Gas Estimado</p>
                  <p className="text-xl font-bold text-white">0.0001</p>
                </div>
                <Zap className="text-yellow-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black/20 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600">
              <Wallet className="w-4 h-4 mr-2" />
              Billetera
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-2" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="bridge" className="data-[state=active]:bg-purple-600">
              <Bridge className="w-4 h-4 mr-2" />
              Puente
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-purple-600">
              <Vote className="w-4 h-4 mr-2" />
              Gobernanza
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analíticas
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Red
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenOverview />
              <NetworkStatus />
              <QuickActions />
              <BurnEngineMonitor />
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <Card className="bg-black/20 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="mr-2" />
                  Mi Billetera
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona todos tus activos en AndeChain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TokenOverview expanded={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staking" className="mt-6">
            <StakingCenter />
          </TabsContent>

          <TabsContent value="bridge" className="mt-6">
            <BridgeInterface />
          </TabsContent>

          <TabsContent value="governance" className="mt-6">
            <GovernancePanel />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkStatus detailed={true} />
              <Card className="bg-black/20 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Información de la Red</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">RPC URL:</span>
                    <a
                      href={andechain.rpcUrls.default.http[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline text-sm"
                    >
                      {andechain.rpcUrls.default.http[0]} <ExternalLink className="inline w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Explorador:</span>
                    <a
                      href={andechain.blockExplorers.default.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline text-sm"
                    >
                      {andechain.blockExplorers.default.url} <ExternalLink className="inline w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chain ID:</span>
                    <span className="text-white font-mono">{andechain.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moneda:</span>
                    <span className="text-white">{andechain.nativeCurrency.name} ({andechain.nativeCurrency.symbol})</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}