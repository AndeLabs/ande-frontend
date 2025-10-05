import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, ThumbsUp, ThumbsDown, Hourglass, Play, Clock, AlertCircle } from 'lucide-react';

// ABI completo para el ciclo de vida de la propuesta
const MINT_CONTROLLER_ABI = [
    { name: 'getProposalCore', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [{ name: 'amount', type: 'uint256' }, { name: 'recipient', type: 'address' }, { name: 'description', type: 'string' }], stateMutability: 'view', type: 'function' },
    { name: 'getProposalVotes', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [{ name: 'votesFor', type: 'uint256' }, { name: 'votesAgainst', type: 'uint256' }, { name: 'totalVotingPower', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'getProposalState', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
    { name: 'getProposalTimestamps', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [{ name: 'snapshotBlock', type: 'uint256' }, { name: 'creationTime', type: 'uint256' }, { name: 'votingDeadline', type: 'uint256' }, { name: 'executionETA', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { name: 'castVote', inputs: [{ name: 'proposalId', type: 'uint256' }, { name: 'support', type: 'bool' }], outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { name: 'queueProposal', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { name: 'executeProposal', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

const MINT_CONTROLLER_ADDRESS = '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00';

enum ProposalState {
    Pending,
    Active,
    Defeated,
    Succeeded,
    Queued,
    Executed,
    Cancelled,
    Expired
}

// Helper para extraer el mensaje de error del contrato
function getRevertReason(error: any): string | null {
    if (!error) return null;
    const errorString = error.toString();
    const match = errorString.match(/revertReason: \"(.*?)\"/);
    if (match && match[1]) {
        return match[1];
    }
    // Fallback para otros formatos de error
    if (error.shortMessage) return error.shortMessage;
    return "Error desconocido";
}

export function ProposalCard({ proposalId }) {
    const [now, setNow] = useState(Date.now() / 1000);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
        return () => clearInterval(interval);
    }, []);

    const { data: core, refetch: refetchCore } = useReadContract({ address: MINT_CONTROLLER_ADDRESS, abi: MINT_CONTROLLER_ABI, functionName: 'getProposalCore', args: [proposalId] });
    const { data: votes, refetch: refetchVotes } = useReadContract({ address: MINT_CONTROLLER_ADDRESS, abi: MINT_CONTROLLER_ABI, functionName: 'getProposalVotes', args: [proposalId] });
    const { data: state, refetch: refetchState } = useReadContract({ address: MINT_CONTROLLER_ADDRESS, abi: MINT_CONTROLLER_ABI, functionName: 'getProposalState', args: [proposalId] });
    const { data: timestamps, refetch: refetchTimestamps } = useReadContract({ address: MINT_CONTROLLER_ADDRESS, abi: MINT_CONTROLLER_ABI, functionName: 'getProposalTimestamps', args: [proposalId] });

    const commonWriteProps = { address: MINT_CONTROLLER_ADDRESS, abi: MINT_CONTROLLER_ABI };

    const { data: voteHash, writeContract: castVote, isPending: isVoting, error: voteError } = useWriteContract();
    const { data: queueHash, writeContract: queueProposal, isPending: isQueuing, error: queueError } = useWriteContract();
    const { data: executeHash, writeContract: executeProposal, isPending: isExecuting, error: executeError } = useWriteContract();

    useWaitForTransactionReceipt({
        hash: voteHash || queueHash || executeHash,
        onSuccess: () => {
            refetchCore(); refetchVotes(); refetchState(); refetchTimestamps();
        }
    });

    useEffect(() => {
        const error = voteError || queueError || executeError;
        setErrorMessage(getRevertReason(error));
    }, [voteError, queueError, executeError]);

    const handleVote = (support: boolean) => castVote({ ...commonWriteProps, functionName: 'castVote', args: [proposalId, support] });
    const handleQueue = () => queueProposal({ ...commonWriteProps, functionName: 'queueProposal', args: [proposalId] });
    const handleExecute = () => executeProposal({ ...commonWriteProps, functionName: 'executeProposal', args: [proposalId] });

    const getStatusBadge = (status) => {
        const stateName = ProposalState[status] ?? 'Desconocido';
        const variants = { Active: 'default', Succeeded: 'success', Executed: 'success', Defeated: 'destructive', Expired: 'secondary', Cancelled: 'secondary', Queued: 'outline' };
        return <Badge variant={variants[stateName] ?? 'default'}>{stateName}</Badge>;
    };

    const totalVotes = votes ? votes[0] + votes[1] : 0n;
    const forPercentage = totalVotes > 0 ? Number((votes[0] * 10000n) / totalVotes) / 100 : 0;
    const isProcessing = isVoting || isQueuing || isExecuting;
    const executionETA = timestamps ? Number(timestamps[3]) : 0;
    const canExecute = now > executionETA;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>Propuesta #{proposalId.toString()}</CardTitle>
                    {getStatusBadge(state)}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{core?.description ?? 'Cargando...'}</p>
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-500">A Favor: {votes ? formatEther(votes[0]) : '0'}</span>
                        <span className="text-sm font-medium text-red-500">En Contra: {votes ? formatEther(votes[1]) : '0'}</span>
                    </div>
                    <Progress value={forPercentage} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {state === ProposalState.Active && (
                    <div className="w-full grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => handleVote(true)} disabled={isProcessing}><ThumbsUp className="mr-2 h-4 w-4" /> Votar a Favor</Button>
                        <Button variant="outline" onClick={() => handleVote(false)} disabled={isProcessing}><ThumbsDown className="mr-2 h-4 w-4" /> Votar en Contra</Button>
                    </div>
                )}
                {state === ProposalState.Succeeded && (
                    <Button className="w-full" onClick={handleQueue} disabled={isProcessing}><Hourglass className="mr-2 h-4 w-4" /> Poner en Cola</Button>
                )}
                {state === ProposalState.Queued && (
                    <div className="w-full space-y-2">
                        <Button className="w-full" onClick={handleExecute} disabled={isProcessing || !canExecute}>
                            <Play className="mr-2 h-4 w-4" /> {canExecute ? 'Ejecutar' : 'Esperando Timelock'}
                        </Button>
                        {executionETA > 0 && (
                            <Alert variant="info" className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <AlertDescription>
                                    Ejecutable en: {new Date(executionETA * 1000).toLocaleString()}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
                {isProcessing && <Alert><AlertDescription>Procesando transacción...</AlertDescription></Alert>}
                {errorMessage && !isProcessing && (
                    <Alert variant="destructive" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}
