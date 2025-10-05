'use client';

import { Governance } from '@/components/sections/Governance';

export default function GovernancePage() {
  return (
    <main className="flex-1 space-y-12 md:space-y-24 lg:space-y-32 py-12 md:py-24 lg:py-32">
      <div className="container">
        <Governance />
      </div>
    </main>
  );
}
