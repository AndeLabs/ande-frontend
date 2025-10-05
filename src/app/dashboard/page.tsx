'use client';

import { BilleteraBimonetaria } from '@/components/sections/BilleteraBimonetaria';
import MintingSimulatorSection from '@/components/sections/MintingSimulatorSection';

export default function DashboardPage() {
  return (
    <main className="flex-1 space-y-12 md:space-y-24 lg:space-y-32 py-12 md:py-24 lg:py-32">
        <section id="billetera">
          <BilleteraBimonetaria />
        </section>
        <section id="demo">
          <MintingSimulatorSection />
        </section>
    </main>
  );
}