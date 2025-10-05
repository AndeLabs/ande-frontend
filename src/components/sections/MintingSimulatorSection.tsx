'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";

export default function MintingSimulatorSection() {
  const [andePrice, setAndePrice] = useState(10);
  const [ausdDemand, setAusdDemand] = useState(1000);

  const { abobToBurn, andeToMint } = useMemo(() => {
    // Lógica de simulación simplificada. Reemplazar con el modelo económico real.
    const andeRequired = ausdDemand / andePrice;
    const abobToBurn = ausdDemand * 0.01; // Suponiendo una tasa de quema del 1%
    return { abobToBurn, andeToMint: andeRequired };
  }, [andePrice, ausdDemand]);

  return (
    <section id="demo" className="py-16 sm:py-24 bg-muted/40">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="lg:pr-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Simulador Económico</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Interactúa con nuestro modelo económico para entender cómo los diferentes actores y fuerzas del mercado afectan la estabilidad y el crecimiento del ecosistema AndeChain.
          </p>
          <p className="mt-4 text-sm text-muted-foreground/80">
            <strong>Nota:</strong> Este es un simulador educativo para ilustrar los conceptos económicos propuestos. La lógica y los valores no representan el estado final del protocolo en la red.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Simulador de Emisión y Quema</CardTitle>
            <CardDescription>Ajusta los parámetros para ver cómo reacciona el sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ande-price">Precio de ANDE (en USD)</Label>
              <div className="flex items-center gap-4">
                <Slider id="ande-price" min={1} max={100} step={1} value={[andePrice]} onValueChange={(v) => setAndePrice(v[0])} />
                <span className="font-bold text-lg w-20 text-right">${andePrice}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ausd-demand">Demanda de aUSD</Label>
              <div className="flex items-center gap-4">
                <Slider id="ausd-demand" min={100} max={10000} step={100} value={[ausdDemand]} onValueChange={(v) => setAusdDemand(v[0])} />
                <span className="font-bold text-lg w-24 text-right">{ausdDemand.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">ABOB a Quemar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-destructive">{abobToBurn.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">ANDE a Emitir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-primary">{andeToMint.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
