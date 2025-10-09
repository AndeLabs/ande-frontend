'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Vote,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  BarChart3
} from 'lucide-react';

interface GovernanceWidgetProps {
  expanded?: boolean;
}

const MINT_CONTROLLER_ADDRESS = '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00';
const MINT_CONTROLLER_ABI = [
  { name: 'proposalCount', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }
];

// Mock data para propuestas
const mockProposals = [
  {
    id: 1,
    title: "Expansion del ecosistema a Perú",
    description: "Proponer emisión de 50,000 ANDE para expansion a mercados peruanos",
    votesFor: 15000,
    votesAgainst: 2000,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active"
  },
  {
    id: 2,
    title: "Mejora de infraestructura de bridge",
    description: "Asignar 25,000 ANDE para mejorar el puente con Celestia",
    votesFor: 8500,
    votesAgainst: 1500,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "active"
  }
];

export function GovernanceWidget({ expanded = false }: GovernanceWidgetProps) {
  const { isConnected } = useAccount();
  const [proposalCount, setProposalCount] = useState(2);
  const [activeProposals, setActiveProposals] = useState(mockProposals);

  const { data: onChainProposalCount } = useReadContract({
    address: MINT_CONTROLLER_ADDRESS as `0x${string}`,
    abi: MINT_CONTROLLER_ABI,
    functionName: 'proposalCount',
    query: { enabled: isConnected },
  });

  useEffect(() => {
    if (onChainProposalCount) {
      setProposalCount(Number(onChainProposalCount));
    }
  }, [onChainProposalCount]);

  const calculateVoteProgress = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? (votesFor / total) * 100 : 0;
  };

  const formatTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-800">Activa</Badge>;
      case 'passed':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-800">Aprobada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-800">Rechazada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30 ${expanded ? 'col-span-1' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-400">
          <Vote className="w-5 h-5 mr-2" />
          Gobernanza
        </CardTitle>
        <CardDescription className="text-gray-400">
          Sistema de votación de ANDE
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-black/20 rounded-lg">
            <BarChart3 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{proposalCount}</p>
            <p className="text-xs text-gray-400">Propuestas</p>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">75%</p>
            <p className="text-xs text-gray-400">Aprobadas</p>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-lg">
            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">324</p>
            <p className="text-xs text-gray-400">Votantes</p>
          </div>
        </div>

        {/* Propuestas Activas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Propuestas Activas</span>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              {activeProposals.length}
            </Badge>
          </div>

          {activeProposals.slice(0, expanded ? undefined : 2).map((proposal) => (
            <div key={proposal.id} className="p-3 bg-black/20 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white truncate flex-1">
                  {proposal.title}
                </span>
                {getStatusBadge(proposal.status)}
              </div>

              <p className="text-xs text-gray-400 line-clamp-2">
                {proposal.description}
              </p>

              {/* Progreso de Votación */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>A favor: {proposal.votesFor.toLocaleString()}</span>
                  <span>En contra: {proposal.votesAgainst.toLocaleString()}</span>
                </div>
                <Progress
                  value={calculateVoteProgress(proposal.votesFor, proposal.votesAgainst)}
                  className="h-2 bg-black/30"
                />
              </div>

              {/* Tiempo Restante */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeRemaining(proposal.deadline)}
                </div>
                <span className="text-purple-400">
                  {calculateVoteProgress(proposal.votesFor, proposal.votesAgainst).toFixed(1)}% a favor
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de Acción */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear Propuesta
          </Button>

          {!expanded && (
            <Button variant="outline" className="w-full border-purple-800 text-purple-400">
              Ver Todas las Propuestas
            </Button>
          )}
        </div>

        {/* Información Adicional (solo versión expandida) */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Cuórum requerido:</span>
              <span className="text-white">10,000 ANDE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Participación actual:</span>
              <span className="text-green-400">15.3%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Período de votación:</span>
              <span className="text-white">7 días</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}