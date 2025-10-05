'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getTransactionStatus,
  getTransactionUrl,
  truncateHash,
  type NetworkName,
} from '@/lib/blockchain/blockscout';

interface TransactionStatusProps {
  /**
   * Hash de la transacción
   */
  txHash: string;

  /**
   * Red de blockchain (default: 'local')
   */
  network?: NetworkName;

  /**
   * Auto-refresh cada X ms (default: 3000, 0 = deshabilitado)
   */
  refreshInterval?: number;

  /**
   * Mostrar enlace a Blockscout (default: true)
   */
  showLink?: boolean;

  /**
   * Variante de visualización
   */
  variant?: 'default' | 'compact' | 'detailed';

  /**
   * Callback cuando cambia el estado
   */
  onStatusChange?: (status: 'success' | 'failed' | 'pending' | 'unknown') => void;

  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente para mostrar el estado de una transacción
 * Incluye auto-refresh y enlace a Blockscout
 *
 * @example
 * ```tsx
 * <TransactionStatus
 *   txHash="0x1234..."
 *   onStatusChange={(status) => console.log(status)}
 * />
 * ```
 */
export function TransactionStatus({
  txHash,
  network = 'local',
  refreshInterval = 3000,
  showLink = true,
  variant = 'default',
  onStatusChange,
  className,
}: TransactionStatusProps) {
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | 'unknown'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchStatus = async () => {
      try {
        const newStatus = await getTransactionStatus(txHash, network);
        setStatus(newStatus);
        setLoading(false);

        if (onStatusChange) {
          onStatusChange(newStatus);
        }

        // Detener refresh si la transacción ya fue minada
        if (newStatus === 'success' || newStatus === 'failed') {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Error fetching transaction status:', error);
        setStatus('unknown');
        setLoading(false);
      }
    };

    // Fetch inicial
    fetchStatus();

    // Setup auto-refresh
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchStatus, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [txHash, network, refreshInterval, onStatusChange]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle2,
          label: 'Confirmada',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Fallida',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
        };
      case 'pending':
        return {
          icon: loading ? Loader2 : Clock,
          label: 'Pendiente',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
        };
      default:
        return {
          icon: Clock,
          label: 'Desconocido',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const blockscoutUrl = getTransactionUrl(txHash, network);

  // Variante compacta
  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <Icon
          className={cn('h-4 w-4', config.color, status === 'pending' && loading && 'animate-spin')}
        />
        <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
        {showLink && (
          <a
            href={blockscoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  }

  // Variante detallada
  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'rounded-lg border p-4',
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon
              className={cn(
                'h-5 w-5 mt-0.5',
                config.color,
                status === 'pending' && loading && 'animate-spin'
              )}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn('font-semibold', config.color)}>{config.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-muted-foreground font-mono">
                  {truncateHash(txHash)}
                </code>
                {showLink && (
                  <a
                    href={blockscoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs"
                  >
                    <span>Ver en explorador</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variante default
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-md border px-3 py-2',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon
        className={cn('h-5 w-5', config.color, status === 'pending' && loading && 'animate-spin')}
      />
      <div className="flex items-center gap-2">
        <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
        <code className="text-xs text-muted-foreground font-mono">{truncateHash(txHash)}</code>
      </div>
      {showLink && (
        <a
          href={blockscoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
