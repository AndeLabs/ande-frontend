/**
 * SISTEMA DE COLORES CENTRALIZADO - ANDE LABS
 *
 * Este archivo centraliza TODAS las decisiones de colores para Ande Labs.
 * Es la única fuente de verdad para colores en la aplicación.
 *
 * Paleta oficial de colores (definida en colores.md):
 * - #2455B8 - Azul Profundo (principal)
 * - #FF9F1C - Naranja Vibrante (acentos)
 * - #BFA4FF - Lavanda Suave (fondos)
 * - #FFC77D - Durazno Claro (secundarios)
 * - #F4F4F6 - Gris Claro (backgrounds)
 * - #9A9A9A - Gris Medio (textos)
 * - #393939 - Gris Oscuro (textos principales)
 */

export const ANDE_COLORS = {
  // Colores principales - Exactamente como en colores.md
  primary: '#2455B8',    // Azul Profundo
  secondary: '#FF9F1C',  // Naranja Vibrante
  lavender: '#BFA4FF',   // Lavanda Suave
  peach: '#FFC77D',      // Durazno Claro

  // Colores neutros
  gray50: '#F4F4F6',     // Gris Claro
  gray300: '#9A9A9A',    // Gris Medio
  gray800: '#393939',    // Gris Oscuro

  // Colores semánticos (basados en Ande Labs)
  success: '#10b981',
  warning: '#FF9F1C',    // Usamos naranja Ande para advertencias
  error: '#ef4444',
  info: '#2455B8',       // Usamos azul Ande para información
} as const;

// Dark mode colors
export const ANDE_COLORS_DARK = {
  primary: '#4A7FFF',    // Azul más brillante para dark mode
  secondary: '#FFB366',  // Naranja más brillante para dark mode
  lavender: '#D4B5FF',   // Lavanda más brillante para dark mode
  peach: '#FFD6B3',      // Durazno más brillante para dark mode

  // Neutros para dark mode
  gray50: '#393939',
  gray300: '#d1d5db',
  gray800: '#F4F4F6',
} as const;

// Gradientes Ande Labs
export const ANDE_GRADIENTS = {
  primary: 'linear-gradient(135deg, #2455B8 0%, #FF9F1C 100%)',
  secondary: 'linear-gradient(135deg, #BFA4FF 0%, #FFC77D 100%)',
  hero: 'linear-gradient(135deg, rgba(36, 85, 184, 0.1) 0%, rgba(255, 159, 28, 0.05) 100%)',
  text: 'linear-gradient(135deg, #2455B8 0%, #FF9F1C 100%)',
} as const;

// Sombras Ande Labs
export const ANDE_SHADOWS = {
  blue: '0 4px 14px 0 rgba(36, 85, 184, 0.3)',
  orange: '0 4px 14px 0 rgba(255, 159, 28, 0.3)',
  lavender: '0 4px 14px 0 rgba(191, 164, 255, 0.3)',
  default: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Clases CSS para Tailwind
export const ANDE_CLASSES = {
  // Text colors
  text: {
    primary: 'text-ande-blue',
    secondary: 'text-ande-orange',
    lavender: 'text-ande-lavender',
    peach: 'text-ande-peach',
    gray: 'text-ande-gray',
  },

  // Background colors
  bg: {
    primary: 'bg-ande-blue',
    secondary: 'bg-ande-orange',
    lavender: 'bg-ande-lavender',
    peach: 'bg-ande-peach',
    gray: 'bg-ande-gray',
  },

  // Background colors con opacidad
  bgOpacity: {
    primary10: 'bg-ande-blue/10',
    secondary10: 'bg-ande-orange/10',
    lavender10: 'bg-ande-lavender/10',
    peach10: 'bg-ande-peach/10',
  },

  // Border colors
  border: {
    primary: 'border-ande-blue',
    secondary: 'border-ande-orange',
    lavender: 'border-ande-lavender',
    peach: 'border-ande-peach',
    gray: 'border-ande-gray',
  },

  // Gradientes
  gradient: {
    primary: 'ande-gradient-primary',
    secondary: 'ande-gradient-secondary',
    text: 'ande-gradient-text',
  },

  // Sombras
  shadow: {
    primary: 'shadow-ande-blue',
    secondary: 'shadow-ande-orange',
  },
} as const;

// Variantes para componentes UI
export const ANDE_VARIANTS = {
  button: {
    primary: 'ande-primary',
    secondary: 'ande-secondary',
    outline: 'ande-outline',
    gradient: 'ande-gradient',
    ghost: 'ande-ghost',
  },

  card: {
    gradient: 'ande-gradient',
    lavender: 'ande-lavender',
    peach: 'ande-peach',
    outline: 'ande-outline',
  },

  badge: {
    primary: 'ande-primary',
    secondary: 'ande-secondary',
    success: 'ande-success',
    warning: 'ande-warning',
    gradient: 'ande-gradient',
  },
} as const;

// Tema completo para styled-components o theme providers
export const ANDE_THEME = {
  colors: ANDE_COLORS,
  darkColors: ANDE_COLORS_DARK,
  gradients: ANDE_GRADIENTS,
  shadows: ANDE_SHADOWS,
  classes: ANDE_CLASSES,
  variants: ANDE_VARIANTS,
} as const;

// Utilidades para obtener colores
export const getAndeColor = (colorName: keyof typeof ANDE_COLORS, isDark = false): string => {
  return isDark ? ANDE_COLORS_DARK[colorName as keyof typeof ANDE_COLORS_DARK] || ANDE_COLORS[colorName] : ANDE_COLORS[colorName];
};

export const getAndeGradient = (gradientName: keyof typeof ANDE_GRADIENTS): string => {
  return ANDE_GRADIENTS[gradientName];
};

export const getAndeShadow = (shadowName: keyof typeof ANDE_SHADOWS): string => {
  return ANDE_SHADOWS[shadowName];
};

export const getAndeClass = (type: keyof typeof ANDE_CLASSES, variantName: string): string => {
  return ANDE_CLASSES[type][variantName as keyof typeof ANDE_CLASSES[typeof type]] || '';
};

export default ANDE_THEME;