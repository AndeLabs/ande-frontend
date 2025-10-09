'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Vote,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  Loader,
  ThumbsUp,
  ThumbsDown,
  Shield,
  BarChart3,
  Info,
  Zap
} from 'lucide-react';
import { TransactionLink } from '@/components/blockchain';
import { cn } from '@/lib/utils';

// Tipos para propuestas
interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: number;
  endTime: number;
  quorum: bigint;
  type: 'mint' | 'parameter' | 'upgrade' | 'treasury';
}

// ABI del contrato MintController (combinado de ambos)
const MINT_CONTROLLER_ABI = [
  {
    name: 'proposeMint',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'description', type: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'voteOnProposal',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'bool' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'executeProposal',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'proposalCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

const VEANDE_ABI = [
  {
    name: 'getVotes',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Direcciones de contratos (usar las reales cuando estén disponibles)
const MINT_CONTROLLER_ADDRESS = '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00' as `0x${string}`;
const VEANDE_ADDRESS = '0x...' as `0x${string}`;

// Mock data para demostración
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: 'Acuñar 100,000 ANDE para Desarrollo del Ecosistema',
    description: 'Propuesta para acuñar 100,000 tokens ANDE destinados al desarrollo del ecosistema AndeChain durante Q1 2025. Los fondos se utilizarán para: grants a desarrolladores (40%), marketing (30%), auditorías de seguridad (20%), y reserva de liquidez (10%).',
    proposer: '0x1234...5678',
    status: 'active',
    votesFor: parseEther('250000'),
    votesAgainst: parseEther('50000'),
    startTime: Date.now() / 1000 - 86400 * 2,
    endTime: Date.now() / 1000 + 86400 * 5,
    quorum: parseEther('100000'),
    type: 'mint'
  },
  {
    id: 2,
    title: 'Reducir Ratio de Colateralización de aUSD a 110%',
    description: 'Propuesta para ajustar el ratio de sobre-colateralización del stablecoin aUSD de 120% a 110%, permitiendo mayor eficiencia de capital mientras se mantiene la seguridad del sistema.',
    proposer: '0xabcd...efgh',
    status: 'active',
    votesFor: parseEther('180000'),
    votesAgainst: parseEther('120000'),
    startTime: Date.now() / 1000 - 86400,
    endTime: Date.now() / 1000 + 86400 * 6,
    quorum: parseEther('100000'),
    type: 'parameter'
  },
  {
    id: 3,
    title: 'Implementar Nuevo Oracle Descentralizado',
    description: 'Propuesta para implementar un sistema de oracle descentralizado basado en Chainlink para mejorar la confiabilidad y descentralización de los precios en el ecosistema.',
    proposer: '0x9876...4321',
    status: 'passed',
    votesFor: parseEther('450000'),
    votesAgainst: parseEther('20000'),
    startTime: Date.now() / 1000 - 86400 * 10,
    endTime: Date.now() / 1000 - 86400 * 3,
    quorum: parseEther('100000'),
    type: 'upgrade'
  }
];

// Mock stats
const mockGovernanceStats = {
  totalProposals: 24,
  activeProposals: 3,
  passedProposals: 18,
  rejectedProposals: 3,
  totalVoters: 1250,
  participationRate: 15.3,
  totalSupply: '10000000',
  veAndeSupply: '3500000',
  quorum: '100000'
};

function CreateProposalDialog({ onProposalCreated }: { onProposalCreated: () => void }) {
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
      functionName: 'proposeMint',
      args: [recipient as `0x${string}`, parseEther(amount), description]
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Crear Propuesta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Propuesta de Acuñación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Dirección del Destinatario (0x...)"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          <Input
            placeholder="Monto de ANDE a acuñar (ej: 1000)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <Textarea
            placeholder="Descripción detallada de la propuesta..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleCreate}
            disabled={isPending || isConfirming}
          >
            {(isPending || isConfirming) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Propuesta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProposalCard({ proposal, userVotingPower }: { proposal: Proposal; userVotingPower: bigint }) {
  const [selectedVote, setSelectedVote] = useState<boolean | null>(null);

  const { data: voteHash, writeContract: vote, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: voteHash });

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const votesForPercent = totalVotes > 0n ? Number((proposal.votesFor * 100n) / totalVotes) : 0;
  const votesAgainstPercent = totalVotes > 0n ? Number((proposal.votesAgainst * 100n) / totalVotes) : 0;
  const quorumPercent = proposal.quorum > 0n ? Number((totalVotes * 100n) / proposal.quorum) : 0;

  const timeRemaining = proposal.endTime - Date.now() / 1000;
  const isActive = proposal.status === 'active' && timeRemaining > 0;
  const daysRemaining = Math.ceil(timeRemaining / 86400);

  const handleVote = (support: boolean) => {
    setSelectedVote(support);
    vote({
      address: MINT_CONTROLLER_ADDRESS,
      abi: MINT_CONTROLLER_ABI,
      functionName: 'voteOnProposal',
      args: [BigInt(proposal.id), support]
    });
  };

  const getStatusBadge = () => {
    switch (proposal.status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-500">Activa</Badge>;
      case 'passed':
        return <Badge variant="default" className="bg-green-500">Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'executed':
        return <Badge variant="secondary">Ejecutada</Badge>;
    }
  };

  const getTypeBadge = () => {
    const types = {
      mint: { label: 'Acuñación', icon: Plus },
      parameter: { label: 'Parámetro', icon: TrendingUp },
      upgrade: { label: 'Actualización', icon: Shield },
      treasury: { label: 'Tesorería', icon: Users }
    };
    const type = types[proposal.type];
    const Icon = type.icon;
    return (
      <Badge variant="outline" className="gap-1">
        <Icon className="h-3 w-3" />
        {type.label}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {getTypeBadge()}
              {getStatusBadge()}
              {isActive && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restantes
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
            <CardDescription className="text-sm">
              Propuesta #{proposal.id} • Por {proposal.proposer}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Descripción */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Descripción
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {proposal.description}
          </p>
        </div>

        <Separator />

        {/* Resultados de Votación */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Resultados de Votación
          </h4>

          {/* A Favor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <ThumbsUp className="h-4 w-4" />
                A Favor
              </span>
              <span className="font-bold">{votesForPercent.toFixed(1)}%</span>
            </div>
            <Progress value={votesForPercent} className="h-2 bg-muted [&>div]:bg-green-500" />
            <p className="text-xs text-muted-foreground">
              {formatEther(proposal.votesFor)} votos
            </p>
          </div>

          {/* En Contra */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                <ThumbsDown className="h-4 w-4" />
                En Contra
              </span>
              <span className="font-bold">{votesAgainstPercent.toFixed(1)}%</span>
            </div>
            <Progress value={votesAgainstPercent} className="h-2 bg-muted [&>div]:bg-red-500" />
            <p className="text-xs text-muted-foreground">
              {formatEther(proposal.votesAgainst)} votos
            </p>
          </div>

          {/* Quorum */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Users className="h-4 w-4" />
                Quorum
              </span>
              <span className={cn(
                "font-bold",
                quorumPercent >= 100 ? "text-green-500" : "text-yellow-500"
              )}>
                {quorumPercent.toFixed(1)}%
              </span>
            </div>
            <Progress value={Math.min(quorumPercent, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {formatEther(totalVotes)} / {formatEther(proposal.quorum)} votos requeridos
            </p>
          </div>
        </div>

        {/* Botones de Votación */}
        {isActive && userVotingPower > 0n && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Tu poder de voto: {formatEther(userVotingPower)} veANDE
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleVote(true)}
                  disabled={isPending}
                  variant={selectedVote === true ? "default" : "outline"}
                  className={cn(
                    "gap-2",
                    selectedVote === true && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isPending && selectedVote === true ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}
                  A Favor
                </Button>
                <Button
                  onClick={() => handleVote(false)}
                  disabled={isPending}
                  variant={selectedVote === false ? "destructive" : "outline"}
                  className="gap-2"
                >
                  {isPending && selectedVote === false ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                  En Contra
                </Button>
              </div>

              {voteHash && (
                <Alert className={cn(
                  "border-2",
                  isSuccess ? "border-green-500/50 bg-green-500/10" : "border-yellow-500/50 bg-yellow-500/10"
                )}>
                  <div className="flex items-start gap-3">
                    {isSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Loader className="h-5 w-5 text-yellow-500 animate-spin mt-0.5" />
                    )}
                    <div className="flex-1 space-y-2">
                      <AlertDescription className="font-medium">
                        {isSuccess ? '✅ Voto registrado exitosamente' : '⏳ Procesando voto...'}
                      </AlertDescription>
                      <TransactionLink
                        txHash={voteHash}
                        label="Ver en Blockscout"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          </>
        )}

        {isActive && userVotingPower === 0n && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Necesitas veANDE (poder de voto) para participar. Ve a la sección de Staking para bloquear tus tokens ANDE.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default function GovernanceSection() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('active');

  // Leer poder de voto del usuario
  const { data: userVotingPower } = useReadContract({
    address: VEANDE_ADDRESS,
    abi: VEANDE_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const filteredProposals = MOCK_PROPOSALS.filter(p => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const stats = {
    total: MOCK_PROPOSALS.length,
    active: MOCK_PROPOSALS.filter(p => p.status === 'active').length,
    passed: MOCK_PROPOSALS.filter(p => p.status === 'passed').length,
    rejected: MOCK_PROPOSALS.filter(p => p.status === 'rejected').length
  };

  if (!isConnected) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-6 w-6 text-purple-500" />
                Gobernanza - AndeChain
              </CardTitle>
              <CardDescription>Conecta tu billetera para participar en la gobernanza</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, conecta tu billetera para ver las propuestas de gobernanza.
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
            Gobernanza Descentralizada
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Participa en la toma de decisiones del ecosistema AndeChain. Vota propuestas, crea nuevas iniciativas
            y ayuda a dar forma al futuro de la blockchain soberana de Latinoamérica.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-800">
              veANDE Voting
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-800">
              On-Chain Governance
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-800">
              Supermajority Required
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-800">
              Mint Control
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
            <TabsTrigger value="proposals" className="gap-2">
              <Vote className="w-4 h-4" />
              Propuestas
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Plus className="w-4 h-4" />
              Crear
            </TabsTrigger>
          </TabsList>

          {/* Vista General */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats principales */}
            <div className="grid md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
                <CardHeader className="pb-3">
                  <CardDescription className="text-purple-400">Tu Poder de Voto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {userVotingPower ? formatEther(userVotingPower) : '0.0'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">veANDE</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30">
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-400">Total Propuestas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{mockGovernanceStats.totalProposals}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-400">Activas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{mockGovernanceStats.activeProposals}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-400">Aprobadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{mockGovernanceStats.passedProposals}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-800/30">
                <CardHeader className="pb-3">
                  <CardDescription className="text-red-400">Rechazadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{mockGovernanceStats.rejectedProposals}</div>
                </CardContent>
              </Card>
            </div>

            {/* Información del sistema */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Info className="w-5 h-5 mr-2" />
                    Información del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Supply Total ANDE:</span>
                      <span className="text-white font-bold">{parseInt(mockGovernanceStats.totalSupply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Supply veANDE:</span>
                      <span className="text-purple-400 font-bold">{parseInt(mockGovernanceStats.veAndeSupply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Cuórum requerido:</span>
                      <span className="text-orange-400 font-bold">{parseInt(mockGovernanceStats.quorum).toLocaleString()} ANDE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Período de votación:</span>
                      <span className="text-white">7 días</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Requerimiento de aprobación:</span>
                      <span className="text-green-400 font-bold">Supermayoría (66%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <Zap className="w-5 h-5 mr-2" />
                    Estadísticas de Participación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-black/20 rounded-lg">
                    <p className="text-3xl font-bold text-blue-400">{mockGovernanceStats.totalVoters}</p>
                    <p className="text-sm text-gray-400">Votantes activos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tasa de participación actual:</span>
                      <span className="text-blue-400">{mockGovernanceStats.participationRate}%</span>
                    </div>
                    <Progress value={mockGovernanceStats.participationRate} className="h-2 bg-black/30" />
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('proposals')}
                  >
                    <Vote className="w-4 h-4 mr-2" />
                    Ver Propuestas Activas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Propuestas */}
          <TabsContent value="proposals" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Vote className="w-5 h-5 mr-2" />
                  Propuestas de Gobernanza
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Explora y vota las propuestas activas de la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="active">
                      Activas ({stats.active})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                      Todas ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="passed">
                      Aprobadas ({stats.passed})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rechazadas ({stats.rejected})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Lista de Propuestas */}
            <div className="space-y-6">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    userVotingPower={userVotingPower || 0n}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No hay propuestas en esta categoría</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Prueba con otro filtro o crea una nueva propuesta
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Crear Propuesta */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Nueva Propuesta
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Propón emisiones de ANDE para proyectos estratégicos del ecosistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Alert className="border-green-800 bg-green-950/20">
                      <Info className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300 text-sm">
                        Las propuestas requieren <strong>veANDE</strong> para votar y necesitan una supermayoría (66%) para ser aprobadas.
                        El cuórum mínimo es de {parseInt(mockGovernanceStats.quorum).toLocaleString()} ANDE.
                      </AlertDescription>
                    </Alert>
                    <CreateProposalDialog onProposalCreated={() => {}} />
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader><CardTitle>Requisitos de Propuesta</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Power de voto mínimo:</span>
                          <span className="text-white">1,000 veANDE</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Duración de votación:</span>
                          <span className="text-white">7 días</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Aprobación requerida:</span>
                          <span className="text-green-400">66% (Supermayoría)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Cuórum mínimo:</span>
                          <span className="text-orange-400">10% del supply</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}