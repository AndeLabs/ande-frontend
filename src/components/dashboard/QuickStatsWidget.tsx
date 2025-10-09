'use client';

import { useAccount, useBalance, useBlockNumber, useChainId } from 'wagmi';
import { andechain } from '@/lib/blockchain/config';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Coins,
  Zap,
  TrendingUp,
  Shield,
  Users
} from 'lucide-react';

export function QuickStatsWidget() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainId();

  const stats = [
    {
      title: 'Balance ANDE',
      value: balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000',
      unit: 'ANDE',
      icon: Coins,
      color: 'text-ande-blue',
      bgColor: 'bg-ande-blue/10',
      borderColor: 'border-ande-blue/30'
    },
    {
      title: 'Bloque Actual',
      value: blockNumber?.toString() || 'N/A',
      unit: '',
      icon: Activity,
      color: 'text-ande-lavender',
      bgColor: 'bg-ande-lavender/10',
      borderColor: 'border-ande-lavender/30'
    },
    {
      title: 'Network ID',
      value: chainId.toString(),
      unit: '',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Gas Estimado',
      value: '0.0001',
      unit: 'ANDE',
      icon: Zap,
      color: 'text-ande-orange',
      bgColor: 'bg-ande-orange/10',
      borderColor: 'border-ande-orange/30'
    },
    {
      title: 'Tasa Deflación',
      value: '2.5',
      unit: '%',
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      title: 'Validadores',
      value: '12',
      unit: 'Activos',
      icon: Users,
      color: 'text-ande-peach',
      bgColor: 'bg-ande-peach/10',
      borderColor: 'border-ande-peach/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm transition-all duration-300 hover:scale-105`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-ande-gray mb-1">{stat.title}</p>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-foreground">{stat.value}</span>
                    {stat.unit && (
                      <span className="text-xs text-ande-gray ml-1">{stat.unit}</span>
                    )}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}