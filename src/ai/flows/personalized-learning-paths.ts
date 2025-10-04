// A Genkit flow to generate personalized learning paths for the Ande-Aprende module.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningPathInputSchema = z.object({
  userProfile: z
    .string()
    .describe(
      'A description of the user profile, including their interests, goals, and current knowledge level.'
    ),
  learningGoals: z.string().describe('The specific learning goals of the user.'),
  userActivity: z
    .string()
    .optional()
    .describe('The past activity of the user, like topics completed, test scores etc.'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

const LearningPathOutputSchema = z.object({
  learningPath: z.array(
    z.object({
      topic: z.string().describe('The topic to be learned.'),
      description: z.string().describe('A brief description of the topic.'),
      resources: z.array(z.string()).describe('A list of resources for learning the topic.'),
      estimatedTime: z.string().describe('Estimated time to complete the topic.'),
    })
  ).describe('A personalized learning path for the user.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(
  input: LearningPathInput
): Promise<LearningPathOutput> {
  return personalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
  prompt: `You are an AI learning path generator for the Ande-Aprende module.

  Your goal is to create a personalized learning path for the user based on their profile, learning goals, and past activity.

  User Profile: {{{userProfile}}}
  Learning Goals: {{{learningGoals}}}
  User Activity: {{{userActivity}}}

  Create a learning path that covers topics related to blockchain, finance, and the AndeChain ecosystem.

  Each topic should have a description, a list of resources, and an estimated time to complete.

  The learning path should be tailored to the user's interests and goals.
  Consider the user's past activity to avoid repetition and focus on areas where they need the most help.

  Ensure that the learning path is engaging and informative.

  Output the learning path as a JSON array of topics.
  Each topic should have the following fields:
  - topic: The name of the topic.
  - description: A brief description of the topic.
  - resources: A list of resources for learning the topic.
  - estimatedTime: Estimated time to complete the topic.
  `,
});

const personalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'personalizedLearningPathFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
