'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Copy, Check, ExternalLink, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

type Contract = {
  name: string;
  address: string;
  description: string;
  category: 'token' | 'governance' | 'bridge' | 'oracle' | 'stability';
  verified: boolean;
  documentation?: string;
};

const CONTRACTS: Contract[] = [
  {
    name: 'ANDEToken',
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    description: 'Governance token con vote escrow mechanics (ERC20Votes)',
    category: 'token',
    verified: true,
    documentation: '/docs/contracts/ande-token'
  },
  {
    name: 'AusdToken',
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    description: 'Algorithmic stablecoin pegged to USD',
    category: 'token',
    verified: true,
    documentation: '/docs/contracts/ausd-token'
  },
  {
    name: 'AbobToken',
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    description: 'Bolivian Boliviano-pegged token',
    category: 'token',
    verified: true,
    documentation: '/docs/contracts/abob-token'
  },
  {
    name: 'sAbobToken',
    address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    description: 'Staked ABOB with yield distribution',
    category: 'token',
    verified: true,
    documentation: '/docs/contracts/sabob-token'
  },
  {
    name: 'VeANDE',
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    description: 'Vote-escrowed ANDE (lock tokens up to 4 years for voting power)',
    category: 'governance',
    verified: true,
    documentation: '/docs/contracts/veande'
  },
  {
    name: 'MintController',
    address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    description: 'Controls ANDE emission with safety barriers and supermajority voting',
    category: 'governance',
    verified: true,
    documentation: '/docs/contracts/mint-controller'
  },
  {
    name: 'DualTrackBurnEngine',
    address: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    description: 'Deflationary mechanism (real-time + quarterly burns)',
    category: 'governance',
    verified: true,
    documentation: '/docs/contracts/burn-engine'
  },
  {
    name: 'AndeBridge',
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    description: 'Source chain bridge (locks tokens, emits events)',
    category: 'bridge',
    verified: true,
    documentation: '/docs/contracts/ande-bridge'
  },
  {
    name: 'EthereumBridge',
    address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    description: 'Destination chain bridge (verifies DA proofs via Blobstream)',
    category: 'bridge',
    verified: true,
    documentation: '/docs/contracts/ethereum-bridge'
  },
  {
    name: 'P2POracleV2',
    address: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    description: 'P2P exchange rate oracle for cross-border remittances',
    category: 'oracle',
    verified: true,
    documentation: '/docs/contracts/p2p-oracle'
  },
  {
    name: 'AndeOracleAggregator',
    address: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    description: 'Aggregates multiple oracle sources',
    category: 'oracle',
    verified: true,
    documentation: '/docs/contracts/oracle-aggregator'
  },
  {
    name: 'StabilityEngine',
    address: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    description: 'Manages stablecoin stability and collateralization',
    category: 'stability',
    verified: true,
    documentation: '/docs/contracts/stability-engine'
  }
];

const ABIS_LOCATION = '/andechain/contracts/out/';

export function ContractRegistry() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const categories = {
    token: { label: 'Tokens', icon: '💰', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    governance: { label: 'Governance', icon: '🗳️', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    bridge: { label: 'Bridge', icon: '🌉', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
    oracle: { label: 'Oracles', icon: '🔮', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
    stability: { label: 'Stability', icon: '⚖️', color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Contract Registry
            </CardTitle>
            <CardDescription>
              Direcciones de contratos inteligentes desplegados en AndeChain
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Check className="h-3 w-3" />
            {CONTRACTS.length} Contracts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Setup Alert */}
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Configuración Rápida para Developers</p>
            <code className="block bg-background p-2 rounded text-xs font-mono mt-2">
              # Clonar ABIs desde el repositorio<br />
              cp -r {ABIS_LOCATION}*.json ./abis/
            </code>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {Object.entries(categories).map(([key, { label, icon }]) => (
              <TabsTrigger key={key} value={key}>
                <span className="mr-1">{icon}</span>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {(['all', ...Object.keys(categories)] as const).map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-3 mt-4">
              {CONTRACTS.filter((c) => tabValue === 'all' || c.category === tabValue).map((contract) => {
                const categoryInfo = categories[contract.category];
                return (
                  <Card key={contract.address} className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{contract.name}</h3>
                            {contract.verified && (
                              <Badge variant="outline" className="gap-1">
                                <Check className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{contract.description}</p>
                        </div>
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {/* Address */}
                        <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                          <code className="flex-1 text-sm font-mono">{contract.address}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(contract.address)}
                          >
                            {copiedAddress === contract.address ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <a
                              href={`http://localhost:8545/address/${contract.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Ver en Explorer
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                          {contract.documentation && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <a href={contract.documentation} target="_blank" rel="noopener noreferrer">
                                <BookOpen className="mr-2 h-3 w-3" />
                                Docs
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(
                              `const ${contract.name} = "${contract.address}";`
                            )}
                          >
                            <FileCode className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Integration Example */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Ejemplo de Integración (wagmi)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-background p-4 rounded-lg overflow-x-auto">
              <code>{`import { useReadContract } from 'wagmi';
import ANDETokenABI from './abis/ANDEToken.json';

const ANDE_TOKEN = '${CONTRACTS[0].address}';

export function TokenBalance({ address }) {
  const { data: balance } = useReadContract({
    address: ANDE_TOKEN,
    abi: ANDETokenABI,
    functionName: 'balanceOf',
    args: [address]
  });

  return <div>Balance: {balance?.toString()}</div>;
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
