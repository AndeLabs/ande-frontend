import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { StakingSection, GovernanceSection } from '@/components/sections';

export default function GovernancePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto max-w-4xl text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Gobernanza & Staking
            </h1>
            <p className="text-xl text-muted-foreground">
              Participa en el futuro de AndeChain bloqueando tus tokens y votando en propuestas
            </p>
          </div>
        </section>

        {/* Staking Section */}
        <StakingSection />

        {/* Governance Section */}
        <GovernanceSection />
      </main>
      <Footer />
    </div>
  );
}
