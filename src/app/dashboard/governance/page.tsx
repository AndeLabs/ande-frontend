'use client';

import { GovernanceWidget } from '@/components/dashboard/GovernanceWidget';
import { AndePage } from '@/components/ui/AndePage';

export default function GovernancePage() {
  return (
    <AndePage pageId="governance">
      <GovernanceWidget expanded={true} />
    </AndePage>
  );
}
