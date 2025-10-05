/**
 * Utilidades para integración con Blockscout
 * Proporciona funciones para generar enlaces a transacciones, direcciones y bloques
 */

// Configuración de Blockscout por red
export const BLOCKSCOUT_CONFIG = {
  // Local development
  local: {
    name: 'AndeChain Local',
    url: 'http://localhost:4000',
    chainId: 1234,
  },
  // Testnet (cuando esté disponible)
  testnet: {
    name: 'AndeChain Testnet',
    url: 'https://testnet-explorer.andechain.io',
    chainId: 12340,
  },
  // Mainnet (futuro)
  mainnet: {
    name: 'AndeChain',
    url: 'https://explorer.andechain.io',
    chainId: 1234,
  },
} as const;

export type NetworkName = keyof typeof BLOCKSCOUT_CONFIG;

/**
 * Obtiene la configuración de Blockscout para la red actual
 */
export function getBlockscoutConfig(network: NetworkName = 'local') {
  return BLOCKSCOUT_CONFIG[network];
}

/**
 * Genera URL para una transacción en Blockscout
 * @param txHash - Hash de la transacción
 * @param network - Red objetivo (default: local)
 * @returns URL completa de Blockscout
 */
export function getTransactionUrl(txHash: string, network: NetworkName = 'local'): string {
  const config = getBlockscoutConfig(network);
  return `${config.url}/tx/${txHash}`;
}

/**
 * Genera URL para una dirección en Blockscout
 * @param address - Dirección de Ethereum
 * @param network - Red objetivo (default: local)
 * @returns URL completa de Blockscout
 */
export function getAddressUrl(address: string, network: NetworkName = 'local'): string {
  const config = getBlockscoutConfig(network);
  return `${config.url}/address/${address}`;
}

/**
 * Genera URL para un bloque en Blockscout
 * @param blockNumber - Número de bloque o hash
 * @param network - Red objetivo (default: local)
 * @returns URL completa de Blockscout
 */
export function getBlockUrl(blockNumber: number | string, network: NetworkName = 'local'): string {
  const config = getBlockscoutConfig(network);
  return `${config.url}/block/${blockNumber}`;
}

/**
 * Genera URL para un token en Blockscout
 * @param tokenAddress - Dirección del contrato del token
 * @param network - Red objetivo (default: local)
 * @returns URL completa de Blockscout
 */
export function getTokenUrl(tokenAddress: string, network: NetworkName = 'local'): string {
  const config = getBlockscoutConfig(network);
  return `${config.url}/token/${tokenAddress}`;
}

/**
 * Acorta un hash o dirección para display
 * @param hash - Hash o dirección completa
 * @param startLength - Caracteres al inicio (default: 6)
 * @param endLength - Caracteres al final (default: 4)
 * @returns Hash acortado formato: 0x1234...5678
 */
export function truncateHash(
  hash: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!hash || hash.length < startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

/**
 * Valida si un string es un hash de transacción válido
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
}

/**
 * Valida si un string es una dirección de Ethereum válida
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Obtiene el estado de una transacción desde Blockscout API
 * @param txHash - Hash de la transacción
 * @param network - Red objetivo
 */
export async function getTransactionStatus(
  txHash: string,
  network: NetworkName = 'local'
): Promise<'success' | 'failed' | 'pending' | 'unknown'> {
  try {
    const config = getBlockscoutConfig(network);
    const response = await fetch(`${config.url}/api/v2/transactions/${txHash}`);

    if (!response.ok) return 'unknown';

    const data = await response.json();

    if (data.status === 'ok' || data.result?.status === '1') return 'success';
    if (data.status === 'error' || data.result?.status === '0') return 'failed';

    return 'pending';
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return 'unknown';
  }
}

/**
 * Espera a que una transacción sea minada
 * @param txHash - Hash de la transacción
 * @param network - Red objetivo
 * @param maxAttempts - Número máximo de intentos (default: 30)
 * @param delayMs - Delay entre intentos en ms (default: 2000)
 */
export async function waitForTransaction(
  txHash: string,
  network: NetworkName = 'local',
  maxAttempts: number = 30,
  delayMs: number = 2000
): Promise<'success' | 'failed' | 'timeout'> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getTransactionStatus(txHash, network);

    if (status === 'success') return 'success';
    if (status === 'failed') return 'failed';

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return 'timeout';
}

/**
 * Abre Blockscout en una nueva pestaña
 */
export function openInBlockscout(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
