'use client';

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Box, FileText, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type Block = {
  number: bigint;
  hash: string;
  timestamp: bigint;
  transactions: string[];
  gasUsed: bigint;
  gasLimit: bigint;
  miner: string;
};

type Transaction = {
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice: bigint;
  blockNumber: bigint;
  blockHash: string;
  status: string;
};

export function ChainExplorer() {
  const publicClient = usePublicClient();
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLatestBlocks();

    if (autoRefresh) {
      const interval = setInterval(fetchLatestBlocks, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, publicClient]);

  const fetchLatestBlocks = async () => {
    if (!publicClient) return;

    try {
      const blockNumber = await publicClient.getBlockNumber();
      const blocks: Block[] = [];

      for (let i = 0; i < 10; i++) {
        const block = await publicClient.getBlock({
          blockNumber: blockNumber - BigInt(i),
          includeTransactions: false
        });
        blocks.push(block as any);
      }

      setLatestBlocks(blocks);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const handleSearch = async () => {
    if (!publicClient || !searchQuery) return;

    setIsLoading(true);
    setSearchResult(null);

    try {
      // Try as transaction hash
      if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        const tx = await publicClient.getTransaction({ hash: searchQuery as `0x${string}` });
        const receipt = await publicClient.getTransactionReceipt({ hash: searchQuery as `0x${string}` });
        setSearchResult({ type: 'transaction', data: { ...tx, status: receipt.status } });
      }
      // Try as block number
      else if (/^\d+$/.test(searchQuery)) {
        const block = await publicClient.getBlock({
          blockNumber: BigInt(searchQuery),
          includeTransactions: true
        });
        setSearchResult({ type: 'block', data: block });
      }
      // Try as block hash
      else if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        const block = await publicClient.getBlock({
          blockHash: searchQuery as `0x${string}`,
          includeTransactions: true
        });
        setSearchResult({ type: 'block', data: block });
      }
      // Try as address
      else if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
        const balance = await publicClient.getBalance({ address: searchQuery as `0x${string}` });
        const code = await publicClient.getBytecode({ address: searchQuery as `0x${string}` });
        setSearchResult({
          type: 'address',
          data: {
            address: searchQuery,
            balance,
            isContract: code && code.length > 2
          }
        });
      }
    } catch (error: any) {
      setSearchResult({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const formatGwei = (wei: bigint) => {
    return (Number(wei) / 1e9).toFixed(2);
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Chain Explorer
            </CardTitle>
            <CardDescription>Explora bloques, transacciones y direcciones en tiempo real</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por hash de tx, número de bloque, hash de bloque o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="font-mono text-sm"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        {searchResult && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Resultado de Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              {searchResult.type === 'error' ? (
                <p className="text-destructive text-sm">{searchResult.message}</p>
              ) : searchResult.type === 'block' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Number:</span>
                    <span className="font-mono font-bold">{searchResult.data.number.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hash:</span>
                    <span className="font-mono text-xs">{searchResult.data.hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transactions:</span>
                    <span className="font-bold">{searchResult.data.transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Used:</span>
                    <span className="font-mono">{formatGwei(searchResult.data.gasUsed)} Gwei</span>
                  </div>
                </div>
              ) : searchResult.type === 'transaction' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={searchResult.data.status === 'success' ? 'default' : 'destructive'}>
                      {searchResult.data.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-mono text-xs">{searchResult.data.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-mono text-xs">{searchResult.data.to || 'Contract Creation'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-mono">{formatEther(searchResult.data.value)} ANDE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block:</span>
                    <span className="font-mono">{searchResult.data.blockNumber.toString()}</span>
                  </div>
                </div>
              ) : searchResult.type === 'address' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-mono text-xs">{searchResult.data.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-mono font-bold">{formatEther(searchResult.data.balance)} ANDE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge>{searchResult.data.isContract ? 'Contract' : 'EOA'}</Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Latest Blocks */}
        <Tabs defaultValue="blocks">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks">
              <Box className="h-4 w-4 mr-2" />
              Últimos Bloques
            </TabsTrigger>
            <TabsTrigger value="stats">
              <FileText className="h-4 w-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blocks" className="space-y-2">
            {latestBlocks.map((block) => (
              <Card key={block.hash} className="hover:border-primary cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{block.number.toString()}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(Number(block.timestamp) * 1000), {
                            addSuffix: true,
                            locale: es
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {block.hash.slice(0, 20)}...
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="text-lg font-bold">{block.transactions.length}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Gas Used: </span>
                      <span className="font-mono">{formatGwei(block.gasUsed)} Gwei</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Limit: </span>
                      <span className="font-mono">{formatGwei(block.gasLimit)} Gwei</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stats">
            {latestBlocks.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Latest Block</p>
                    <p className="text-2xl font-bold">#{latestBlocks[0].number.toString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Avg Block Time</p>
                    <p className="text-2xl font-bold">
                      {latestBlocks.length > 1
                        ? ((Number(latestBlocks[0].timestamp) - Number(latestBlocks[9].timestamp)) / 9).toFixed(1)
                        : '0'}s
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Txs (últimos 10)</p>
                    <p className="text-2xl font-bold">
                      {latestBlocks.reduce((acc, block) => acc + block.transactions.length, 0)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Avg Gas Usage</p>
                    <p className="text-2xl font-bold">
                      {formatGwei(
                        BigInt(
                          Math.floor(
                            latestBlocks.reduce((acc, block) => acc + Number(block.gasUsed), 0) /
                              latestBlocks.length
                          )
                        )
                      )}{' '}
                      Gwei
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
