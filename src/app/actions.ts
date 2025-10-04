"use server";

import { generatePersonalizedLearningPath, type LearningPathInput, type LearningPathOutput } from "@/ai/flows/personalized-learning-paths";
import { z } from "zod";

const FormSchema = z.object({
  userProfile: z.string().min(10, {
    message: "Por favor, describe tu perfil con más detalle.",
  }),
  learningGoals: z.string().min(10, {
    message: "Por favor, describe tus metas de aprendizaje con más detalle.",
  }),
});

export type State = {
  errors?: {
    userProfile?: string[];
    learningGoals?: string[];
    server?: string[];
  };
  message?: string | null;
  data?: LearningPathOutput | null;
};

export async function generatePath(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    userProfile: formData.get("userProfile"),
    learningGoals: formData.get("learningGoals"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Por favor, corrige los errores y vuelve a intentarlo.",
    };
  }
  
  const input: LearningPathInput = {
    userProfile: validatedFields.data.userProfile,
    learningGoals: validatedFields.data.learningGoals,
    userActivity: "N/A",
  };

  try {
    const result = await generatePersonalizedLearningPath(input);
    if (result && result.learningPath) {
      return { message: "Ruta de aprendizaje generada con éxito.", data: result };
    } else {
       return { 
         errors: { server: ["No se pudo generar la ruta de aprendizaje."] },
         message: "Error del servidor: No se pudo generar la ruta." 
       };
    }
  } catch (e) {
    console.error(e);
    return { 
      errors: { server: ["Ocurrió un error inesperado."] },
      message: "Ocurrió un error inesperado al generar la ruta de aprendizaje." 
    };
  }
}
