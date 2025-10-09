'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Unlock,
  TrendingUp,
  DollarSign,
  Calculator,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react';

interface StakingWidgetProps {
  expanded?: boolean;
}

const ABOB_ADDRESS = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49';
const SABOB_ADDRESS = '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf';

const ERC20_ABI = [
  { name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }
];

const ERC4626_ABI = [
  { name: 'deposit', inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }], outputs: [{ name: 'shares', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
  { name: 'redeem', inputs: [{ name: 'shares', type: 'uint256' }, { name: 'receiver', type: 'address' }, { name: 'owner', type: 'address' }], outputs: [{ name: 'assets', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
  { name: 'totalAssets', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'convertToAssets', inputs: [{ name: 'shares', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'convertToShares', inputs: [{ name: 'assets', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }
];

export function StakingWidget({ expanded = false }: StakingWidgetProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [estimatedAPY] = useState(5.0); // 5% APY

  // Mock data para演示
  const { data: abobBalance } = useReadContract({
    address: ABOB_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: sabobBalance } = useReadContract({
    address: SABOB_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });

  const calculateEarnings = (principal: number, apy: number, days: number) => {
    return principal * (apy / 100) * (days / 365);
  };

  const estimatedDailyEarnings = amount ? calculateEarnings(parseFloat(amount), estimatedAPY, 1) : 0;
  const estimatedMonthlyEarnings = amount ? calculateEarnings(parseFloat(amount), estimatedAPY, 30) : 0;
  const estimatedYearlyEarnings = amount ? calculateEarnings(parseFloat(amount), estimatedAPY, 365) : 0;

  return (
    <div className={expanded ? "space-y-6" : ""}>
      {/* Widget Compacto */}
      <Card className={`bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30 ${expanded ? 'col-span-1' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-green-400">
            <Lock className="w-5 h-5 mr-2" />
            Staking aBOB
          </CardTitle>
          <CardDescription className="text-gray-400">
            Genera rendimientos con tus tokens aBOB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* APY Badge */}
          <div className="flex items-center justify-between">
            <Badge className="bg-green-500/20 text-green-400 border-green-800">
              APY: {estimatedAPY}%
            </Badge>
            <span className="text-xs text-gray-400">Rendimiento anual</span>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Disponible</span>
              </div>
              <p className="text-lg font-bold text-blue-400 mt-1">
                {abobBalance ? parseFloat(formatEther(abobBalance)).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-gray-500">aBOB</p>
            </div>

            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Stakeado</span>
              </div>
              <p className="text-lg font-bold text-green-400 mt-1">
                {sabobBalance ? parseFloat(formatEther(sabobBalance)).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-gray-500">sABOB</p>
            </div>
          </div>

          {/* Formulario de Staking (versión compacta) */}
          {!expanded && (
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="Cantidad de aBOB"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/20 border-gray-700"
              />
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Lock className="w-4 h-4 mr-2" />
                Stake aBOB
              </Button>
            </div>
          )}

          {/* Estimaciones de Ganancias */}
          {amount && (
            <div className="space-y-2 p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400 flex items-center">
                <Calculator className="w-4 h-4 mr-1" />
                Ganancias estimadas
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-green-400 font-bold">{estimatedDailyEarnings.toFixed(4)}</p>
                  <p className="text-gray-500">Diario</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold">{estimatedMonthlyEarnings.toFixed(2)}</p>
                  <p className="text-gray-500">Mensual</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold">{estimatedYearlyEarnings.toFixed(2)}</p>
                  <p className="text-gray-500">Anual</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista Expandida */}
      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Staking */}
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Lock className="w-5 h-5 mr-2" />
                Staking Activo
              </CardTitle>
              <CardDescription className="text-gray-400">
                Deposita tus aBOB para recibir sABOB y generar rendimientos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Cantidad a depositar</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/20 border-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Balance: {abobBalance ? parseFloat(formatEther(abobBalance)).toFixed(2) : '0.00'} aBOB</span>
                  <Button variant="link" className="text-green-400 p-0 h-auto text-xs">
                    MAX
                  </Button>
                </div>
              </div>

              {amount && (
                <div className="p-3 bg-black/20 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cantidad:</span>
                    <span className="text-white">{amount} aBOB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">APY:</span>
                    <span className="text-green-400">{estimatedAPY}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ganancia anual estimada:</span>
                    <span className="text-green-400 font-bold">{estimatedYearlyEarnings.toFixed(2)} aBOB</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Stake
                </Button>
                <Button variant="outline" className="border-red-800 text-red-400">
                  <Unlock className="w-4 h-4 mr-2" />
                  Unstake
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panel de Información */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <TrendingUp className="w-5 h-5 mr-2" />
                Estadísticas del Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Depositado:</span>
                  <span className="text-white font-bold">1.5M aBOB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Participantes:</span>
                  <span className="text-white font-bold">847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">APY Actual:</span>
                  <span className="text-green-400 font-bold">{estimatedAPY}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">TVL:</span>
                  <span className="text-white font-bold">$750,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Utilización del pool:</span>
                  <span className="text-white">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-black/30" />
              </div>

              <Alert className="border-blue-800 bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300 text-sm">
                  sABOB es un token de liquidez que representa tu participación en el pool de staking.
                  Los rendimientos se generan a través de las actividades del protocolo AndeChain.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="border-blue-800 text-blue-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Historial
                </Button>
                <Button variant="outline" className="border-blue-800 text-blue-400">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculadora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}