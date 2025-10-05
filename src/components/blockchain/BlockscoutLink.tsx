'use client';

import { ExternalLink } from 'lucide-react';
import {
  getTransactionUrl,
  getAddressUrl,
  getBlockUrl,
  getTokenUrl,
  truncateHash,
  type NetworkName,
} from '@/lib/blockchain/blockscout';
import { cn } from '@/lib/utils';

interface BlockscoutLinkProps {
  /**
   * Tipo de enlace
   */
  type: 'transaction' | 'address' | 'block' | 'token';

  /**
   * Hash, dirección o número de bloque
   */
  value: string;

  /**
   * Red de blockchain (default: 'local')
   */
  network?: NetworkName;

  /**
   * Mostrar el valor truncado (default: true)
   */
  truncate?: boolean;

  /**
   * Texto personalizado a mostrar (sobrescribe truncate)
   */
  label?: string;

  /**
   * Mostrar icono de enlace externo (default: true)
   */
  showIcon?: boolean;

  /**
   * Clases CSS adicionales
   */
  className?: string;

  /**
   * Callback cuando se hace clic
   */
  onClick?: () => void;
}

/**
 * Componente para crear enlaces a Blockscout
 * Soporta transacciones, direcciones, bloques y tokens
 *
 * @example
 * ```tsx
 * <BlockscoutLink
 *   type="transaction"
 *   value="0x1234..."
 *   label="Ver transacción"
 * />
 * ```
 */
export function BlockscoutLink({
  type,
  value,
  network = 'local',
  truncate = true,
  label,
  showIcon = true,
  className,
  onClick,
}: BlockscoutLinkProps) {
  // Generar URL según el tipo
  const url = (() => {
    switch (type) {
      case 'transaction':
        return getTransactionUrl(value, network);
      case 'address':
        return getAddressUrl(value, network);
      case 'block':
        return getBlockUrl(value, network);
      case 'token':
        return getTokenUrl(value, network);
      default:
        return '#';
    }
  })();

  // Determinar el texto a mostrar
  const displayText = label || (truncate ? truncateHash(value) : value);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors',
        'underline underline-offset-4 decoration-primary/30 hover:decoration-primary/50',
        'font-mono text-sm',
        className
      )}
    >
      <span>{displayText}</span>
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </a>
  );
}

/**
 * Variante de BlockscoutLink específica para transacciones
 */
export function TransactionLink({
  txHash,
  network,
  ...props
}: Omit<BlockscoutLinkProps, 'type' | 'value'> & { txHash: string }) {
  return <BlockscoutLink type="transaction" value={txHash} network={network} {...props} />;
}

/**
 * Variante de BlockscoutLink específica para direcciones
 */
export function AddressLink({
  address,
  network,
  ...props
}: Omit<BlockscoutLinkProps, 'type' | 'value'> & { address: string }) {
  return <BlockscoutLink type="address" value={address} network={network} {...props} />;
}

/**
 * Variante de BlockscoutLink específica para bloques
 */
export function BlockLink({
  blockNumber,
  network,
  ...props
}: Omit<BlockscoutLinkProps, 'type' | 'value'> & { blockNumber: number | string }) {
  return (
    <BlockscoutLink
      type="block"
      value={blockNumber.toString()}
      network={network}
      truncate={false}
      {...props}
    />
  );
}

/**
 * Variante de BlockscoutLink específica para tokens
 */
export function TokenLink({
  tokenAddress,
  network,
  ...props
}: Omit<BlockscoutLinkProps, 'type' | 'value'> & { tokenAddress: string }) {
  return <BlockscoutLink type="token" value={tokenAddress} network={network} {...props} />;
}
