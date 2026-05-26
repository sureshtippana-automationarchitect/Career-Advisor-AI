import OpenAI from 'openai';
import {
  UserProfile,
  CareerAdviceResponse,
  JobRecommendation,
} from '../models/interfaces.js';
import { ROLE_PROMPT } from '../prompts/rolePrompt.js';
import { formatFewShotExamples } from '../prompts/fewShotExamples.js';

/**
 * Career Advisor Service
 * Generates career recommendations using OpenAI API with role prompting and few-shot learning
 */
export class CareerAdvisorService {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  /**
   * Generate career advice for a given user profile
   * Returns top 3 job recommendations with skill gaps, suitability scores, and explanations
   */
  async generateCareerAdvice(
    profile: UserProfile
  ): Promise<CareerAdviceResponse> {
    const userMessage = this.buildUserMessage(profile);
    const systemMessage = this.buildSystemMessage();

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from OpenAI API');
      }

      const parsedResponse = JSON.parse(responseContent);
      return this.parseCareerAdvice(parsedResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate career advice: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Build the system message with role prompt and few-shot examples
   */
  private buildSystemMessage(): string {
    const fewShotExamples = formatFewShotExamples();
    return `${ROLE_PROMPT}

Here are some examples of how to provide career recommendations:

${fewShotExamples}

Now, provide career advice in the following JSON format:
{
  "recommendations": [
    {
      "role": "Job Role Name",
      "suitabilityScore": 85,
      "skillGaps": ["skill1", "skill2"],
      "explanation": "Detailed explanation of why this role is suitable"
    }
  ]
}

Provide exactly 3 recommendations, ordered by suitability score (highest first).`;
  }

  /**
   * Build the user message with profile details
   */
  private buildUserMessage(profile: UserProfile): string {
    return `Please analyze my profile and provide career recommendations:

Education: ${profile.education}
Experience: ${profile.experience}
Skills: ${profile.skills.join(', ')}
Career Goal: ${profile.careerGoal}

Please recommend the top 3 job roles that would be suitable for me, including suitability scores (0-100), skill gaps, and detailed explanations.`;
  }

  /**
   * Parse and validate the AI response
   */
  private parseCareerAdvice(response: any): CareerAdviceResponse {
    if (!response.recommendations || !Array.isArray(response.recommendations)) {
      throw new Error('Invalid response format from AI');
    }

    const recommendations: JobRecommendation[] = response.recommendations.map(
      (rec: any) => ({
        role: rec.role || 'Unknown Role',
        suitabilityScore: Math.min(100, Math.max(0, rec.suitabilityScore || 0)),
        skillGaps: Array.isArray(rec.skillGaps) ? rec.skillGaps : [],
        explanation: rec.explanation || 'No explanation provided',
      })
    );

    // Ensure we have exactly 3 recommendations
    while (recommendations.length < 3) {
      recommendations.push({
        role: 'Additional Role Analysis Needed',
        suitabilityScore: 0,
        skillGaps: [],
        explanation: 'Please provide more details for better recommendations',
      });
    }

    return {
      recommendations: recommendations.slice(0, 3),
    };
  }
}
