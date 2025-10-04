"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Database, Cpu, Coins, ArrowRight, ChevronsRight, TestTube2 } from "lucide-react";

const steps = [
  {
    icon: <User className="h-8 w-8" />,
    title: "Paso 1: Depósito de Colateral",
    description: "El usuario deposita tokens ANDE como colateral en el contrato StabilityEngine."
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Paso 2: Consulta al Oráculo",
    description: "El StabilityEngine consulta al P2POracleV2 para obtener el precio actual y verificado de ANDE."
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Paso 3: Acuñación de ABOB",
    description: "Basado en el valor del colateral y el precio del oráculo, el contrato acuña (mints) la cantidad correspondiente de ABOB."
  },
  {
    icon: <Coins className="h-8 w-8" />,
    title: "Paso 4: Recepción en la Billetera",
    description: "Los nuevos tokens ABOB aparecen en la billetera del usuario, listos para ser usados."
  }
];

export default function MintingSimulatorSection() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="demo" className="w-full py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Demo: ¿Cómo se crea ABOB?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simula el proceso de acuñación de ABOB paso a paso para entender visualmente cómo funciona la magia.
          </p>
        </div>

        <Card className="mt-12 max-w-4xl mx-auto overflow-hidden">
          <CardHeader>
            <CardTitle>Simulador de Acuñación</CardTitle>
            <CardDescription>Sigue los pasos para ver el flujo de creación de la stablecoin.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={progressValue} className="w-full" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                {steps.map((_, index) => (
                  <span key={index} className={`w-1/4 text-center ${index === currentStep ? 'font-bold text-primary' : ''}`}>
                    Paso {index + 1}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[150px] bg-background p-6 rounded-lg border">
                {steps.map((step, index) => (
                    <div key={index} className={`transition-opacity duration-500 ease-in-out ${index === currentStep ? 'opacity-100' : 'opacity-0 absolute top-6 left-6 right-6'}`}>
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="flex-shrink-0 text-primary">{React.cloneElement(step.icon, { className: 'h-12 w-12' })}</div>
                            <div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground mt-2">{step.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button onClick={handleNext} className="w-full sm:w-auto">
                {currentStep < steps.length - 1 ? "Siguiente Paso" : "Reiniciar Simulación"} <ChevronsRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto bg-accent/10 border-accent text-accent hover:bg-accent/20">
                <TestTube2 className="mr-2 h-4 w-4" /> Probar en Testnet Real
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
