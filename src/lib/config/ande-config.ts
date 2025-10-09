/**
 * Sistema Centralizado de Configuración de AndeChain
 * Cambios aquí se aplican globalmente en toda la aplicación
 */

// Esquema de colores global unificado
export const ANDE_COLORS = {
  // Colores principales (brand)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Azul Ande principal
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Colores de tokens
  tokens: {
    ande: '#0ea5e9',     // Azul - ANDE Token
    ausd: '#10b981',     // Verde - aUSD Stablecoin
    abob: '#f59e0b',     // Ámbar - aBOB Boliviano
    sabob: '#8b5cf6',    // Púrpura - sABOB Staked
    veande: '#ec4899',   // Rosa - veANDE Governance
  },

  // Colores de funcionalidades
  functions: {
    staking: '#10b981',     // Verde - Staking/Yield
    governance: '#8b5cf6',  // Púrpura - Governance
    bridge: '#f59e0b',      // Ámbar - Bridge
    faucet: '#06b6d4',      // Cian - Faucet
    tools: '#6366f1',       // Índigo - Developer Tools
    logs: '#ef4444',        // Rojo - Logs/Monitoring
    analytics: '#14b8a6',   // Teal - Analytics
  },

  // Gradients predefinidos
  gradients: {
    ande: 'from-blue-600 to-cyan-500',
    staking: 'from-green-600 to-emerald-500',
    governance: 'from-purple-600 to-pink-500',
    bridge: 'from-amber-600 to-orange-500',
    tools: 'from-indigo-600 to-blue-500',
    logs: 'from-red-600 to-orange-500',
  },

  // Colores semánticos
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
} as const;

// Configuración de páginas
export const DASHBOARD_PAGES = {
  main: {
    id: 'main',
    title: 'Resumen de AndeChain',
    description: 'Vista general del ecosistema blockchain soberano para América Latina',
    badge: 'Red Activa',
    badgeVariant: 'success' as const,
    color: ANDE_COLORS.primary[500],
    gradient: ANDE_COLORS.gradients.ande,
    icon: 'Activity',
  },

  billetera: {
    id: 'billetera',
    title: 'Billetera AndeChain',
    description: 'Gestiona tus activos ANDE, aUSD y aBOB',
    badge: 'Conectado',
    badgeVariant: 'success' as const,
    color: ANDE_COLORS.tokens.ande,
    gradient: ANDE_COLORS.gradients.ande,
    icon: 'Wallet',
  },

  staking: {
    id: 'staking',
    title: 'Staking AndeChain',
    description: 'Gobierno veANDE y yield farming aBOB/sABOB con 5% APY',
    badge: 'Staking Activo',
    badgeVariant: 'success' as const,
    color: ANDE_COLORS.functions.staking,
    gradient: ANDE_COLORS.gradients.staking,
    icon: 'Lock',
    features: [
      { label: '5% APY', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-800' },
      { label: 'Governance', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-800' },
    ],
  },

  governance: {
    id: 'governance',
    title: 'Gobernanza AndeChain',
    description: 'Gobierno on-chain con supermajority y propuestas DAO',
    badge: 'Gobernanza Activa',
    badgeVariant: 'default' as const,
    color: ANDE_COLORS.functions.governance,
    gradient: ANDE_COLORS.gradients.governance,
    icon: 'Vote',
    features: [
      { label: 'veANDE', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-800' },
      { label: 'Supermajority', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-800' },
    ],
  },

  bridge: {
    id: 'bridge',
    title: 'Puente Cross-Chain',
    description: 'Transferencias con Celestia DA',
    badge: 'Puente Activo',
    badgeVariant: 'default' as const,
    color: ANDE_COLORS.functions.bridge,
    gradient: ANDE_COLORS.gradients.bridge,
    icon: 'ArrowRightLeft',
  },

  faucet: {
    id: 'faucet',
    title: 'Faucet de AndeChain',
    description: 'Obtén tokens de prueba para desarrollar en la red de prueba',
    badge: 'Faucet Activo',
    badgeVariant: 'success' as const,
    color: ANDE_COLORS.functions.faucet,
    gradient: ANDE_COLORS.gradients.ande,
    icon: 'Droplet',
  },

  tools: {
    id: 'tools',
    title: 'Developer Tools - AndeChain',
    description: 'Herramientas completas para desarrollar en AndeChain: ANDE Token Duality, Bridge Cross-Chain, Oracles P2P, y más',
    badge: 'Herramientas Disponibles',
    badgeVariant: 'default' as const,
    color: ANDE_COLORS.functions.tools,
    gradient: ANDE_COLORS.gradients.tools,
    icon: 'Code',
    features: [
      { label: 'ANDE Native Gas', variant: 'ande-outline-primary' as const },
      { label: 'Celestia DA', variant: 'ande-lavender' as const },
      { label: 'ev-reth Integration', variant: 'ande-success' as const },
      { label: 'Precompile 0x...FD', variant: 'ande-secondary' as const },
    ],
  },

  logs: {
    id: 'logs',
    title: 'Live Infrastructure Logs - AndeChain',
    description: 'Monitor en tiempo real de la infraestructura completa: ev-reth, sequencer, Celestia DA y bridge relayer',
    badge: 'Logs en Vivo',
    badgeVariant: 'success' as const,
    color: ANDE_COLORS.functions.logs,
    gradient: ANDE_COLORS.gradients.logs,
    icon: 'Activity',
    features: [
      { label: 'ANDE Native Gas', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-800' },
      { label: 'ev-reth Integration', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-800' },
      { label: 'Celestia DA', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-800' },
      { label: 'Bridge Relayer', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-800' },
    ],
  },

  analytics: {
    id: 'analytics',
    title: 'AndeChain Analytics',
    description: 'Analíticas avanzadas del ecosistema y métricas de red',
    badge: 'Analytics Activo',
    badgeVariant: 'default' as const,
    color: ANDE_COLORS.functions.analytics,
    gradient: ANDE_COLORS.gradients.ande,
    icon: 'BarChart3',
  },
} as const;

// Tipos para TypeScript
export type PageConfig = typeof DASHBOARD_PAGES[keyof typeof DASHBOARD_PAGES];
export type ColorScheme = typeof ANDE_COLORS;