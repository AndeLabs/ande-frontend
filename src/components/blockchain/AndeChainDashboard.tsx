'use client';

import React, { useEffect } from 'react';
import { Activity, Droplets, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { useAccount, useBalance, useBlockNumber, useChainId, useSwitchChain } from 'wagmi';
import { andechain } from '@/lib/blockchain/config';
import { FaucetSection } from './FaucetSection';
import { ContractInteraction } from './ContractInteraction';
import { DeveloperTools } from './DeveloperTools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AndeChainDashboard = () => {
  const account = useAccount();
  const { data: balance } = useBalance({ address: account.address });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (account.isConnected && chainId !== andechain.id) {
      switchChain({ chainId: andechain.id });
    }
  }, [account.isConnected, chainId, switchChain]);

  return (
    <div className="container py-10">
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="network"><Activity className="mr-2" />Red</TabsTrigger>
          <TabsTrigger value="faucet"><Droplets className="mr-2" />Faucet</TabsTrigger>
          <TabsTrigger value="contracts"><Code className="mr-2" />Contratos</TabsTrigger>
          <TabsTrigger value="developer"><Code className="mr-2" />Developer</TabsTrigger>
        </TabsList>
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Red</CardTitle>
              <CardDescription>Información en tiempo real de AndeChain.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chain ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{chainId || 'N/A'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Último Bloque</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{blockNumber?.toString() || 'N/A'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {account.status === 'connected' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-yellow-500" />}
                      <span className="font-bold capitalize">{account.status}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium">RPC URL</p>
                    <p className="font-mono text-xs text-muted-foreground">{andechain.rpcUrls.default.http[0]}</p>
                </CardContent>
              </Card>
               <Card>
                <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium">Explorador de Bloques</p>
                    <a href={andechain.blockExplorers.default.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-mono">
                        {andechain.blockExplorers.default.url}
                    </a>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faucet">
            <FaucetSection />
        </TabsContent>
        <TabsContent value="contracts">
            <ContractInteraction />
        </TabsContent>
        <TabsContent value="developer">
            <DeveloperTools />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AndeChainDashboard;