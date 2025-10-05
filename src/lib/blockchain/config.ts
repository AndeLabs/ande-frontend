
import { http, createConfig } from 'wagmi';
import { celo, mainnet, sepolia } from 'wagmi/chains';
import { injected, mock } from 'wagmi/connectors';

// Definición de nuestra AndeChain local
export const andechain = {
  id: 1234, // Chain ID real de la red de desarrollo
  name: 'AndeChain Local',
  nativeCurrency: { name: 'Ande Ether', symbol: 'AETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'http://localhost:4000' },
  },
  testnet: true,
};

const burnerAccount = '0x1EBD9354513236465d59B945a423B10694BA43a1a804cdab365a5de4111afa1a' as const;

export const config = createConfig({
  chains: [andechain, mainnet, sepolia, celo],
  connectors: [
    injected(), // Soporte para MetaMask y otras wallets inyectadas
    mock({
        accounts: [burnerAccount],
    }),
  ],
  transports: {
    [andechain.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [celo.id]: http(),
  },
});
