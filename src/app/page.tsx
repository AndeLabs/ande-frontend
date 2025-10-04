import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import ProblemSolutionSection from '@/components/sections/problem-solution-section';
import AbobPaySection from '@/components/sections/abob-pay-section';
import AndeChainInfraSection from '@/components/sections/ande-chain-infra-section';
import TritokenSystemSection from '@/components/sections/tritoken-system-section';
import MintingSimulatorSection from '@/components/sections/minting-simulator-section';
import CommunitySection from '@/components/sections/community-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <AbobPaySection />
        <AndeChainInfraSection />
        <TritokenSystemSection />
        <MintingSimulatorSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
