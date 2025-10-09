import { PageLayout, SectionWrapper } from '@/components/ui/layouts';
import {
  HeroSection,
  ProductsSection,
  FeaturesTabsSection,
  EcosystemSection,
  ProblemSolutionSection,
  AbobPaySection,
  AndeChainInfraSection,
  TritokenSystemSection,
  CommunitySection
} from '@/components/sections';

export default function Home() {
  return (
    <PageLayout variant="landing">
      <SectionWrapper id="hero" variant="wide" padding="xl">
        <HeroSection />
      </SectionWrapper>
      <SectionWrapper id="productos" background="muted">
        <ProductsSection />
      </SectionWrapper>
      <SectionWrapper id="solucion">
        <ProblemSolutionSection />
      </SectionWrapper>
      <SectionWrapper id="caracteristicas" background="muted">
        <FeaturesTabsSection />
      </SectionWrapper>
      <SectionWrapper id="infraestructura">
        <AndeChainInfraSection />
      </SectionWrapper>
      <SectionWrapper id="tokens" background="muted">
        <TritokenSystemSection />
      </SectionWrapper>
      <SectionWrapper id="abobpay">
        <AbobPaySection />
      </SectionWrapper>
      <SectionWrapper id="ecosistema" background="muted">
        <EcosystemSection />
      </SectionWrapper>
      <SectionWrapper id="comunidad">
        <CommunitySection />
      </SectionWrapper>
    </PageLayout>
  );
}