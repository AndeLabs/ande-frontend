'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/ui/layouts';
import { useAccount, useBalance } from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

function FaucetHint() {
  const { address, connector } = useAccount();
  const { data: balance } = useBalance({ address });
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    if (connector?.name === 'Mock' && balance?.value === 0n) {
      setShowHint(true);
    }
  }, [connector, balance]);

  if (!showHint) return null;

  return (
    <div className="container py-4">
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>¡Bienvenido a AndeChain!</AlertTitle>
            <AlertDescription>
                Hemos creado una billetera de prueba para ti. Ve a la página de Faucet para obtener tus primeros tokens.
            </AlertDescription>
        </Alert>
    </div>
  );
}

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <FaucetHint />
      {children}
    </DashboardLayout>
  );
}
