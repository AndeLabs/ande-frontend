/**
 * Componente Universal de Página AndeChain
 * Usa configuración centralizada para consistencia total
 */

import { ReactNode } from 'react';
import { DashboardHeader, SectionWrapper } from '@/components/ui/layouts';
import { Badge } from '@/components/ui/badge';
import { DASHBOARD_PAGES, PageConfig } from '@/lib/config/ande-config';
import { LucideIcon } from 'lucide-react';

interface AndePageProps {
  pageId: keyof typeof DASHBOARD_PAGES;
  children: ReactNode;
  customFeatures?: Array<{
    label: string;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    variant?: string;
    icon?: LucideIcon;
  }>;
  showFeatures?: boolean;
  className?: string;
}

export function AndePage({
  pageId,
  children,
  customFeatures,
  showFeatures = true,
  className = ''
}: AndePageProps) {
  const pageConfig = DASHBOARD_PAGES[pageId];

  // Generar badges automáticamente desde la configuración
  const renderFeatures = () => {
    if (!showFeatures || (!pageConfig.features && !customFeatures)) return null;

    const features = customFeatures || pageConfig.features;

    return (
      <div className="flex flex-wrap gap-3 mb-6">
        {features?.map((feature, index) => {
          // Renderizado para badges con colores custom
          if (feature.color && feature.bgColor && feature.borderColor) {
            return (
              <Badge
                key={index}
                className={`${feature.bgColor} ${feature.color} ${feature.borderColor} border`}
              >
                {feature.icon && <feature.icon className="w-4 h-4 mr-2" />}
                {feature.label}
              </Badge>
            );
          }

          // Renderizado para badges con variant
          if (feature.variant) {
            return (
              <Badge
                key={index}
                variant={feature.variant as any}
              >
                {feature.icon && <feature.icon className="w-4 h-4 mr-2" />}
                {feature.label}
              </Badge>
            );
          }

          // Default fallback
          return (
            <Badge key={index} variant="outline">
              {feature.icon && <feature.icon className="w-4 h-4 mr-2" />}
              {feature.label}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <DashboardHeader
        title={pageConfig.title}
        description={pageConfig.description}
        badge={pageConfig.badge}
        badgeVariant={pageConfig.badgeVariant}
        background="gradient"
      />

      <SectionWrapper>
        {renderFeatures()}
        {children}
      </SectionWrapper>
    </div>
  );
}

// Helper function para obtener configuración de página
export function getPageConfig(pageId: keyof typeof DASHBOARD_PAGES): PageConfig {
  return DASHBOARD_PAGES[pageId];
}

// Hook para usar configuración de página en componentes
export function usePageConfig(pageId: keyof typeof DASHBOARD_PAGES) {
  return DASHBOARD_PAGES[pageId];
}