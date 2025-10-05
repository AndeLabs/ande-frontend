'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Loader, CheckCircle, AlertCircle, Droplet, Clock, Wallet, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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

export function FaucetSection() {
  const { address } = useAccount();
  const [faucetAddress, setFaucetAddress] = useState('');
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>(null);
  const [faucetHealth, setFaucetHealth] = useState<FaucetHealth>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // Check faucet health on mount
  useEffect(() => {
    checkFaucetHealth();
  }, []);

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                Faucet de Prueba
              </CardTitle>
              <CardDescription>Solicita tokens ANDE de prueba para experimentar con AndeChain.</CardDescription>
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
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Balance del Faucet</p>
                <p className="text-sm font-mono font-bold">{parseFloat(faucetHealth.balance).toFixed(2)} ANDE</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cantidad por solicitud</p>
                <p className="text-sm font-mono font-bold">{faucetHealth.faucetAmount} ANDE</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chain ID</p>
                <p className="text-sm font-mono">{faucetHealth.chainId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Block Number</p>
                <p className="text-sm font-mono">{faucetHealth.blockNumber}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Dirección de destino
            </label>
            <Input
              type="text"
              value={faucetAddress}
              onChange={(e) => setFaucetAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
            {address && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => setFaucetAddress(address)}
              >
                Usar mi dirección conectada ({address.slice(0, 6)}...{address.slice(-4)})
              </Button>
            )}
          </div>

          <Button
            onClick={requestFaucet}
            disabled={faucetStatus?.type === 'loading' || cooldown > 0}
            className="w-full"
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
    </div>
  );
}
