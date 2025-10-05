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
  Shield
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

// ABI del contrato MintController (simplificado)
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

// Direcciones de contratos
const MINT_CONTROLLER_ADDRESS = '0x...' as `0x${string}`;
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

export function GovernanceDAO() {
  const { address, isConnected } = useAccount();
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
                <Vote className="h-6 w-6" />
                Gobernanza DAO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, conecta tu billetera para participar en la gobernanza.
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
            y ayuda a dar forma al futuro de la blockchain.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tu Poder de Voto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {userVotingPower ? formatEther(userVotingPower) : '0.0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">veANDE</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Propuestas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Activas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Aprobadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rechazadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Filtrado */}
        <Card>
          <CardHeader>
            <CardTitle>Propuestas</CardTitle>
            <CardDescription>
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

        {/* Crear Propuesta (Placeholder) */}
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center space-y-4">
            <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">¿Tienes una idea?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                La funcionalidad de crear propuestas estará disponible próximamente
              </p>
            </div>
            <Button disabled variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Propuesta
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
