import { PageLayout, SectionWrapper } from '@/components/ui/layouts';
import {
  HeroSection,
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
      <SectionWrapper id="solucion" background="muted">
        <ProblemSolutionSection />
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
      <SectionWrapper id="comunidad" background="muted">
        <CommunitySection />
      </SectionWrapper>
    </PageLayout>
  );
}