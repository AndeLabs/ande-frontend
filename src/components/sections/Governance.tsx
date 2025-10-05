'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader, PlusCircle } from 'lucide-react';
import { ProposalCard } from '@/components/blockchain/ProposalCard';

// ABI para Gobernanza (conteo y creación)
const MINT_CONTROLLER_ABI = [
  { name: 'proposalCount', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { name: 'createProposal', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'recipient', type: 'address' }, { name: 'description', type: 'string' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
];

const MINT_CONTROLLER_ADDRESS = '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00';

function CreateProposalDialog({ onProposalCreated }) {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const { data: hash, writeContract, isPending, isError } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
        onSuccess: () => {
            onProposalCreated();
            setRecipient('');
            setAmount('');
            setDescription('');
        }
    });

    const handleCreate = () => {
        if (!recipient || !amount || !description) return;
        writeContract({
            address: MINT_CONTROLLER_ADDRESS,
            abi: MINT_CONTROLLER_ABI,
            functionName: 'createProposal',
            args: [parseEther(amount), recipient as `0x${string}`, description]
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" /> Crear Propuesta</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nueva Propuesta de Acuñación</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Dirección del Destinatario (0x...)" value={recipient} onChange={e => setRecipient(e.target.value)} />
                    <Input placeholder="Monto de ANDE a acuñar (ej: 1000)" value={amount} onChange={e => setAmount(e.target.value)} />
                    <Textarea placeholder="Descripción de la propuesta..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleCreate} disabled={isPending || isConfirming}>
                        {(isPending || isConfirming) && <Loader className="mr-2 animate-spin" />} Enviar Propuesta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function Governance() {
  const { isConnected } = useAccount();
  const [proposalIds, setProposalIds] = useState<bigint[]>([]);

  const { data: proposalCount, isLoading: isLoadingProposalCount, refetch } = useReadContract({
    address: MINT_CONTROLLER_ADDRESS,
    abi: MINT_CONTROLLER_ABI,
    functionName: 'proposalCount',
    query: { enabled: isConnected },
  });

  useEffect(() => {
    if (proposalCount) {
      const count = Number(proposalCount);
      const ids = Array.from({ length: count }, (_, i) => BigInt(count - i));
      setProposalIds(ids);
    }
  }, [proposalCount]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏛️ Gobernanza</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>Por favor, conecta tu billetera para ver las propuestas de gobernanza.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>🏛️ Gobernanza del Ecosistema</CardTitle>
            <CardDescription>Participa en las decisiones que moldean el futuro de AndeChain.</CardDescription>
        </div>
        <CreateProposalDialog onProposalCreated={refetch} />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingProposalCount ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="mr-2 animate-spin" />
            <span>Cargando propuestas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {proposalIds.length > 0 ? (
              proposalIds.map(id => <ProposalCard key={id.toString()} proposalId={id} />)
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay propuestas todavía.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
