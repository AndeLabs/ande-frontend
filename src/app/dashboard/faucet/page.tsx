'use client';

import { FaucetSection } from '@/components/blockchain/FaucetSection';

export default function FaucetPage() {
  return (
    <main className="flex-1 p-4 md:p-8 lg:p-12">
      <div className="container">
        <FaucetSection />
      </div>
    </main>
  );
}
