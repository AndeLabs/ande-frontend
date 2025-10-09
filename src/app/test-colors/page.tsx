'use client';

import { ANDE_COLORS, ANDE_GRADIENTS, ANDE_CLASSES } from '@/lib/andecolors';

export default function TestColorsPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Test de Colores Ande Labs</h1>

      {/* Test de colores principales */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Colores Principales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 bg-ande-blue text-white rounded-lg">
            <p className="font-semibold">Ande Blue</p>
            <p className="text-sm">#2455B8</p>
          </div>
          <div className="p-6 bg-ande-orange text-white rounded-lg">
            <p className="font-semibold">Ande Orange</p>
            <p className="text-sm">#FF9F1C</p>
          </div>
          <div className="p-6 bg-ande-lavender text-gray-800 rounded-lg">
            <p className="font-semibold">Ande Lavender</p>
            <p className="text-sm">#BFA4FF</p>
          </div>
          <div className="p-6 bg-ande-peach text-gray-800 rounded-lg">
            <p className="font-semibold">Ande Peach</p>
            <p className="text-sm">#FFC77D</p>
          </div>
        </div>
      </div>

      {/* Test de colores de texto */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Colores de Texto</h2>
        <div className="space-y-2">
          <p className="text-ande-blue text-lg">Este texto es Ande Blue (#2455B8)</p>
          <p className="text-ande-orange text-lg">Este texto es Ande Orange (#FF9F1C)</p>
          <p className="text-ande-lavender text-lg">Este texto es Ande Lavender (#BFA4FF)</p>
          <p className="text-ande-peach text-lg">Este texto es Ande Peach (#FFC77D)</p>
          <p className="text-ande-gray text-lg">Este texto es Ande Gray (#9A9A9A)</p>
        </div>
      </div>

      {/* Test de gradientes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Gradientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 ande-gradient-primary text-white rounded-lg">
            <p className="font-semibold">Gradiente Primario</p>
            <p className="text-sm">Blue to Orange</p>
          </div>
          <div className="p-6 ande-gradient-secondary text-gray-800 rounded-lg">
            <p className="font-semibold">Gradiente Secundario</p>
            <p className="text-sm">Lavender to Peach</p>
          </div>
        </div>
      </div>

      {/* Test de texto con gradiente */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Texto con Gradiente</h2>
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-3xl font-bold ande-gradient-text mb-4">
            Título con Gradiente Ande Labs
          </h3>
          <p className="text-lg">
            Este es un ejemplo de texto con gradiente usando los colores de Ande Labs
          </p>
        </div>
      </div>

      {/* Test de fondos con opacidad */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fondos con Opacidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-ande-blue/10 border border-ande-blue rounded-lg">
            <p className="font-semibold text-ande-blue">Fondo Ande Blue 10%</p>
            <p className="text-sm text-ande-gray">Con borde Ande Blue</p>
          </div>
          <div className="p-6 bg-ande-orange/10 border border-ande-orange rounded-lg">
            <p className="font-semibold text-ande-orange">Fondo Ande Orange 10%</p>
            <p className="text-sm text-ande-gray">Con borde Ande Orange</p>
          </div>
        </div>
      </div>

      {/* Test de sombras */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sombras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white shadow-ande-blue rounded-lg">
            <p className="font-semibold text-ande-blue">Sombra Ande Blue</p>
            <p className="text-sm text-ande-gray">Sombra azulada</p>
          </div>
          <div className="p-6 bg-white shadow-ande-orange rounded-lg">
            <p className="font-semibold text-ande-orange">Sombra Ande Orange</p>
            <p className="text-sm text-ande-gray">Sombra anaranjada</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-ande-gray">
          ✅ Si puedes ver estos colores correctamente, el sistema de colores Ande Labs está funcionando perfectamente.
        </p>
      </div>
    </div>
  );
}