# Sistema de Colores Centralizado - Ande Labs

## 🎨 Overview

Este documento describe el sistema completo de colores centralizado para Ande Labs. Es la única fuente de verdad para todas las decisiones de colores en la aplicación frontend.

## 🎯 Principios

1. **Centralización**: Todas las decisiones de colores están en un solo lugar
2. **Consistencia**: Los mismos colores se usan en toda la aplicación
3. **Escalabilidad**: Fácil de extender y mantener
4. **Professionalidad**: Sistema robusto que no causará problemas en el futuro

## 🌈 Paleta Oficial (colores.md)

### Colores Principales
- **Azul Profundo** (`#2455B8`) - Color principal para headers, botones, títulos
- **Naranja Vibrante** (`#FF9F1C`) - Acentos, elementos clave, CTAs
- **Lavanda Suave** (`#BFA4FF`) - Fondos alternos, tarjetas
- **Durazno Claro** (`#FFC77D`) - Fondos suaves, elementos secundarios

### Colores Neutros
- **Gris Claro** (`#F4F4F6`) - Backgrounds limpios
- **Gris Medio** (`#9A9A9A`) - Textos secundarios
- **Gris Oscuro** (`#393939`) - Textos principales

## 🏗️ Arquitectura del Sistema

### 1. Archivo Central: `src/lib/andecolors.ts`

Este archivo contiene TODAS las definiciones de colores:

```typescript
export const ANDE_COLORS = {
  primary: '#2455B8',    // Azul Profundo
  secondary: '#FF9F1C',  // Naranja Vibrante
  lavender: '#BFA4FF',   // Lavanda Suave
  peach: '#FFC77D',      // Durazno Claro
  // ...
};
```

### 2. Variables CSS: `src/app/globals.css`

Variables CSS para uso directo en Tailwind:

```css
:root {
  --ande-blue: #2455B8;
  --ande-orange: #FF9F1C;
  --ande-lavender: #BFA4FF;
  --ande-peach: #FFC77D;
  /* ... */
}
```

### 3. Clases CSS Utilitarias

Clases predefinidas para uso rápido:

```css
.text-ande-blue { color: #2455B8; }
.bg-ande-blue { background-color: #2455B8; }
.border-ande-blue { border-color: #2455B8; }
/* ... */
```

## 🎨 Uso en Componentes

### 1. Usando Clases CSS (Recomendado)

```tsx
// Texto con color Ande Blue
<p className="text-ande-blue">Texto en azul Ande</p>

// Background con opacidad
<div className="bg-ande-blue/10">Fondo azul 10%</div>

// Gradientes
<div className="ande-gradient-primary">Gradiente principal</div>
```

### 2. Usando el Sistema Centralizado

```tsx
import { ANDE_COLORS, ANDE_CLASSES } from '@/lib/andecolors';

// Acceso programático a colores
const primaryColor = ANDE_COLORS.primary; // '#2455B8'

// Clases predefinidas
const buttonClass = ANDE_CLASSES.button.primary; // 'ande-primary'
```

### 3. Componentes UI Actualizados

Los componentes UI ya tienen variantes Ande Labs:

```tsx
// Botones Ande Labs
<Button variant="ande-primary">Botón primario</Button>
<Button variant="ande-secondary">Botón secundario</Button>
<Button variant="ande-gradient">Botón con gradiente</Button>

// Tarjetas Ande Labs
<Card variant="ande-gradient">Tarjeta con gradiente</Card>
<Card variant="ande-lavender">Tarjeta lavanda</Card>

// Badges Ande Labs
<Badge variant="ande-primary">Badge primario</Badge>
<Badge variant="ande-success">Badge éxito</Badge>
```

## 🌓 Dark Mode

El sistema incluye soporte completo para dark mode:

```typescript
export const ANDE_COLORS_DARK = {
  primary: '#4A7FFF',    // Azul más brillante
  secondary: '#FFB366',  // Naranja más brillante
  // ...
};
```

Uso con dark mode:

```tsx
<div className="text-ande-blue dark:text-blue-400">
  Texto adaptable a dark mode
</div>
```

## 🎯 Componentes Actualizados

### 1. Dashboard (`/dashboard`)
- Headers con gradiente Ande Labs
- Tarjetas con variantes de colores
- Badges con colores temáticos
- Stats con colores consistentes

### 2. Analytics (`/dashboard/analytics`)
- Métricas con colores Ande Labs
- Visualizaciones coherentes
- Headers con gradiente principal

### 3. Bridge (`/dashboard/bridge`)
- Interfaz con colores Ande Labs
- Estados visualmente claros
- Elementos interactivos con colores consistentes

### 4. Componentes de Widget
- `QuickStatsWidget` con colores Ande Labs
- `NetworkStatusWidget` con indicadores visuales
- `BurnEngineWidget` con elementos temáticos

## 🧪 Página de Pruebas

Visita `http://localhost:9002/test-colors` para ver todos los colores en acción:

- Colores principales
- Gradientes
- Textos con colores
- Fondos con opacidad
- Sombras
- Estados hover

## 🔧 Mantenimiento

### Agregar Nuevo Color

1. **Actualizar `src/lib/andecolors.ts`:**
   ```typescript
   export const ANDE_COLORS = {
     // colores existentes...
     newColor: '#HEXVALUE',
   };
   ```

2. **Actualizar `src/app/globals.css`:**
   ```css
   :root {
     --ande-new-color: #HEXVALUE;
   }

   .text-ande-new-color { color: #HEXVALUE; }
   .bg-ande-new-color { background-color: #HEXVALUE; }
   ```

3. **Actualizar `tailwind.config.ts` (si es necesario):**
   ```typescript
   colors: {
     'ande-new-color': 'var(--ande-new-color)',
   }
   ```

### Modificar Color Existente

Solo cambia el valor en los tres lugares mencionados arriba. La centralización garantiza que el cambio se aplique en toda la aplicación.

## 📋 Checklist de Calidad

- [ ] Todo color usado viene de `ANDE_COLORS`
- [ ] No hay colores "hardcodeados" en componentes
- [ ] Los gradientes usan `ANDE_GRADIENTS`
- [ ] Las sombras usan `ANDE_SHADOWS`
- [ ] Los componentes usan variantes `ANDE_VARIANTS`
- [ ] El dark mode está implementado
- [ ] La página de pruebas muestra todos los colores

## 🚀 Beneficios

1. **Consistencia Visual**: Todos los colores son consistentes
2. **Mantenimiento Fácil**: Cambiar un color lo actualiza en toda la app
3. **Professionalismo**: Sistema robusto y escalable
4. **Desarrollo Rápido**: Clases predefinidas listas para usar
5. **Dark Mode**: Soporte completo incluido
6. **Documentación**: Guía completa para el equipo

## 📞 Soporte

Si tienes preguntas sobre el sistema de colores:

1. Revisa este documento primero
2. Visita la página de pruebas: `/test-colors`
3. Revisa `src/lib/andecolors.ts` para ver las definiciones
4. Revisa los componentes UI para ver ejemplos de uso

---

**Este sistema garantiza que los colores de Ande Labs sean profesionales, consistentes y mantenibles a largo plazo.**