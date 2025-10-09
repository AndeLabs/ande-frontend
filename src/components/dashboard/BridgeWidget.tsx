'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeftRight,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink,
  Zap,
  AlertTriangle
} from 'lucide-react';

const BRIDGE_ADDRESS = '0x...'; // Reemplazar con dirección real

const supportedChains = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 56, name: 'BSC', symbol: 'BNB' },
  { id: 43114, name: 'Avalanche', symbol: 'AVAX' }
];

const supportedTokens = [
  { address: '0x851356ae760d987E095750cCeb3bC6014560891C', symbol: 'ANDE', name: 'ANDE Token' },
  { address: '0x95401dc811bb5740090279Ba06cfA8fcF6113778', symbol: 'aUSD', name: 'Ande USD' },
  { address: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49', symbol: 'aBOB', name: 'Andean Boliviano' }
];

export function BridgeWidget() {
  const [fromChain, setFromChain] = useState('');
  const [toChain, setToChain] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSwapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const isFormValid = fromChain && toChain && selectedToken && amount && recipient;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulario de Bridge */}
      <Card variant="ande-gradient">
        <CardHeader>
          <CardTitle className="flex items-center text-ande-blue">
            <ArrowLeftRight className="w-5 h-5 mr-2" />
            Puente Cross-Chain
          </CardTitle>
          <CardDescription className="text-ande-gray">
            Transfiere activos entre cadenas con Celestia DA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Red Origen */}
          <div className="space-y-2">
            <label className="text-sm text-ande-gray">Desde</label>
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger className="bg-ande-gray/10 border-ande-gray/30">
                <SelectValue placeholder="Selecciona la red de origen" />
              </SelectTrigger>
              <SelectContent className="bg-ande-gray-800/90 border-ande-gray/30">
                {supportedChains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    {chain.name} ({chain.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón de Intercambio */}
          <div className="flex justify-center">
            <Button
              variant="ande-outline"
              size="sm"
              onClick={handleSwapChains}
              disabled={!fromChain || !toChain}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Selector de Red Destino */}
          <div className="space-y-2">
            <label className="text-sm text-ande-gray">Hacia</label>
            <Select value={toChain} onValueChange={setToChain}>
              <SelectTrigger className="bg-ande-gray/10 border-ande-gray/30">
                <SelectValue placeholder="Selecciona la red de destino" />
              </SelectTrigger>
              <SelectContent className="bg-ande-gray-800/90 border-ande-gray/30">
                {supportedChains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    {chain.name} ({chain.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selector de Token */}
          <div className="space-y-2">
            <label className="text-sm text-ande-gray">Token</label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="bg-ande-gray/10 border-ande-gray/30">
                <SelectValue placeholder="Selecciona el token" />
              </SelectTrigger>
              <SelectContent className="bg-ande-gray-800/90 border-ande-gray/30">
                {supportedTokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.name} ({token.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <label className="text-sm text-ande-gray">Cantidad</label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-ande-gray/10 border-ande-gray/30"
            />
          </div>

          {/* Destinatario */}
          <div className="space-y-2">
            <label className="text-sm text-ande-gray">Dirección de Destino</label>
            <Input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-ande-gray/10 border-ande-gray/30"
            />
          </div>

          {/* Botón de Envío */}
          <Button
            variant="ande-primary"
            className="w-full"
            disabled={!isFormValid}
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Puentear Tokens
          </Button>
        </CardContent>
      </Card>

      {/* Información del Bridge */}
      <div className="space-y-6">
        {/* Estado del Bridge */}
        <Card variant="ande-peach">
          <CardHeader>
            <CardTitle className="flex items-center text-ande-orange">
              <Shield className="w-5 h-5 mr-2" />
              Estado del Puente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-ande-gray/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-foreground">Operativo</span>
              </div>
              <Badge variant="ande-primary">
                Celestia DA
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-ande-gray/10 rounded-lg">
                <Zap className="w-4 h-4 text-ande-orange mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">15-30</p>
                <p className="text-xs text-ande-gray">minutos</p>
              </div>
              <div className="text-center p-3 bg-ande-gray/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-ande-blue mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">99.9%</p>
                <p className="text-xs text-ande-gray">confiable</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ande-gray">Tarifa base:</span>
                <span className="text-foreground">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ande-gray">Tarifa DA:</span>
                <span className="text-foreground">0.05%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ande-gray">Mínimo:</span>
                <span className="text-foreground">10 ANDE</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transacciones Recientes */}
        <Card variant="ande-lavender">
          <CardHeader>
            <CardTitle className="flex items-center text-ande-lavender">
              <Clock className="w-5 h-5 mr-2" />
              Transferencias Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { from: 'Ethereum', to: 'AndeChain', amount: '1,000 ANDE', time: 'Hace 5 min', status: 'completed' },
                { from: 'AndeChain', to: 'Polygon', amount: '500 aUSD', time: 'Hace 15 min', status: 'pending' },
                { from: 'BSC', to: 'AndeChain', amount: '2,000 ANDE', time: 'Hace 1 hora', status: 'completed' }
              ].map((tx, index) => (
                <div key={index} className="p-3 bg-ande-gray/10 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'completed' ? 'bg-ande-blue' : 'bg-ande-orange animate-pulse'
                    }`} />
                    <div>
                      <p className="text-sm text-foreground">{tx.amount}</p>
                      <p className="text-xs text-ande-gray">{tx.from} → {tx.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ande-gray">{tx.time}</p>
                    <Button variant="ghost" size="sm" className="text-ande-lavender hover:text-ande-peach p-0 h-auto">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerta Informativa */}
        <Alert className="border-ande-blue bg-ande-blue/10">
          <AlertTriangle className="h-4 w-4 text-ande-blue" />
          <AlertDescription className="text-ande-gray text-sm">
            Los puentes utilizan <strong>Celestia Data Availability</strong> para garantizar que las transacciones sean verificables y seguras.
            El tiempo de procesamiento puede variar según la congestión de la red.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}