import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection';
import AbobPaySection from '@/components/sections/AbobPaySection';
import AndeChainInfraSection from '@/components/sections/AndeChainInfraSection';
import TritokenSystemSection from '@/components/sections/TritokenSystemSection';
import CommunitySection from '@/components/sections/CommunitySection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-12 md:space-y-24 lg:space-y-32 py-12 md:py-24 lg:py-32">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="solucion">
          <ProblemSolutionSection />
        </section>
        <section id="infraestructura">
          <AndeChainInfraSection />
        </section>
        <section id="tokens">
          <TritokenSystemSection />
        </section>
        <section id="abobpay">
          <AbobPaySection />
        </section>
        <section id="comunidad">
          <CommunitySection />
        </section>
      </main>
      <Footer />
    </div>
  );
}