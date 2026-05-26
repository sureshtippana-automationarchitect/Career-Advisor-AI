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
  // Private properties - can only be accessed within this class
  private openai: OpenAI;      // OpenAI client instance
  private model: string;        // AI model to use (e.g., 'gpt-4o-mini')

  /**
   * Constructor - runs when you create a new instance: new CareerAdvisorService(apiKey)
   * It initializes the OpenAI client with your API key
   */
  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    // Create a new OpenAI client with the provided API key
    this.openai = new OpenAI({ apiKey });
    // Store the model name for later use
    this.model = model;
  }

  /**
   * Generate career advice for a given user profile
   * Returns top 3 job recommendations with skill gaps, suitability scores, and explanations
   * 
   * 'async' keyword means this function performs asynchronous operations
   * It allows us to use 'await' to wait for the OpenAI API response
   */
  async generateCareerAdvice(
    profile: UserProfile
  ): Promise<CareerAdviceResponse> {
    // Build the messages to send to OpenAI
    const userMessage = this.buildUserMessage(profile);
    const systemMessage = this.buildSystemMessage();

    try {
      // Make an API call to OpenAI
      // 'await' pauses execution here until OpenAI responds
      // This prevents blocking the entire application while waiting
      const completion = await this.openai.chat.completions.create({
        model: this.model,              // Which AI model to use
        messages: [                      // Conversation history
          { role: 'system', content: systemMessage },  // AI's instructions
          { role: 'user', content: userMessage },      // User's question
        ],
        temperature: 0.7,               // Creativity level (0.0-2.0, lower=more focused)
        max_tokens: 2000,               // Maximum response length
        response_format: { type: 'json_object' },  // Request JSON format response
      });

      // Extract the AI's response text from the completion object
      const responseContent = completion.choices[0]?.message?.content;
      // The ?. operator is "optional chaining" - safely accesses nested properties
      // If any property is null/undefined, it returns undefined instead of crashing
      
      if (!responseContent) {
        throw new Error('No response from OpenAI API');
      }

      // Parse the JSON string response into a JavaScript object
      const parsedResponse = JSON.parse(responseContent);
      // Convert the parsed object into our CareerAdviceResponse type
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
   * This function takes the raw JSON response from OpenAI and converts it
   * into a properly typed TypeScript object
   */
  private parseCareerAdvice(response: any): CareerAdviceResponse {
    // First, validate that the response has the expected structure
    // Check if recommendations exists and is an array
    if (!response.recommendations || !Array.isArray(response.recommendations)) {
      throw new Error('Invalid response format from AI');
    }

    // .map() transforms each recommendation object from the AI response
    // into our JobRecommendation interface format
    const recommendations: JobRecommendation[] = response.recommendations.map(
      (rec: any) => ({
        // Use the role from AI, or fallback to 'Unknown Role' if missing
        role: rec.role || 'Unknown Role',
        
        // Ensure suitability score is between 0 and 100
        // Math.max(0, ...) ensures it's not less than 0
        // Math.min(100, ...) ensures it's not more than 100
        suitabilityScore: Math.min(100, Math.max(0, rec.suitabilityScore || 0)),
        
        // Validate skillGaps is an array, otherwise use empty array
        skillGaps: Array.isArray(rec.skillGaps) ? rec.skillGaps : [],
        
        // Use explanation from AI, or provide a default message
        explanation: rec.explanation || 'No explanation provided',
      })
    );

    // Ensure we have exactly 3 recommendations
    // This while loop keeps adding placeholder recommendations until we have 3
    while (recommendations.length < 3) {
      // .push() adds a new item to the end of the array
      recommendations.push({
        role: 'Additional Role Analysis Needed',
        suitabilityScore: 0,
        skillGaps: [],
        explanation: 'Please provide more details for better recommendations',
      });
    }

    // Return the final result
    return {
      // .slice(0, 3) ensures we only return the first 3 recommendations
      // (in case the AI returned more than 3)
      recommendations: recommendations.slice(0, 3),
    };
  }
}
