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

// NOTA: El staking ha sido movido a la página especializada /dashboard/staking
// La billetera ahora solo maneja balances, transferencias y historial

function HistoryTab() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // No mostrar loading al inicio
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!address) return;

        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Verificar si Blockscout está disponible primero
                try {
                    const response = await fetch(`http://localhost:4000/api/v2/addresses/${address}/transactions`, {
                        signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data && data.items) {
                        setTransactions(data.items.slice(0, 10)); // Limitar a 10 transacciones recientes
                    } else {
                        setTransactions([]);
                    }
                } catch (fetchError) {
                    // Si Blockscout no está disponible, mostrar mensaje informativo
                    console.log("Blockscout no disponible, mostrando estado vacío");
                    setTransactions([]);
                    setError(null); // No mostrar error, solo estado vacío
                }
            } catch (error) {
                console.error("Error general en HistoryTab:", error);
                setTransactions([]);
                setError(null);
            }
            setIsLoading(false);
        };

        // Solo hacer fetch si el usuario tiene la wallet conectada
        fetchTransactions();
    }, [address]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader className="animate-spin w-8 h-8" />
                <p className="text-sm text-gray-400">Cargando historial de transacciones...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <Alert>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {transactions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">No se encontraron transacciones.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Las transacciones aparecerán aquí una vez que realices operaciones en la red.
                        {error && " El explorador de bloques puede no estar disponible actualmente."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx, index) => (
                        <Card key={`${tx.hash}-${index}`}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-green-400 font-medium">Exitosa</span>
                                        </div>
                                        <p className="font-mono text-xs text-gray-300 truncate">
                                            {tx.hash}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-xs text-gray-400">
                                                De: <span className="font-mono text-gray-300">{tx.from?.slice(0, 8)}...{tx.from?.slice(-6)}</span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                A: <span className="font-mono text-gray-300">{tx.to?.slice(0, 8)}...{tx.to?.slice(-6)}</span>
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Fecha desconocida'}
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <a
                                            href={`http://localhost:4000/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            Ver <ExternalLink className="ml-2 h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
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
                // Intentar obtener transacciones desde el explorador Blockscout (puerto 4000)
                // pero con timeout para no causar errores largos
                try {
                    const response = await fetch(`http://localhost:4000/api/v2/addresses/${address}/transactions`, {
                        signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data && data.items) {
                        const tokenAddresses = new Set<string>();
                        data.items.forEach((tx: any) => {
                            if (tx.to && tx.to !== address && tx.to.length === 42) {
                                tokenAddresses.add(tx.to);
                            }
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

                        const validTokens = tokenData.filter(t => t !== null);
                        if (validTokens.length > 0) {
                            setDetectedTokens(validTokens);
                            return;
                        }
                    }
                } catch (fetchError) {
                    console.log("Blockscout no disponible para detección de tokens");
                }

                // Si Blockscout no está disponible o no se encontraron tokens,
                // usar tokens conocidos predefinidos
                setDetectedTokens([
                    { address: '0x95401dc811bb5740090279Ba06cfA8fcF6113778', name: 'Ande USD', symbol: 'aUSD' },
                    { address: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49', name: 'Andean Boliviano', symbol: 'aBOB' },
                    { address: '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf', name: 'Staked Andean Boliviano', symbol: 'sABOB' }
                ]);

            } catch (error) {
                console.error("Error general en detectTokens:", error);
                // Siempre usar tokens predefinidos como fallback
                setDetectedTokens([
                    { address: '0x95401dc811bb5740090279Ba06cfA8fcF6113778', name: 'Ande USD', symbol: 'aUSD' },
                    { address: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49', name: 'Andean Boliviano', symbol: 'aBOB' },
                    { address: '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf', name: 'Staked Andean Boliviano', symbol: 'sABOB' }
                ]);
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
                <CardDescription>Gestiona tus activos, realiza transferencias y consulta tu historial.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <AndeBalanceCard />
                        <TokenCard tokenName="Ande USD" tokenSymbol="aUSD" abi={ERC20_ABI} address={AUSD_ADDRESS} />
                        <TokenCard tokenName="Andean Boliviano" tokenSymbol="aBOB" abi={ERC20_ABI} address={aBOB_ADDRESS} />
                        {detectedTokens.map(token => (
                            <TokenCard key={token.address} tokenName={token.name} tokenSymbol={token.symbol} abi={ERC20_ABI} address={token.address} />
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <SendCard tokens={[
                            { address: ANDE_ADDRESS, name: 'ANDE Token', symbol: 'ANDE' },
                            { address: AUSD_ADDRESS, name: 'Ande USD', symbol: 'aUSD' },
                            { address: aBOB_ADDRESS, name: 'Andean Boliviano', symbol: 'aBOB' },
                            ...detectedTokens
                        ]} />
                        <HistoryTab />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
