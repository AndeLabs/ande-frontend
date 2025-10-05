'use client';


import * as React from 'react';
import { readContract } from '@wagmi/core';
import { config } from '@/lib/blockchain/config';
import { useState, useMemo, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Send, ExternalLink } from 'lucide-react';

// ABIs
const ERC20_ABI = [
    { name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'transfer', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
    { name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
];
const ERC4626_ABI = [
    ...ERC20_ABI,
    { name: 'deposit', inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }], outputs: [{ name: 'shares', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
    { name: 'redeem', inputs: [{ name: 'shares', type: 'uint256' }, { name: 'receiver', type: 'address' }, { name: 'owner', type: 'address' }], outputs: [{ name: 'assets', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
];

// Direcciones
const ANDE_ADDRESS = '0x851356ae760d987E095750cCeb3bC6014560891C';
const AUSD_ADDRESS = '0x95401dc811bb5740090279Ba06cfA8fcF6113778';
const aBOB_ADDRESS = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49';
const sABOB_ADDRESS = '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf';

function TokenCard({ tokenName, tokenSymbol, abi, address: contractAddress }) {
    const { address } = useAccount();

    const { data: balance, isLoading: isBalanceLoading } = useReadContract({ address: contractAddress as `0x${string}`, abi, functionName: 'balanceOf', args: [address!], query: { enabled: !!address } });

    return (
        <Card>
            <CardHeader><CardTitle>{tokenName} ({tokenSymbol})</CardTitle><CardDescription>Balance: {isBalanceLoading ? 'Cargando...' : balance ? `${formatEther(balance)} ${tokenSymbol}` : '0.0'}</CardDescription></CardHeader>
        </Card>
    );
}

function SendCard({ tokens }) {
    const [selectedToken, setSelectedToken] = useState(tokens[0]?.address || '');
    const [transferTo, setTransferTo] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const handleTransfer = () => {
        if (!transferTo || !transferAmount || !selectedToken) return;
        writeContract({ address: selectedToken as `0x${string}`, abi: ERC20_ABI, functionName: 'transfer', args: [transferTo as `0x${string}`, parseEther(transferAmount)] });
    };

    return (
        <Card className="col-span-full">
            <CardHeader><CardTitle>Enviar Activos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)} className="w-full p-2 border rounded">
                    {tokens.map(token => (
                        <option key={token.address} value={token.address}>{token.name} ({token.symbol})</option>
                    ))}
                </select>
                <Input placeholder={`Dirección de destino`} value={transferTo} onChange={e => setTransferTo(e.target.value)} />
                <Input placeholder={`Cantidad a transferir`} value={transferAmount} onChange={e => setTransferAmount(e.target.value)} />
                <Button onClick={handleTransfer} disabled={isPending || isConfirming} className="w-full">
                    {(isPending || isConfirming) ? <Loader className="mr-2 animate-spin" /> : <Send className="mr-2" />} Enviar
                </Button>
                {hash && <AlertDescription className="truncate text-xs mt-2">Tx: {hash}</AlertDescription>}
            </CardContent>
        </Card>
    );
}

function StakingCard() {
    const { address } = useAccount();
    const [amount, setAmount] = useState('');

    const { data: abobBalance, refetch: refetchAbob } = useReadContract({ address: aBOB_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!], query: { enabled: !!address } });
    const { data: sabobBalance, refetch: refetchSabob } = useReadContract({ address: SABOB_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!], query: { enabled: !!address } });
    const { data: allowance, refetch: refetchAllowance } = useReadContract({ address: aBOB_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: [address!, SABOB_ADDRESS], query: { enabled: !!address } });

    const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract();
    const { data: depositHash, writeContract: deposit, isPending: isDepositing } = useWriteContract();
    const { data: redeemHash, writeContract: redeem, isPending: isRedeeming } = useWriteContract();

    useWaitForTransactionReceipt({ hash: approveHash, onSuccess: refetchAllowance });
    useWaitForTransactionReceipt({ hash: depositHash, onSuccess: () => { refetchAbob(); refetchSabob(); setAmount(''); } });
    useWaitForTransactionReceipt({ hash: redeemHash, onSuccess: () => { refetchAbob(); refetchSabob(); setAmount(''); } });

    const needsApproval = useMemo(() => {
        if (!amount || !allowance) return false;
        return allowance < parseEther(amount);
    }, [amount, allowance]);

    const handleApprove = () => approve({ address: aBOB_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [SABOB_ADDRESS, parseEther(amount)] });
    const handleDeposit = () => deposit({ address: SABOB_ADDRESS, abi: ERC4626_ABI, functionName: 'deposit', args: [parseEther(amount), address!] });
    const handleRedeem = () => redeem({ address: SABOB_ADDRESS, abi: ERC4626_ABI, functionName: 'redeem', args: [parseEther(amount), address!, address!] });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ahorros en aBOB</CardTitle>
                <CardDescription>Genera rendimientos con tus aBOB. APR estimado: 5%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Tu balance de aBOB:</span>
                    <span>{abobBalance ? formatEther(abobBalance) : '0.0'} aBOB</span>
                </div>
                <div className="flex justify-between">
                    <span>Tu balance de sABOB (staked):</span>
                    <span>{sabobBalance ? formatEther(sabobBalance) : '0.0'} sABOB</span>
                </div>
                <Input placeholder="Cantidad" value={amount} onChange={e => setAmount(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    {needsApproval ? (
                        <Button className="w-full" onClick={handleApprove} disabled={isApproving || !amount}>{isApproving ? 'Aprobando...' : 'Aprobar aBOB'}</Button>
                    ) : (
                        <Button className="w-full" onClick={handleDeposit} disabled={isDepositing || !amount}>{isDepositing ? 'Staking...' : 'Stake'}</Button>
                    )}
                    <Button className="w-full" variant="secondary" onClick={handleRedeem} disabled={isRedeeming || !amount}>{isRedeeming ? 'Unstaking...' : 'Unstake'}</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function SavingsTab() {
    return <StakingCard />;
}

function HistoryTab() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) return;
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:4001/api?module=account&action=txlist&address=${address}`);
                const data = await response.json();
                if (data.status === "1") {
                    setTransactions(data.result);
                }
            } catch (error) {
                console.error("Failed to fetch transaction history:", error);
            }
            setIsLoading(false);
        };
        fetchTransactions();
    }, [address]);

    if (isLoading) {
        return <div className="flex justify-center py-8"><Loader className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No se encontraron transacciones.</p>
            ) : (
                transactions.map((tx) => (
                    <Card key={tx.hash}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-mono text-xs">De: {tx.from}</p>
                                <p className="font-mono text-xs">A: {tx.to}</p>
                                <p className="text-xs text-muted-foreground">{new Date(tx.timeStamp * 1000).toLocaleString()}</p>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <a href={`http://localhost:4000/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">Ver <ExternalLink className="ml-2 h-4 w-4" /></a>
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

function AndeBalanceCard() {
    const { address } = useAccount();
    const { data: balance, isLoading } = useBalance({ address });

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Saldo Principal (ANDE)</CardTitle>
                <CardDescription>Este es tu balance de ANDE, el token nativo de la red.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                    {isLoading ? 'Cargando...' : balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ANDE` : '0.0 ANDE'}
                </p>
            </CardContent>
        </Card>
    );
}

export function BilleteraBimonetaria() {
    const { address, isConnected } = useAccount();
    const [detectedTokens, setDetectedTokens] = useState([]);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!address) return;

        const detectTokens = async () => {
            try {
                const response = await fetch(`http://localhost:4001/api?module=account&action=txlist&address=${address}`);
                const data = await response.json();
                if (data.status === "1") {
                    const tokenAddresses = new Set<string>();
                    data.result.forEach((tx: any) => {
                        if (tx.to) tokenAddresses.add(tx.to);
                    });

                    const tokenData = await Promise.all(
                        Array.from(tokenAddresses).map(async (tokenAddress) => {
                            try {
                                const name = await readContract(config, {
                                    address: tokenAddress as `0x${string}`,
                                    abi: ERC20_ABI,
                                    functionName: 'name',
                                });
                                const symbol = await readContract(config, {
                                    address: tokenAddress as `0x${string}`,
                                    abi: ERC20_ABI,
                                    functionName: 'symbol',
                                });
                                return { address: tokenAddress, name, symbol };
                            } catch (error) {
                                return null;
                            }
                        })
                    );

                    setDetectedTokens(tokenData.filter(t => t !== null));
                }
            } catch (error) {
                console.error("Failed to detect tokens:", error);
            }
        };

        detectTokens();
    }, [address]);


    if (!isClient) {
        return null;
    }

    if (!isConnected) {
        return (
            <Card>
                <CardHeader><CardTitle>💸 Mi Billetera</CardTitle></CardHeader>
                <CardContent><Alert><AlertDescription>Por favor, conecta tu billetera para continuar.</AlertDescription></Alert></CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>💸 Mi Billetera</CardTitle>
                <CardDescription>Gestiona tus activos, consulta tu historial y ahorra.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="assets">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="assets">Activos</TabsTrigger>
                        <TabsTrigger value="history">Historial</TabsTrigger>
                        <TabsTrigger value="savings">Ahorros</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assets" className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <AndeBalanceCard />
                            <TokenCard tokenName="Ande USD" tokenSymbol="aUSD" abi={ERC20_ABI} address={AUSD_ADDRESS} />
                            <TokenCard tokenName="Andean Boliviano" tokenSymbol="aBOB" abi={ERC20_ABI} address={aBOB_ADDRESS} />
                            {detectedTokens.map(token => (
                                <TokenCard key={token.address} tokenName={token.name} tokenSymbol={token.symbol} abi={ERC20_ABI} address={token.address} />
                            ))}
                        </div>
                        <div className="mt-6">
                            <SendCard tokens={[
                                { address: ANDE_ADDRESS, name: 'ANDE Token', symbol: 'ANDE' },
                                { address: AUSD_ADDRESS, name: 'Ande USD', symbol: 'aUSD' },
                                { address: aBOB_ADDRESS, name: 'Andean Boliviano', symbol: 'aBOB' },
                                ...detectedTokens
                            ]} />
                        </div>
                    </TabsContent>
                    <TabsContent value="history" className="pt-6">
                        <HistoryTab />
                    </TabsContent>
                    <TabsContent value="savings" className="pt-6">
                        <SavingsTab />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
