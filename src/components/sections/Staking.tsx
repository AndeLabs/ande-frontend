'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Lock, Unlock } from 'lucide-react';

// ABIs
const VE_ANDE_ABI = [
    { name: 'lockedBalances', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: 'amount', type: 'uint256' }, { name: 'end', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'balanceOf', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'createLock', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'unlockTime', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { name: 'withdraw', inputs: [], outputs: [], stateMutability: 'nonpayable', type: 'function' },
];
const ANDE_TOKEN_ABI = [
    { name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
];

// Direcciones
const VE_ANDE_ADDRESS = '0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf';
const ANDE_TOKEN_ADDRESS = '0x851356ae760d987E095750cCeb3bC6014560891C';

function BalanceDisplay({ title, value, symbol, isLoading }) {
    return (
        <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
                <div className="h-6 w-3/4 bg-muted-foreground/20 rounded animate-pulse mt-1"></div>
            ) : (
                <p className="text-2xl font-bold">{value} <span className="text-lg font-medium text-muted-foreground">{symbol}</span></p>
            )}
        </div>
    );
}

export function Staking() {
    const { address, isConnected } = useAccount();
    const [lockAmount, setLockAmount] = useState('');
    const [lockDate, setLockDate] = useState('');
    const [now, setNow] = useState(Date.now() / 1000);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
        return () => clearInterval(interval);
    }, []);

    // --- Read Hooks ---
    const { data: andeBalance, isLoading: isLoadingAnde, refetch: refetchAndeBalance } = useReadContract({ address: ANDE_TOKEN_ADDRESS, abi: ANDE_TOKEN_ABI, functionName: 'balanceOf', args: [address!], query: { enabled: isConnected } });
    const { data: allowance, refetch: refetchAllowance } = useReadContract({ address: ANDE_TOKEN_ADDRESS, abi: ANDE_TOKEN_ABI, functionName: 'allowance', args: [address!, VE_ANDE_ADDRESS], query: { enabled: isConnected } });
    const { data: lockedBalance, isLoading: isLoadingLock, refetch: refetchLock } = useReadContract({ address: VE_ANDE_ADDRESS, abi: VE_ANDE_ABI, functionName: 'lockedBalances', args: [address!], query: { enabled: isConnected } });
    const { data: veAndeBalance, isLoading: isLoadingVeAnde, refetch: refetchVeAnde } = useReadContract({ address: VE_ANDE_ADDRESS, abi: VE_ANDE_ABI, functionName: 'balanceOf', args: [address!], query: { enabled: isConnected } });

    // --- Write Hooks ---
    const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract();
    const { data: lockHash, writeContract: createLock, isPending: isLocking } = useWriteContract();
    const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawing } = useWriteContract();

    const refetchAll = () => { refetchAndeBalance(); refetchAllowance(); refetchLock(); refetchVeAnde(); };
    useWaitForTransactionReceipt({ hash: approveHash, onSuccess: refetchAllowance });
    useWaitForTransactionReceipt({ hash: lockHash, onSuccess: () => { refetchAll(); setLockAmount(''); } });
    useWaitForTransactionReceipt({ hash: withdrawHash, onSuccess: refetchAll });

    const needsApproval = useMemo(() => {
        if (!lockAmount || !allowance) return false;
        return allowance < parseEther(lockAmount);
    }, [lockAmount, allowance]);

    const handleApprove = () => approve({ address: ANDE_TOKEN_ADDRESS, abi: ANDE_TOKEN_ABI, functionName: 'approve', args: [VE_ANDE_ADDRESS, parseEther(lockAmount)] });
    const handleCreateLock = () => {
        const unlockTimestamp = Math.floor(new Date(lockDate).getTime() / 1000);
        createLock({ address: VE_ANDE_ADDRESS, abi: VE_ANDE_ABI, functionName: 'createLock', args: [parseEther(lockAmount), BigInt(unlockTimestamp)] });
    };
    const handleWithdraw = () => withdraw({ address: VE_ANDE_ADDRESS, abi: VE_ANDE_ABI, functionName: 'withdraw' });

    const lockEndDate = lockedBalance && lockedBalance[1] > 0 ? new Date(Number(lockedBalance[1]) * 1000) : null;
    const isLockExpired = lockEndDate && now > (lockEndDate.getTime() / 1000);
    const hasActiveLock = lockedBalance && lockedBalance[0] > 0;
    const isProcessing = isApproving || isLocking || isWithdrawing;

    if (!isConnected) {
        return (
            <Card>
                <CardHeader><CardTitle>🔒 Staking de ANDE</CardTitle></CardHeader>
                <CardContent><Alert><AlertDescription>Conecta tu billetera para gestionar tu staking.</AlertDescription></Alert></CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔒 Staking de ANDE</CardTitle>
                <CardDescription>Bloquea tus ANDE para obtener poder de voto (veANDE) y participar en la gobernanza.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Crear o Extender Bloqueo</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Cantidad de ANDE a bloquear" value={lockAmount} onChange={e => setLockAmount(e.target.value)} />
                            <Input type="date" value={lockDate} onChange={e => setLockDate(e.target.value)} />
                            {needsApproval ? (
                                <Button className="w-full" onClick={handleApprove} disabled={isProcessing || !lockAmount}> {isApproving ? 'Aprobando...' : 'Aprobar ANDE'}</Button>
                            ) : (
                                <Button className="w-full" onClick={handleCreateLock} disabled={isProcessing || !lockAmount || !lockDate}> {isLocking ? 'Bloqueando...' : 'Crear/Añadir a Bloqueo'}</Button>
                            )}
                        </CardContent>
                    </Card>
                    {hasActiveLock && (
                        <Card>
                            <CardHeader><CardTitle>Retirar Bloqueo</CardTitle></CardHeader>
                            <CardContent>
                                <Button className="w-full" onClick={handleWithdraw} disabled={isProcessing || !isLockExpired}>
                                    <Unlock className="mr-2" /> {isWithdrawing ? 'Retirando...' : 'Retirar Fondos'}
                                </Button>
                                {!isLockExpired && <Alert variant="info" className="mt-4"><AlertDescription>Solo puedes retirar cuando tu bloqueo haya finalizado.</AlertDescription></Alert>}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <BalanceDisplay title="Balance de ANDE" value={andeBalance ? formatEther(andeBalance) : '0.0'} symbol="ANDE" isLoading={isLoadingAnde} />
                        <BalanceDisplay title="ANDE Bloqueado" value={lockedBalance ? formatEther(lockedBalance[0]) : '0.0'} symbol="ANDE" isLoading={isLoadingLock} />
                        <BalanceDisplay title="Poder de Voto" value={veAndeBalance ? formatEther(veAndeBalance) : '0.0'} symbol="veANDE" isLoading={isLoadingVeAnde} />
                    </div>
                    {lockEndDate && (
                        <Alert variant="info"><Lock className="h-4 w-4" /><AlertDescription>Tu bloqueo finaliza el: {lockEndDate.toLocaleDateString()} a las {lockEndDate.toLocaleTimeString()}</AlertDescription></Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
