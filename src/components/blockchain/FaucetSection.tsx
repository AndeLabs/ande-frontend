'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Loader, CheckCircle, AlertCircle, Droplet, Clock, Wallet, ExternalLink, Coins, Zap, Info, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAUCET_URL = process.env.NEXT_PUBLIC_FAUCET_URL || 'http://localhost:8081';

type FaucetStatus = {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  txHash?: string;
  remainingTime?: number;
} | null;

type FaucetHealth = {
  status: string;
  faucetAddress: string;
  balance: string;
  blockNumber: string;
  chainId: string;
  faucetAmount: string;
} | null;

// Mock data para tokens disponibles
const availableTokens = [
  {
    symbol: 'ANDE',
    name: 'ANDE Token',
    description: 'Native gas token + ERC20 governance con dualidad única',
    address: '0x851356ae760d987E095750cCeb3bC6014560891C',
    icon: Coins,
    color: 'text-purple-400'
  },
  {
    symbol: 'aUSD',
    name: 'Ande USD',
    description: 'Stablecoin algorítmica para remesas transfronterizas',
    address: '0x95401dc811bb5740090279Ba06cfA8fcF6113778',
    icon: DollarSign,
    color: 'text-green-400'
  },
  {
    symbol: 'aBOB',
    name: 'Andean Boliviano',
    description: 'Token indexado al Boliviano para mercado local',
    address: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49',
    icon: TrendingUp,
    color: 'text-blue-400'
  }
];

export function FaucetSection() {
  const { address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('ande');
  const [faucetAddress, setFaucetAddress] = useState('');
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>(null);
  const [faucetHealth, setFaucetHealth] = useState<FaucetHealth>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check faucet health on mount (client-side only)
  useEffect(() => {
    if (isClient) {
      checkFaucetHealth();
    }
  }, [isClient]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const checkFaucetHealth = async () => {
    try {
      const response = await fetch(`${FAUCET_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setFaucetHealth(data);
      }
    } catch (error) {
      console.error('Failed to check faucet health:', error);
    }
  };

  const requestFaucet = async () => {
    const addressToUse = faucetAddress || address;
    if (!addressToUse || !/^0x[a-fA-F0-9]{40}$/.test(addressToUse)) {
      setFaucetStatus({ type: 'error', message: 'Dirección inválida' });
      setTimeout(() => setFaucetStatus(null), 5000);
      return;
    }

    setFaucetStatus({ type: 'loading', message: 'Solicitando fondos...' });

    try {
      const response = await fetch(FAUCET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.remainingTime) {
          setCooldown(data.remainingTime);
        }
        throw new Error(data.message || 'Error al solicitar fondos del faucet.');
      }

      setFaucetStatus({
        type: 'success',
        message: `¡${data.amount} ANDE enviados exitosamente!`,
        txHash: data.txHash
      });

      // Refresh faucet health
      checkFaucetHealth();

      // Set cooldown (60 seconds)
      setCooldown(60);

    } catch (error: any) {
      const errorMessage = error.message === 'Failed to fetch'
        ? '❌ El servidor del faucet no está corriendo. Ejecuta: cd andechain && npm install && npm start'
        : error.message;

      setFaucetStatus({
        type: 'error',
        message: errorMessage
      });
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Droplet className="w-8 h-8 text-cyan-500" />
              Faucet Completo - AndeChain
            </CardTitle>
            <CardDescription>
              Cargando sistema de faucet...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Droplet className="w-8 h-8 text-cyan-500" />
            Faucet Completo - AndeChain
          </CardTitle>
          <CardDescription>
            Sistema de faucet para obtener tokens de prueba: ANDE (native gas + governance), aUSD (stablecoin), y aBOB (boliviano)
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-800">
              ANDE Native Gas
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-800">
              aUSD Stablecoin
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-800">
              aBOB Local
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-800">
              Dual Tokenomics
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="ande" className="gap-2">
            <Coins className="w-4 h-4" />
            ANDE Token
          </TabsTrigger>
          <TabsTrigger value="stablecoins" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Stablecoins
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <Info className="w-4 h-4" />
            Info
          </TabsTrigger>
        </TabsList>

        {/* ANDE Token Faucet */}
        <TabsContent value="ande" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-purple-400">
                    <Coins className="w-5 h-5 mr-2" />
                    ANDE Token Faucet
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Native gas token + ERC20 governance con dualidad única
                  </CardDescription>
                </div>
                {faucetHealth && (
                  <Badge variant={faucetHealth.status === 'healthy' ? 'default' : 'destructive'}>
                    {faucetHealth.status === 'healthy' ? '🟢 Online' : '🔴 Offline'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Faucet Stats */}
              {faucetHealth && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-400">Balance del Faucet</p>
                    <p className="text-sm font-mono font-bold text-purple-400">{parseFloat(faucetHealth.balance).toFixed(2)} ANDE</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cantidad por solicitud</p>
                    <p className="text-sm font-mono font-bold text-purple-400">{faucetHealth.faucetAmount} ANDE</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Chain ID</p>
                    <p className="text-sm font-mono text-gray-300">{faucetHealth.chainId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Block Number</p>
                    <p className="text-sm font-mono text-gray-300">{faucetHealth.blockNumber}</p>
                  </div>
                </div>
              )}

              <Alert className="border-purple-800 bg-purple-950/20">
                <Zap className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-purple-300 text-sm">
                  <strong>ANDE Token Duality:</strong> Los ANDE recibidos funcionan simultáneamente como native gas token
                  (via precompile 0x...FD) y como ERC20 governance token. No necesitas aprobar para gas.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-300">
                  <Wallet className="h-4 w-4" />
                  Dirección de destino
                </label>
                <Input
                  type="text"
                  value={faucetAddress}
                  onChange={(e) => setFaucetAddress(e.target.value)}
                  placeholder="0x..."
                  className="font-mono bg-black/20 border-gray-700"
                />
                {address && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-purple-400"
                    onClick={() => setFaucetAddress(address)}
                  >
                    Usar mi dirección conectada ({address.slice(0, 6)}...{address.slice(-4)})
                  </Button>
                )}
              </div>

              <Button
                onClick={requestFaucet}
                disabled={faucetStatus?.type === 'loading' || cooldown > 0}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {faucetStatus?.type === 'loading' ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Solicitando...
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Espera {cooldown}s
                  </>
                ) : (
                  <>
                    <Droplet className="mr-2 h-4 w-4" />
                    Solicitar {faucetHealth?.faucetAmount || '10'} ANDE
                  </>
                )}
              </Button>

              {faucetStatus && faucetStatus.type !== 'loading' && (
                <Alert variant={faucetStatus.type === 'error' ? 'destructive' : 'default'}>
                  {faucetStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
                  {faucetStatus.type === 'error' && <AlertCircle className="h-4 w-4" />}
                  <AlertDescription className="ml-2">
                    <div className="space-y-2">
                      <p>{faucetStatus.message}</p>
                      {faucetStatus.txHash && (
                        <a
                          href={`http://localhost:8545/tx/${faucetStatus.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs underline hover:no-underline"
                        >
                          Ver transacción <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stablecoins */}
        <TabsContent value="stablecoins" className="space-y-6">
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <DollarSign className="w-5 h-5 mr-2" />
                Stablecoins Disponibles
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tokens estables para remesas y comercio local en AndeChain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {availableTokens.slice(1).map((token) => {
                  const Icon = token.icon;
                  return (
                    <Card key={token.symbol} className="bg-black/20 border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Icon className={`w-5 h-5 mr-2 ${token.color}`} />
                          {token.symbol}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {token.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-300">{token.description}</p>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400">Contrato:</p>
                          <p className="text-xs font-mono bg-black/30 p-2 rounded text-gray-300">
                            {token.address}
                          </p>
                        </div>
                        <Button variant="outline" className="w-full border-green-800 text-green-400" disabled>
                          <Droplet className="w-4 h-4 mr-2" />
                          Próximamente
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Alert className="border-green-800 bg-green-950/20">
                <Info className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300 text-sm">
                  Los faucets para stablecoins estarán disponibles próximamente. Mientras tanto, puedes obtener ANDE tokens
                  para comenzar a experimentar con el ecosistema AndeChain.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Zap className="w-5 h-5 mr-2" />
                  ANDE Token Duality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Native Gas Token</p>
                      <p className="text-xs text-gray-400">Usa ANDE directamente para pagar gas sin aprobaciones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">ERC20 Governance</p>
                      <p className="text-xs text-gray-400">Participa en votaciones y proposal creation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">ev-reth Integration</p>
                      <p className="text-xs text-gray-400">Precompile en 0x00000000000000000000000000000000000000FD</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Info className="w-5 h-5 mr-2" />
                  Ecosistema de Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-400 mb-1">ANDE</p>
                    <p className="text-xs text-gray-400">Gas + Governance - Staking veANDE</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-sm font-medium text-green-400 mb-1">aUSD</p>
                    <p className="text-xs text-gray-400">Stablecoin algorítmica - Remesas</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-400 mb-1">aBOB</p>
                    <p className="text-xs text-gray-400">Boliviano indexado - Staking sABOB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                Información del Faucet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white">Uso del Faucet</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Cooldown: 60 segundos entre solicitudes</li>
                    <li>• Cantidad: 10 ANDE por solicitud</li>
                    <li>• Solo para testing en red local</li>
                    <li>• Los tokens no tienen valor real</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white">Requerimientos</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Red AndeChain local corriendo</li>
                    <li>• Faucet server ejecutándose</li>
                    <li>• Billetera conectada</li>
                    <li>• Dirección válida de Ethereum</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
