'use client';

import { FaucetSection } from '@/components/blockchain/FaucetSection';
import { AndePage } from '@/components/ui/AndePage';

export default function FaucetPage() {
  return (
    <AndePage pageId="faucet">
      <FaucetSection />
    </AndePage>
  );
}
