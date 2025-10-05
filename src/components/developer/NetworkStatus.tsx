'use client';

import { useState, useEffect } from 'react';
import { usePublicClient, useBlockNumber } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Zap, Fuel, Network, Server, TrendingUp } from 'lucide-react';

type NetworkStats = {
  blockNumber: bigint;
  gasPrice: bigint;
  chainId: number;
  tps: number;
  avgBlockTime: number;
  networkHashrate: string;
};

export function NetworkStatus() {
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<bigint[]>([]);
  const [blockTimes, setBlockTimes] = useState<number[]>([]);
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    if (publicClient && blockNumber) {
      fetchNetworkStats();
    }
  }, [blockNumber, publicClient]);

  const fetchNetworkStats = async () => {
    if (!publicClient || !blockNumber) return;

    try {
      const [gasPrice, chainIdData] = await Promise.all([
        publicClient.getGasPrice(),
        publicClient.getChainId()
      ]);

      // Fetch last 20 blocks to calculate TPS and block time
      const blocks = [];
      const timestamps = [];

      for (let i = 0; i < 20; i++) {
        try {
          const block = await publicClient.getBlock({
            blockNumber: blockNumber - BigInt(i)
          });
          blocks.push(block.number);
          timestamps.push(Number(block.timestamp));
        } catch (error) {
          console.error('Error fetching block:', error);
        }
      }

      // Calculate average block time
      const blockTimeDiffs = [];
      for (let i = 0; i < timestamps.length - 1; i++) {
        blockTimeDiffs.push(timestamps[i] - timestamps[i + 1]);
      }
      const avgBlockTime = blockTimeDiffs.length > 0
        ? blockTimeDiffs.reduce((a, b) => a + b, 0) / blockTimeDiffs.length
        : 0;

      // Calculate TPS (rough estimate)
      const tps = avgBlockTime > 0 ? 1 / avgBlockTime : 0;

      setStats({
        blockNumber,
        gasPrice,
        chainId: chainIdData,
        tps,
        avgBlockTime,
        networkHashrate: 'N/A' // Would need additional RPC methods
      });

      setRecentBlocks(blocks);
      setBlockTimes(blockTimeDiffs);
      setIsHealthy(avgBlockTime < 30); // Consider unhealthy if block time > 30s

    } catch (error) {
      console.error('Error fetching network stats:', error);
      setIsHealthy(false);
    }
  };

  const formatGwei = (wei: bigint) => {
    return (Number(wei) / 1e9).toFixed(2);
  };

  const getHealthColor = () => {
    if (!stats) return 'bg-gray-500';
    if (stats.avgBlockTime < 5) return 'bg-green-500';
    if (stats.avgBlockTime < 15) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGasPriceLevel = () => {
    if (!stats) return { level: 'Unknown', color: 'default' as const };
    const gwei = Number(stats.gasPrice) / 1e9;
    if (gwei < 1) return { level: 'Low', color: 'default' as const };
    if (gwei < 10) return { level: 'Medium', color: 'secondary' as const };
    return { level: 'High', color: 'destructive' as const };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Network Status
            </CardTitle>
            <CardDescription>Estado en tiempo real de AndeChain</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${getHealthColor()} animate-pulse`} />
            <Badge variant={isHealthy ? 'default' : 'destructive'}>
              {isHealthy ? 'Healthy' : 'Degraded'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Block Number</p>
              </div>
              <p className="text-2xl font-bold font-mono">
                {stats?.blockNumber.toString() || '---'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Avg Block Time</p>
              </div>
              <p className="text-2xl font-bold">
                {stats ? stats.avgBlockTime.toFixed(2) : '---'}
                <span className="text-sm font-normal ml-1">s</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Gas Price</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold font-mono">
                  {stats ? formatGwei(stats.gasPrice) : '---'}
                </p>
                <Badge variant={getGasPriceLevel().color} className="text-xs">
                  {getGasPriceLevel().level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Gwei</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Chain ID</p>
              </div>
              <p className="text-2xl font-bold font-mono">
                {stats?.chainId || '---'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Metrics
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Block Production Rate</span>
                <span className="font-mono font-medium">
                  {stats ? (stats.tps * 60).toFixed(1) : '0'} blocks/min
                </span>
              </div>
              <Progress
                value={stats ? Math.min((stats.tps * 60 / 12) * 100, 100) : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Network Stability</span>
                <span className="font-mono font-medium">
                  {blockTimes.length > 0
                    ? Math.max(0, 100 - (Math.max(...blockTimes) - Math.min(...blockTimes))).toFixed(0)
                    : '0'}%
                </span>
              </div>
              <Progress
                value={
                  blockTimes.length > 0
                    ? Math.max(0, 100 - (Math.max(...blockTimes) - Math.min(...blockTimes)))
                    : 0
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Gas Efficiency</span>
                <span className="font-mono font-medium">
                  {stats ? Math.min(100, 100 - Number(formatGwei(stats.gasPrice))).toFixed(0) : '0'}%
                </span>
              </div>
              <Progress
                value={stats ? Math.min(100, 100 - Number(formatGwei(stats.gasPrice))) : 0}
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Recent Block Times Chart (ASCII-like) */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Block Time History (últimos 20 bloques)</h3>
          <div className="flex items-end gap-1 h-20 bg-muted/50 rounded-lg p-2">
            {blockTimes.slice(0, 20).reverse().map((time, idx) => {
              const maxTime = Math.max(...blockTimes);
              const height = maxTime > 0 ? (time / maxTime) * 100 : 0;
              return (
                <div
                  key={idx}
                  className="flex-1 bg-primary rounded-t transition-all hover:opacity-80"
                  style={{ height: `${height}%`, minHeight: '2px' }}
                  title={`Block time: ${time.toFixed(2)}s`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-20 blocks</span>
            <span>Latest</span>
          </div>
        </div>

        {/* RPC Endpoint Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">RPC Endpoint:</span>
                <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                  http://localhost:8545
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WebSocket:</span>
                <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                  ws://localhost:8545
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
