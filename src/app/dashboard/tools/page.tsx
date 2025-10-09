'use client';

import { MintingSimulatorSection } from '@/components/sections';
import { ContractInteraction } from '@/components/blockchain/ContractInteraction';
import { ChainExplorer } from '@/components/developer/ChainExplorer';
import { NetworkStatus } from '@/components/developer/NetworkStatus';
import { ContractRegistry } from '@/components/developer/ContractRegistry';
import { AccountInspector } from '@/components/developer/AccountInspector';
import { AndePage } from '@/components/ui/AndePage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Network, FileCode, Wallet, Zap } from 'lucide-react';

export default function ToolsPage() {
  return (
    <AndePage pageId="tools">
      {/* Tools tabs */}
      <Tabs defaultValue="explorer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="explorer" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Explorer</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="gap-2">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">Contracts</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="simulate" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Simulate</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="space-y-6">
          <ChainExplorer />
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <NetworkStatus />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <ContractRegistry />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountInspector />
        </TabsContent>

        <TabsContent value="simulate" className="space-y-6">
          <MintingSimulatorSection />
          <ContractInteraction />
        </TabsContent>
      </Tabs>
    </AndePage>
  );
}
