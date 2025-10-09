'use client';

import { StakingWidget } from '@/components/dashboard/StakingWidget';
import { AndePage } from '@/components/ui/AndePage';

export default function StakingPage() {
  return (
    <AndePage pageId="staking">
      <StakingWidget expanded={true} />
    </AndePage>
  );
}
