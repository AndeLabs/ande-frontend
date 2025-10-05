'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  Loader,
  CheckCircle2,
  AlertCircle,
  Info,
  Plus,
  Calendar,
  Vote
} from 'lucide-react';
import { TransactionLink } from '@/components/blockchain';
import { cn } from '@/lib/utils';

// ABIs necesarios para veANDE y ANDE
const VEANDE_ABI = [
  {
    name: 'lockedBalances',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'end', type: 'uint256' }
    ],
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
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'unlockTime', type: 'uint256' }
    ],
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
    name: 'MAX_LOCK_TIME',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
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

const ANDE_ABI = [
  {
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Direcciones de contratos (actualizar con las reales)
const VEANDE_ADDRESS = '0x...' as `0x${string}`;
const ANDE_ADDRESS = '0x...' as `0x${string}`;

// Utilidades de tiempo
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_YEAR = 31536000;
const MAX_LOCK_YEARS = 4;

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

export function StakingVeANDE() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('lock');

  // Estados para el formulario de lock
  const [lockAmount, setLockAmount] = useState('');
  const [lockDays, setLockDays] = useState('365');
  const [needsApproval, setNeedsApproval] = useState(true);

  // Leer datos del contrato
  const { data: andeBalance } = useReadContract({
    address: ANDE_ADDRESS,
    abi: ANDE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: allowance } = useReadContract({
    address: ANDE_ADDRESS,
    abi: ANDE_ABI,
    functionName: 'allowance',
    args: address ? [address, VEANDE_ADDRESS] : undefined,
    query: { enabled: !!address }
  });

  const { data: lockedBalance } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'lockedBalances',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: votingPower } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: currentVotes } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Escribir contratos
  const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract();
  const { data: lockHash, writeContract: lock, isPending: isLocking } = useWriteContract();
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawing } = useWriteContract();

  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: lockSuccess } = useWaitForTransactionReceipt({ hash: lockHash });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Calcular unlock time
  const unlockTime = lockedBalance ? Number(lockedBalance[1]) : 0;
  const isLockExpired = unlockTime > 0 && Date.now() / 1000 > unlockTime;
  const timeRemaining = unlockTime > 0 ? Math.max(0, unlockTime - Date.now() / 1000) : 0;

  // Verificar si necesita aprobación
  useEffect(() => {
    if (lockAmount && allowance !== undefined) {
      const amountWei = parseEther(lockAmount);
      setNeedsApproval(allowance < amountWei);
    }
  }, [lockAmount, allowance]);

  const handleApprove = () => {
    if (!lockAmount) return;
    approve({
      address: ANDE_ADDRESS,
      abi: ANDE_ABI,
      functionName: 'approve',
      args: [VEANDE_ADDRESS, parseEther(lockAmount)]
    });
  };

  const handleLock = () => {
    if (!lockAmount || !lockDays) return;
    const amount = parseEther(lockAmount);
    const duration = parseInt(lockDays) * SECONDS_PER_DAY;
    const unlockTimestamp = Math.floor(Date.now() / 1000) + duration;

    lock({
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
    // Mantener el unlock time actual
    lock({
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

    lock({
      address: VEANDE_ADDRESS,
      abi: VEANDE_ABI,
      functionName: 'createLock',
      args: [0n, BigInt(newUnlockTime)]
    });
  };

  // Calcular poder de voto estimado
  const estimatedVotingPower = lockAmount && lockDays
    ? calculateVotingPower(parseEther(lockAmount), parseInt(lockDays) * SECONDS_PER_DAY)
    : 0n;

  const votingPowerPercentage = lockedBalance && lockedBalance[0] > 0n
    ? Number((votingPower || 0n) * 100n / lockedBalance[0])
    : 0;

  if (!isConnected) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Staking veANDE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, conecta tu billetera para acceder al staking de ANDE.
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
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            veANDE Staking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bloquea tus tokens ANDE para obtener poder de voto y participar en la gobernanza de AndeChain.
            Mayor tiempo de bloqueo = Mayor poder de voto.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                ANDE Bloqueado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lockedBalance ? formatEther(lockedBalance[0]) : '0.0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Poder de Voto Actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {votingPower ? formatEther(votingPower) : '0.0'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {votingPowerPercentage.toFixed(2)}% del bloqueado
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tiempo Restante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockTime > 0 ? (
                  isLockExpired ? (
                    <span className="text-green-500">Desbloqueado</span>
                  ) : (
                    formatDuration(timeRemaining)
                  )
                ) : (
                  'Sin bloqueo'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Balance ANDE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {andeBalance ? formatEther(andeBalance) : '0.0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Power Progress */}
        {lockedBalance && lockedBalance[0] > 0n && !isLockExpired && (
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

        {/* Main Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Gestionar Staking</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lock">
                  <Lock className="h-4 w-4 mr-2" />
                  Crear Lock
                </TabsTrigger>
                <TabsTrigger value="increase" disabled={!lockedBalance || lockedBalance[0] === 0n}>
                  <Plus className="h-4 w-4 mr-2" />
                  Aumentar
                </TabsTrigger>
                <TabsTrigger value="extend" disabled={!lockedBalance || lockedBalance[0] === 0n}>
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
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Bloquea tus tokens ANDE por un período de tiempo para recibir veANDE (poder de voto).
                    Máximo 4 años de bloqueo.
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
                      className="w-full"
                    >
                      {isApproving ? (
                        <><Loader className="mr-2 h-4 w-4 animate-spin" /> Aprobando...</>
                      ) : (
                        <>Aprobar ANDE</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLock}
                      disabled={!lockAmount || !lockDays || isLocking}
                      className="w-full"
                    >
                      {isLocking ? (
                        <><Loader className="mr-2 h-4 w-4 animate-spin" /> Bloqueando...</>
                      ) : (
                        <><Lock className="mr-2 h-4 w-4" /> Crear Lock</>
                      )}
                    </Button>
                  )}
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
                    <Button onClick={handleApprove} disabled={!lockAmount || isApproving} className="w-full">
                      {isApproving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Aprobar ANDE
                    </Button>
                  ) : (
                    <Button onClick={handleIncreaseLock} disabled={!lockAmount || isLocking} className="w-full">
                      {isLocking ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Aumentar Lock
                    </Button>
                  )}
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

                  <Button onClick={handleExtendLock} disabled={!lockDays || isLocking} className="w-full">
                    {isLocking ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                    Extender Lock
                  </Button>
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

                <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full" variant="default">
                  {isWithdrawing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
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
      </div>
    </section>
  );
}
