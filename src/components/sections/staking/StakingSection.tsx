'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Loader, Lock, Unlock, TrendingUp, DollarSign, Calculator, Info,
  Plus, Calendar, Vote, Clock, CheckCircle2, AlertCircle,
  BarChart3, Zap
} from 'lucide-react';
import { TransactionLink } from '@/components/blockchain';
import { cn } from '@/lib/utils';

// Constantes
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_YEAR = 31536000;
const MAX_LOCK_YEARS = 4;

// ABIs necesarios
const VEANDE_ABI = [
  {
    name: 'lockedBalances',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256' }, { name: 'end', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'createLock',
    inputs: [{ name: 'amount', type: 'uint256' }, { name: 'unlockTime', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'withdraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'getVotes',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

const ANDE_TOKEN_ABI = [
  { name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
];

const ERC20_ABI = [
  { name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
];

const ERC4626_ABI = [
  { name: 'deposit', inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }], outputs: [{ name: 'shares', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
  { name: 'redeem', inputs: [{ name: 'shares', type: 'uint256' }, { name: 'receiver', type: 'address' }, { name: 'owner', type: 'address' }], outputs: [{ name: 'assets', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
  { name: 'totalAssets', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'convertToAssets', inputs: [{ name: 'shares', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
];

// Direcciones de contratos (actualizar con las reales cuando estén disponibles)
const VEANDE_ADDRESS = '0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf' as `0x${string}`;
const ANDE_TOKEN_ADDRESS = '0x851356ae760d987E095750cCeb3bC6014560891C' as `0x${string}`;
const ABOB_TOKEN_ADDRESS = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49' as `0x${string}`;
const SABOB_TOKEN_ADDRESS = '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf' as `0x${string}`;

// Utilidades
function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / SECONDS_PER_DAY);
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}${remainingDays > 0 ? ` y ${remainingDays} días` : ''}`;
  }
  return `${days} día${days !== 1 ? 's' : ''}`;
}

function calculateVotingPower(amount: bigint, lockDuration: number): bigint {
  const maxLockTime = BigInt(MAX_LOCK_YEARS * SECONDS_PER_YEAR);
  const duration = BigInt(lockDuration);
  return (amount * duration) / maxLockTime;
}

function calculateEarnings(principal: number, apy: number, days: number): number {
  return principal * (apy / 100) * (days / 365);
}

export default function StakingSection() {
  const { address, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [veandeTab, setVeandeTab] = useState('lock');

  // Estados para formularios
  const [lockAmount, setLockAmount] = useState('');
  const [lockDays, setLockDays] = useState('365');
  const [abobAmount, setAbobAmount] = useState('');
  const [now, setNow] = useState(0);
  const [estimatedAPY] = useState(5.0); // 5% APY para aBOB

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setNow(Date.now() / 1000);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, [isClient]);

  // --- Read Hooks - veANDE ---
  const { data: andeBalance, isLoading: isLoadingAnde, refetch: refetchAndeBalance } = useReadContract({
    address: ANDE_TOKEN_ADDRESS,
    abi: ANDE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected }
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ANDE_TOKEN_ADDRESS,
    abi: ANDE_TOKEN_ABI,
    functionName: 'allowance',
    args: [address!, VEANDE_ADDRESS],
    query: { enabled: isConnected }
  });

  const { data: lockedBalance, isLoading: isLoadingLock, refetch: refetchLock } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'lockedBalances',
    args: [address!],
    query: { enabled: isConnected }
  });

  const { data: veAndeBalance, isLoading: isLoadingVeAnde, refetch: refetchVeAnde } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected }
  });

  const { data: currentVotes } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'getVotes',
    args: [address!],
    query: { enabled: isConnected }
  });

  // --- Read Hooks - aBOB/sABOB ---
  const { data: abobBalance } = useReadContract({
    address: ABOB_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected }
  });

  const { data: sabobBalance } = useReadContract({
    address: SABOB_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected }
  });

  // --- Write Hooks ---
  const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract();
  const { data: lockHash, writeContract: createLock, isPending: isLocking } = useWriteContract();
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawing } = useWriteContract();

  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: lockSuccess } = useWaitForTransactionReceipt({ hash: lockHash });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  const refetchAll = () => {
    refetchAndeBalance();
    refetchAllowance();
    refetchLock();
    refetchVeAnde();
  };

  useWaitForTransactionReceipt({ hash: approveHash, onSuccess: refetchAllowance });
  useWaitForTransactionReceipt({ hash: lockHash, onSuccess: () => { refetchAll(); setLockAmount(''); } });
  useWaitForTransactionReceipt({ hash: withdrawHash, onSuccess: refetchAll });

  // Calculados
  const needsApproval = useMemo(() => {
    if (!lockAmount || !allowance) return false;
    return allowance < parseEther(lockAmount);
  }, [lockAmount, allowance]);

  const unlockTime = lockedBalance ? Number(lockedBalance[1]) : 0;
  const isLockExpired = unlockTime > 0 && now > unlockTime;
  const timeRemaining = unlockTime > 0 ? Math.max(0, unlockTime - now) : 0;
  const hasActiveLock = lockedBalance && lockedBalance[0] > 0;

  const estimatedVotingPower = lockAmount && lockDays
    ? calculateVotingPower(parseEther(lockAmount), parseInt(lockDays) * SECONDS_PER_DAY)
    : 0n;

  const votingPowerPercentage = lockedBalance && lockedBalance[0] > 0n
    ? Number((currentVotes || 0n) * 100n / lockedBalance[0])
    : 0;

  // Calculadoras de rendimientos para aBOB
  const estimatedDailyEarnings = abobAmount ? calculateEarnings(parseFloat(abobAmount), estimatedAPY, 1) : 0;
  const estimatedMonthlyEarnings = abobAmount ? calculateEarnings(parseFloat(abobAmount), estimatedAPY, 30) : 0;
  const estimatedYearlyEarnings = abobAmount ? calculateEarnings(parseFloat(abobAmount), estimatedAPY, 365) : 0;

  // Handlers
  const handleApprove = () => {
    if (!lockAmount) return;
    approve({
      address: ANDE_TOKEN_ADDRESS,
      abi: ANDE_TOKEN_ABI,
      functionName: 'approve',
      args: [VEANDE_ADDRESS, parseEther(lockAmount)]
    });
  };

  const handleCreateLock = () => {
    if (!lockAmount || !lockDays) return;
    const amount = parseEther(lockAmount);
    const duration = parseInt(lockDays) * SECONDS_PER_DAY;
    const unlockTimestamp = Math.floor(Date.now() / 1000) + duration;

    createLock({
      address: VEANDE_ADDRESS,
      abi: VEANDE_ABI,
      functionName: 'createLock',
      args: [amount, BigInt(unlockTimestamp)]
    });
  };

  const handleWithdraw = () => {
    withdraw({
      address: VEANDE_ADDRESS,
      abi: VEANDE_ABI,
      functionName: 'withdraw'
    });
  };

  const handleIncreaseLock = () => {
    if (!lockAmount) return;
    const amount = parseEther(lockAmount);
    createLock({
      address: VEANDE_ADDRESS,
      abi: VEANDE_ABI,
      functionName: 'createLock',
      args: [amount, BigInt(unlockTime)]
    });
  };

  const handleExtendLock = () => {
    if (!lockDays) return;
    const duration = parseInt(lockDays) * SECONDS_PER_DAY;
    const newUnlockTime = Math.floor(Date.now() / 1000) + duration;

    createLock({
      address: VEANDE_ADDRESS,
      abi: VEANDE_ABI,
      functionName: 'createLock',
      args: [0n, BigInt(newUnlockTime)]
    });
  };

  if (!isClient) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="w-8 h-8 text-green-500" />
                Staking - AndeChain
              </CardTitle>
              <CardDescription>Cargando sistema de staking...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    );
  }

  if (!isConnected) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Staking - AndeChain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, conecta tu billetera para acceder a todas las opciones de staking.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Staking & Yield Farming
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Multiplica tus activos en AndeChain. Bloquea ANDE para poder de voto o stakea aBOB para generar rendimientos sostenibles.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-800">
              veANDE Governance
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-800">
              aBOB Yield 5%
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-800">
              Dual Tokenomics
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-800">
              Sustainable Yields
            </Badge>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="veande" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              veANDE
            </TabsTrigger>
            <TabsTrigger value="abob" className="gap-2">
              <DollarSign className="w-4 h-4" />
              aBOB
            </TabsTrigger>
          </TabsList>

          {/* Vista General */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stats veANDE */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Vote className="w-5 h-5 mr-2" />
                    veANDE - Poder de Voto
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Bloquea ANDE para obtener poder de voto en la gobernanza
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">ANDE Bloqueado</p>
                      <p className="text-lg font-bold text-purple-400">
                        {lockedBalance ? formatEther(lockedBalance[0]) : '0.0'}
                      </p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Poder de Voto</p>
                      <p className="text-lg font-bold text-green-400">
                        {currentVotes ? formatEther(currentVotes) : '0.0'}
                      </p>
                    </div>
                  </div>

                  {hasActiveLock && (
                    <Alert variant="info" className="border-purple-800 bg-purple-950/20">
                      <Lock className="h-4 w-4 text-purple-400" />
                      <AlertDescription className="text-purple-300">
                        Tu bloqueo finaliza en: {formatDuration(timeRemaining)}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveTab('veande')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Gestionar veANDE
                  </Button>
                </CardContent>
              </Card>

              {/* Stats aBOB */}
              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <DollarSign className="w-5 h-5 mr-2" />
                    aBOB - Rendimientos
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Stakea aBOB para generar rendimientos pasivos
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-800">
                      APY: {estimatedAPY}%
                    </Badge>
                    <span className="text-xs text-gray-400">Rendimiento anual</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <DollarSign className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Disponible</span>
                      </div>
                      <p className="text-lg font-bold text-blue-400">
                        {abobBalance ? parseFloat(formatEther(abobBalance)).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-xs text-gray-500">aBOB</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-gray-400">Stakeado</span>
                      </div>
                      <p className="text-lg font-bold text-green-400">
                        {sabobBalance ? parseFloat(formatEther(sabobBalance)).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-xs text-gray-500">sABOB</p>
                    </div>
                  </div>

                  <Alert className="border-green-800 bg-green-950/20">
                    <Zap className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300 text-sm">
                      sABOB genera rendimientos a través de las actividades del protocolo con un APY competitivo y sostenible.
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('abob')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Gestionar aBOB
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Resumen General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumen de Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">
                      {andeBalance ? formatEther(andeBalance) : '0.0'}
                    </p>
                    <p className="text-sm text-muted-foreground">ANDE Disponible</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-400">
                      {lockedBalance ? formatEther(lockedBalance[0]) : '0.0'}
                    </p>
                    <p className="text-sm text-muted-foreground">ANDE Bloqueado</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">
                      {abobBalance ? formatEther(abobBalance) : '0.0'}
                    </p>
                    <p className="text-sm text-muted-foreground">aBOB Balance</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">
                      {sabobBalance ? formatEther(sabobBalance) : '0.0'}
                    </p>
                    <p className="text-sm text-muted-foreground">sABOB Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking veANDE */}
          <TabsContent value="veande" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Staking veANDE - Poder de Voto
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Bloquea tus ANDE para obtener poder de voto (veANDE) y participar en la gobernanza
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={veandeTab} onValueChange={setVeandeTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="lock">
                      <Lock className="h-4 w-4 mr-2" />
                      Crear Lock
                    </TabsTrigger>
                    <TabsTrigger value="increase" disabled={!hasActiveLock}>
                      <Plus className="h-4 w-4 mr-2" />
                      Aumentar
                    </TabsTrigger>
                    <TabsTrigger value="extend" disabled={!hasActiveLock}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Extender
                    </TabsTrigger>
                    <TabsTrigger value="withdraw" disabled={!isLockExpired}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Retirar
                    </TabsTrigger>
                  </TabsList>

                  {/* Crear Lock */}
                  <TabsContent value="lock" className="space-y-4">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Bloquea tus tokens ANDE por un período de tiempo para recibir veANDE (poder de voto).
                            Máximo 4 años de bloqueo para máximo poder de voto.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Cantidad de ANDE</label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={lockAmount}
                              onChange={(e) => setLockAmount(e.target.value)}
                              disabled={isApproving || isLocking}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Disponible: {andeBalance ? formatEther(andeBalance) : '0.0'} ANDE
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Días de bloqueo</label>
                            <Input
                              type="number"
                              placeholder="365"
                              value={lockDays}
                              onChange={(e) => setLockDays(e.target.value)}
                              max={MAX_LOCK_YEARS * 365}
                              disabled={isApproving || isLocking}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Máximo: {MAX_LOCK_YEARS * 365} días ({MAX_LOCK_YEARS} años)
                            </p>
                          </div>

                          {lockAmount && lockDays && (
                            <Card className="bg-muted/50">
                              <CardContent className="pt-4">
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Poder de voto estimado:</span>
                                    <span className="font-bold text-primary">
                                      {formatEther(estimatedVotingPower)} veANDE
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha de desbloqueo:</span>
                                    <span className="font-medium">
                                      {new Date(Date.now() + parseInt(lockDays) * SECONDS_PER_DAY * 1000).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {needsApproval ? (
                            <Button
                              onClick={handleApprove}
                              disabled={!lockAmount || isApproving}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              {isApproving ? (
                                <>
                                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                                  Aprobando...
                                </>
                              ) : (
                                <>
                                  Aprobar ANDE
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={handleCreateLock}
                              disabled={!lockAmount || !lockDays || isLocking}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              {isLocking ? (
                                <>
                                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                                  Bloqueando...
                                </>
                              ) : (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Crear Lock
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Balance de ANDE</p>
                            <p className="text-2xl font-bold text-purple-400">
                              {andeBalance ? formatEther(andeBalance) : '0.0'}
                            </p>
                          </div>
                          <div className="p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">ANDE Bloqueado</p>
                            <p className="text-2xl font-bold text-pink-400">
                              {lockedBalance ? formatEther(lockedBalance[0]) : '0.0'}
                            </p>
                          </div>
                          <div className="p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-gray-400 mb-1">Poder de Voto</p>
                            <p className="text-2xl font-bold text-green-400">
                              {currentVotes ? formatEther(currentVotes) : '0.0'}
                            </p>
                          </div>
                        </div>

                        {hasActiveLock && (
                          <Alert variant="info" className="border-purple-800 bg-purple-950/20">
                            <Clock className="h-4 w-4 text-purple-400" />
                            <AlertDescription className="text-purple-300">
                              Tu bloqueo finaliza en: {formatDuration(timeRemaining)}
                            </AlertDescription>
                          </Alert>
                        )}

                        {hasActiveLock && !isLockExpired && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Decaimiento del Poder de Voto</CardTitle>
                              <CardDescription>
                                Tu poder de voto decae linealmente hasta la fecha de desbloqueo
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <Progress value={votingPowerPercentage} className="h-2" />
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>0 veANDE</span>
                                <span>{votingPowerPercentage.toFixed(2)}%</span>
                                <span>{formatEther(lockedBalance[0])} veANDE (máx)</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {(approveHash || lockHash) && (
                      <Alert className={cn(
                        approveSuccess || lockSuccess ? "border-green-500/50 bg-green-500/10" : "border-yellow-500/50 bg-yellow-500/10"
                      )}>
                        <div className="flex items-start gap-3">
                          {approveSuccess || lockSuccess ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <Loader className="h-5 w-5 text-yellow-500 animate-spin mt-0.5" />
                          )}
                          <div className="flex-1 space-y-2">
                            <AlertDescription className="font-medium">
                              {approveSuccess && '✅ Aprobación exitosa'}
                              {lockSuccess && '✅ Lock creado exitosamente'}
                              {!approveSuccess && !lockSuccess && '⏳ Procesando transacción...'}
                            </AlertDescription>
                            <TransactionLink
                              txHash={lockHash || approveHash || '0x'}
                              label="Ver en Blockscout"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </Alert>
                    )}
                  </TabsContent>

                  {/* Aumentar Lock */}
                  <TabsContent value="increase" className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Añade más tokens ANDE a tu lock existente sin modificar la fecha de desbloqueo.
                      </AlertDescription>
                    </Alert>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Cantidad adicional de ANDE</label>
                          <Input
                            type="number"
                            placeholder="0.0"
                            value={lockAmount}
                            onChange={(e) => setLockAmount(e.target.value)}
                          />
                        </div>

                        {needsApproval ? (
                          <Button onClick={handleApprove} disabled={!lockAmount || isApproving} className="w-full bg-purple-600 hover:bg-purple-700">
                            {isApproving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Aprobar ANDE
                          </Button>
                        ) : (
                          <Button onClick={handleIncreaseLock} disabled={!lockAmount || isLocking} className="w-full bg-purple-600 hover:bg-purple-700">
                            {isLocking && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            <Plus className="mr-2 h-4 w-4" />
                            Aumentar Lock
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Extender Lock */}
                  <TabsContent value="extend" className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Extiende el tiempo de bloqueo de tus tokens para aumentar tu poder de voto.
                      </AlertDescription>
                    </Alert>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Nuevos días de bloqueo (desde ahora)</label>
                          <Input
                            type="number"
                            placeholder="365"
                            value={lockDays}
                            onChange={(e) => setLockDays(e.target.value)}
                            max={MAX_LOCK_YEARS * 365}
                          />
                        </div>

                        <Button onClick={handleExtendLock} disabled={!lockDays || isLocking} className="w-full bg-purple-600 hover:bg-purple-700">
                          {isLocking && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          <Calendar className="mr-2 h-4 w-4" />
                          Extender Lock
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Retirar */}
                  <TabsContent value="withdraw" className="space-y-4">
                    <Alert>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        Tu lock ha expirado. Puedes retirar tus tokens ANDE bloqueados.
                      </AlertDescription>
                    </Alert>

                    <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full bg-red-600 hover:bg-red-700">
                      {isWithdrawing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                      <Unlock className="mr-2 h-4 w-4" />
                      Retirar {lockedBalance ? formatEther(lockedBalance[0]) : '0.0'} ANDE
                    </Button>

                    {withdrawHash && (
                      <Alert className={cn(
                        withdrawSuccess ? "border-green-500/50 bg-green-500/10" : "border-yellow-500/50 bg-yellow-500/10"
                      )}>
                        <div className="flex items-start gap-3">
                          {withdrawSuccess ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <Loader className="h-5 w-5 text-yellow-500 animate-spin mt-0.5" />
                          )}
                          <div className="flex-1 space-y-2">
                            <AlertDescription className="font-medium">
                              {withdrawSuccess ? '✅ Retiro exitoso' : '⏳ Procesando retiro...'}
                            </AlertDescription>
                            <TransactionLink
                              txHash={withdrawHash}
                              label="Ver en Blockscout"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </Alert>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking aBOB */}
          <TabsContent value="abob" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Staking aBOB - Rendimientos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Stakea tus tokens aBOB (Boliviano) para recibir sABOB y generar rendimientos con {estimatedAPY}% APY
                </CardDescription>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-500/20 text-green-400 border-green-800">
                    APY: {estimatedAPY}%
                  </Badge>
                  <span className="text-xs text-gray-400">Rendimiento anual</span>
                </div>
              </CardHeader>
              <CardContent className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Depositar aBOB</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Cantidad de aBOB a depositar</label>
                        <Input
                          placeholder="0.0"
                          value={abobAmount}
                          onChange={e => setAbobAmount(e.target.value)}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Balance: {abobBalance ? formatEther(abobBalance) : '0.00'} aBOB</span>
                          <Button variant="link" className="text-green-400 p-0 h-auto text-xs">
                            MAX
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700" disabled={!abobAmount}>
                        <Lock className="w-4 h-4 mr-2" />
                        Stake aBOB
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Retirar sABOB</CardTitle></CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full border-red-800 text-red-400">
                        <Unlock className="w-4 h-4 mr-2" />
                        Unstake
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <DollarSign className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Disponible</span>
                      </div>
                      <p className="text-lg font-bold text-blue-400">
                        {abobBalance ? parseFloat(formatEther(abobBalance)).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-xs text-gray-500">aBOB</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-gray-400">Stakeado</span>
                      </div>
                      <p className="text-lg font-bold text-green-400">
                        {sabobBalance ? parseFloat(formatEther(sabobBalance)).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-xs text-gray-500">sABOB</p>
                    </div>
                  </div>

                  {abobAmount && (
                    <div className="p-3 bg-black/20 rounded-lg space-y-2">
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

                  <Alert className="border-green-800 bg-green-950/20">
                    <Info className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300 text-sm">
                      sABOB es un token de liquidez que representa tu participación en el pool de staking.
                      Los rendimientos se generan a través de las actividades del protocolo AndeChain.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}