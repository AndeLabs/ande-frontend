'use client';

import { BilleteraBimonetaria } from '@/components/sections';
import { DashboardHeader, SectionWrapper } from '@/components/ui/layouts';

export default function BilleteraPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Billetera AndeChain"
        description="Gestiona tus activos ANDE, aUSD y aBOB"
        badge="Conectado"
        badgeVariant="success"
      />

      <SectionWrapper variant="compact">
        <section id="billetera-completa">
          <BilleteraBimonetaria />
        </section>
      </SectionWrapper>
    </div>
  );
}