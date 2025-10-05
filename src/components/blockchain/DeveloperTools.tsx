'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DeveloperTools() {
  const account = useAccount();
  const [rpcMethod, setRpcMethod] = useState('eth_blockNumber');
  const [rpcParams, setRpcParams] = useState('[]');
  const [rpcResult, setRpcResult] = useState(null);
  const [error, setError] = useState('');

  const executeRPC = async () => {
    setError('');
    setRpcResult(null);
    if (!account.connector) {
      setError('Error: Conecta tu wallet primero.');
      return;
    }
    try {
      const params = JSON.parse(rpcParams);
      const result = await account.connector.getProvider().request({
        method: rpcMethod,
        params: params,
      });
      setRpcResult(JSON.stringify(result, null, 2));
    } catch (e) {
      setError(e.message);
      setRpcResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Developer Tools</CardTitle>
        <CardDescription>Ejecuta llamadas JSON-RPC directamente a la red conectada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Método RPC</label>
          <Select value={rpcMethod} onValueChange={setRpcMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eth_blockNumber">eth_blockNumber</SelectItem>
              <SelectItem value="eth_getBalance">eth_getBalance</SelectItem>
              <SelectItem value="eth_gasPrice">eth_gasPrice</SelectItem>
              <SelectItem value="eth_chainId">eth_chainId</SelectItem>
              <SelectItem value="net_version">net_version</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Parámetros (JSON Array)</label>
          <Input
            type="text"
            value={rpcParams}
            onChange={(e) => setRpcParams(e.target.value)}
            placeholder='["0x...", "latest"]'
            className="font-mono"
          />
        </div>
        <Button onClick={executeRPC} className="w-full">Ejecutar Llamada RPC</Button>
        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {rpcResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Resultado</label>
            <div className="bg-muted rounded-md p-4">
                <pre className="text-sm font-mono overflow-x-auto">
                {rpcResult}
                </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
