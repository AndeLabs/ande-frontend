'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useConnect, useConnectors } from 'wagmi';
import { config } from '@/lib/blockchain/config';

const queryClient = new QueryClient();

function AutoConnect({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const connectors = useConnectors();

  useEffect(() => {
    const mockConnector = connectors.find(c => c.name === 'Mock');
    if (!isConnected && mockConnector) {
      connect({ connector: mockConnector });
    }
  }, [isConnected, connectors, connect]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect>{children}</AutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
