# Demostración del Sistema Centralizado

## Antes: Sistema Desconectado ❌

Cada página tenía:
- Colores hardcoded: `bg-green-500/20 text-green-400 border-green-800`
- Títulos duplicados: `"Staking AndeChain"` en múltiples lugares
- Badges manuales: `<Badge className="...">5% APY</Badge>`
- Estructuras independientes y inconsistentes

**Para cambiar un color había que modificar 10+ archivos manualmente**

## Después: Sistema Centralizado ✅

Ahora todas las páginas usan:
```tsx
<AndePage pageId="staking">
  <StakingWidget expanded={true} />
</AndePage>
```

**Con un solo cambio en `ande-config.ts` afecto a todas las páginas:**

```typescript
// Cambiar el color de staking en un solo lugar
staking: {
  color: '#10b981',     // Verde - Antes
  color: '#3b82f6',     // Azul - Después
  gradient: 'from-green-600 to-emerald-500',     // Antes
  gradient: 'from-blue-600 to-indigo-500',       // Después
}
```

## Poder del Sistema Centralizado

### 1. **Single Source of Truth**
- Un archivo controla: colores, títulos, descripciones, badges, gradients
- Sin duplicación de información
- Cambios globales con una línea de código

### 2. **Consistencia Garantizada**
- Todas las páginas usan el mismo componente `<AndePage>`
- Misma estructura, espaciado, y comportamiento
- Tipado TypeScript para evitar errores

### 3. **Mantenimiento Simplificado**
- Agregar nueva página: solo agregar config + 1 línea de código
- Cambiar tema global: modificar `ANDE_COLORS`
- Actualizar badges: modificar `features` array

### 4. **Escalabilidad Infinita**
```typescript
// Nueva página en 30 segundos:
analytics: {
  title: 'AndeChain Analytics',
  description: '...',
  badge: 'Analytics Activo',
  color: ANDE_COLORS.functions.analytics,
  gradient: ANDE_COLORS.gradients.ande,
  features: [/* badges automáticos */],
}

// Uso en la página:
<AndePage pageId="analytics">
  <AnalyticsContent />
</AndePage>
```

## Ejemplo Real: Cambio de Tema

**Para cambiar todo el tema de AndeChain de azul a púrpura:**

```typescript
// Solo este cambio en ande-config.ts
export const ANDE_COLORS = {
  primary: {
    500: '#0ea5e9', // Azul - Antes
    500: '#8b5cf6', // Púrpura - Después
  }
  // ... todas las páginas automáticamente actualizadas
}
```

**Resultado:** Todas las páginas, badges, gradients, y elementos visuales se actualizan instantáneamente.

Este es el poder de una arquitectura centralizada profesional.