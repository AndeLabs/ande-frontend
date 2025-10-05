'use client';

import { useState } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Wallet, Code, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

type TokenBalance = {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
};

type AccountData = {
  address: string;
  balance: bigint;
  nonce: number;
  isContract: boolean;
  bytecodeSize?: number;
  tokenBalances: TokenBalance[];
};

const TOKEN_CONTRACTS = [
  { address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', symbol: 'MOCK_ABOB', decimals: 18 },
  { address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', symbol: 'MOCK_USDC', decimals: 6 }
];

export function AccountInspector() {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient();
  const [searchAddress, setSearchAddress] = useState('');
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inspectAccount = async (address: string) => {
    if (!publicClient || !address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Dirección inválida');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAccountData(null);

    try {
      const [balance, nonce, bytecode] = await Promise.all([
        publicClient.getBalance({ address: address as `0x${string}` }),
        publicClient.getTransactionCount({ address: address as `0x${string}` }),
        publicClient.getBytecode({ address: address as `0x${string}` })
      ]);

      const isContract = bytecode !== undefined && bytecode !== '0x';
      const bytecodeSize = bytecode ? (bytecode.length - 2) / 2 : 0;

      // Fetch token balances
      const tokenBalances: TokenBalance[] = [];

      for (const token of TOKEN_CONTRACTS) {
        try {
          const data = await publicClient.readContract({
            address: token.address as `0x${string}`,
            abi: [{
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'account', type: 'address' }],
              outputs: [{ name: 'balance', type: 'uint256' }]
            }],
            functionName: 'balanceOf',
            args: [address as `0x${string}`]
          });

          tokenBalances.push({
            symbol: token.symbol,
            balance: (data as bigint).toString(),
            decimals: token.decimals,
            address: token.address
          });
        } catch (err) {
          console.error(`Error fetching ${token.symbol} balance:`, err);
        }
      }

      setAccountData({
        address,
        balance,
        nonce,
        isContract,
        bytecodeSize,
        tokenBalances
      });

    } catch (err: any) {
      setError(err.message || 'Error al inspeccionar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: string, decimals: number) => {
    const num = Number(balance) / Math.pow(10, decimals);
    return num.toFixed(4);
  };

  const handleSearch = () => {
    inspectAccount(searchAddress);
  };

  const useConnectedAddress = () => {
    if (connectedAddress) {
      setSearchAddress(connectedAddress);
      inspectAccount(connectedAddress);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Account Inspector
        </CardTitle>
        <CardDescription>
          Inspecciona balances, nonce, bytecode y tokens de cualquier dirección
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="0x... dirección a inspeccionar"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="font-mono"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {connectedAddress && (
          <Button
            variant="outline"
            size="sm"
            onClick={useConnectedAddress}
            className="w-full"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Usar mi dirección conectada
          </Button>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Account Data Display */}
        {accountData && (
          <div className="space-y-4">
            {/* Address Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Información de la Cuenta</h3>
                  <Badge variant={accountData.isContract ? 'default' : 'secondary'}>
                    {accountData.isContract ? (
                      <>
                        <Code className="h-3 w-3 mr-1" />
                        Contract
                      </>
                    ) : (
                      <>
                        <Wallet className="h-3 w-3 mr-1" />
                        EOA
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <code className="font-mono text-xs">{accountData.address}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nonce:</span>
                    <span className="font-mono font-bold">{accountData.nonce}</span>
                  </div>
                  {accountData.isContract && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bytecode Size:</span>
                      <span className="font-mono">{accountData.bytecodeSize} bytes</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Native Balance */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Balance Nativo</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">
                    {(Number(accountData.balance) / 1e18).toFixed(4)}
                  </span>
                  <span className="text-lg text-muted-foreground">ANDE</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {accountData.balance.toString()} wei
                </p>
              </CardContent>
            </Card>

            {/* Token Balances */}
            {accountData.tokenBalances.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Balances de Tokens</h3>
                  <div className="space-y-2">
                    {accountData.tokenBalances.map((token) => (
                      <div
                        key={token.address}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{token.symbol}</p>
                          <code className="text-xs text-muted-foreground">
                            {token.address.slice(0, 10)}...
                          </code>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold">
                            {formatBalance(token.balance, token.decimals)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {token.balance} (raw)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> El nonce indica el número de transacciones enviadas desde esta
                  cuenta. Si es un contrato, el bytecode size muestra el tamaño del código desplegado.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!accountData && !error && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ingresa una dirección para inspeccionar su estado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
