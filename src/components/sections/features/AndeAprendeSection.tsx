"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { generatePath, type State, type LearningPathOutput } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, BookOpen, Bot, BrainCircuit, Clock, List, LoaderCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          Generar Ruta de Aprendizaje <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function LearningPathForm({ state, dispatch, formRef }: { state: State; dispatch: (formData: FormData) => void; formRef: React.RefObject<HTMLFormElement> }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl flex items-center gap-2">
        <Bot className="h-6 w-6 text-accent" /> Cuéntanos sobre ti
      </h3>
      <form action={dispatch} ref={formRef} className="space-y-4">
        <div>
          <Label htmlFor="userProfile">Describe tu perfil</Label>
          <Textarea
            id="userProfile"
            name="userProfile"
            placeholder="Ej: Soy estudiante de economía con conocimientos básicos de criptomonedas. Me interesa entender cómo la tecnología puede mejorar las finanzas en Bolivia."
            className="mt-1"
            aria-describedby="userProfile-error"
          />
          <div id="userProfile-error" aria-live="polite" aria-atomic="true">
            {state.errors?.userProfile?.map((error: string) => (
              <p className="mt-1 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="learningGoals">¿Qué quieres aprender?</Label>
          <Textarea
            id="learningGoals"
            name="learningGoals"
            placeholder="Ej: Quiero aprender a crear un presupuesto personal, entender qué es una stablecoin y cómo funciona la gobernanza en un proyecto blockchain."
            className="mt-1"
            aria-describedby="learningGoals-error"
          />
          <div id="learningGoals-error" aria-live="polite" aria-atomic="true">
            {state.errors?.learningGoals?.map((error: string) => (
              <p className="mt-1 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>
        <SubmitButton />
        <div aria-live="polite" aria-atomic="true">
          {state.errors?.server?.map((error: string) => (
            <p className="mt-1 text-sm text-destructive" key={error}>
              {error}
            </p>
          ))}
        </div>
      </form>
    </div>
  );
}

function LearningPathResult({ data }: { data: LearningPathOutput | null | undefined }) {
    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-xl flex items-center gap-2">
                <List className="h-6 w-6 text-accent" /> Tu ruta personalizada
            </h3>
            {data?.learningPath ? (
                <Accordion type="single" collapsible className="w-full">
                    {data.learningPath.map((topic, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="font-semibold text-primary">{topic.topic}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <p className="text-muted-foreground">{topic.description}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Tiempo estimado: {topic.estimatedTime}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2 text-sm text-accent">
                                        <BookOpen className="h-4 w-4" />Recursos
                                    </h4>
                                    <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                                        {topic.resources.map((resource, rIndex) => (
                                            <li key={rIndex}>{resource}</li>
                                        ))}
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                    <BrainCircuit className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Tu ruta de aprendizaje aparecerá aquí una vez que completes el formulario.</p>
                </div>
            )}
        </div>
    );
}

export default function AndeAprendeSection() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(generatePath, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  // To keep the results displayed even after a re-render
  const [learningData, setLearningData] = useState<LearningPathOutput | null | undefined>(null);

  useEffect(() => {
    if (!state) return;

    if (state.errors && Object.keys(state.errors).length > 0) {
        if(!state.errors.server) {
            toast({
                variant: "destructive",
                title: "Error de validación",
                description: state.message,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error del Servidor",
                description: state.message,
            });
        }
    } else if (state.message && state.data) {
        toast({
            title: "¡Éxito!",
            description: state.message,
        });
        setLearningData(state.data);
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div id="ande-aprende" className="mt-16 md:mt-24 container">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">
            Ande-Aprende
          </CardTitle>
          <CardDescription className="text-lg">
            Tu ruta de aprendizaje personalizada sobre finanzas y blockchain, impulsada por IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <LearningPathForm state={state} dispatch={dispatch} formRef={formRef} />
            <LearningPathResult data={learningData || state?.data} />
        </CardContent>
      </Card>
    </div>
  );
}
