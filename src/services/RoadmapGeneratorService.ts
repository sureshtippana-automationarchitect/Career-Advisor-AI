import OpenAI from 'openai';
import {
  UserProfile,
  JobRecommendation,
  LearningRoadmap,
} from '../models/interfaces.js';

/**
 * Roadmap Generator Service
 * Creates personalized learning roadmaps with 30-day, 90-day, and 6-month plans
 */
export class RoadmapGeneratorService {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  /**
   * Generate a learning roadmap based on user profile and recommended job
   */
  async generateRoadmap(
    profile: UserProfile,
    targetRole: JobRecommendation
  ): Promise<LearningRoadmap> {
    const systemMessage = this.buildSystemMessage();
    const userMessage = this.buildUserMessage(profile, targetRole);

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
      return this.parseRoadmap(parsedResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate roadmap: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Build system message for roadmap generation
   */
  private buildSystemMessage(): string {
    return `You are an expert Learning and Development advisor specializing in creating personalized career development roadmaps.

Your task is to create a structured learning plan that helps professionals bridge their skill gaps and achieve their career goals.

Guidelines:
- Create realistic, actionable learning plans
- Prioritize skills based on importance and learning curve
- Include specific resources, courses, or activities
- Balance theoretical knowledge with practical application
- Consider the user's current skill level
- Provide progressive learning paths that build on previous knowledge
- Be specific about what to learn and how to practice

Provide the roadmap in the following JSON format:
{
  "thirtyDayPlan": ["action item 1", "action item 2", ...],
  "ninetyDayPlan": ["action item 1", "action item 2", ...],
  "sixMonthPlan": ["action item 1", "action item 2", ...]
}

Each plan should contain 4-6 specific, actionable items.`;
  }

  /**
   * Build user message with profile and target role details
   */
  private buildUserMessage(
    profile: UserProfile,
    targetRole: JobRecommendation
  ): string {
    return `Create a learning roadmap for me to transition into the following role:

Target Role: ${targetRole.role}
Current Skills: ${profile.skills.join(', ')}
Skill Gaps to Address: ${targetRole.skillGaps.join(', ')}
Career Goal: ${profile.careerGoal}
Current Experience: ${profile.experience}

Please provide:
1. A 30-day plan focusing on foundational skills and quick wins
2. A 90-day plan for intermediate skill development and practical projects
3. A 6-month plan for advanced skills, portfolio building, and job readiness

Make each item specific and actionable.`;
  }

  /**
   * Parse and validate the roadmap response
   */
  private parseRoadmap(response: any): LearningRoadmap {
    const roadmap: LearningRoadmap = {
      thirtyDayPlan: Array.isArray(response.thirtyDayPlan)
        ? response.thirtyDayPlan
        : [],
      ninetyDayPlan: Array.isArray(response.ninetyDayPlan)
        ? response.ninetyDayPlan
        : [],
      sixMonthPlan: Array.isArray(response.sixMonthPlan)
        ? response.sixMonthPlan
        : [],
    };

    // Validate that we have content in each plan
    if (
      roadmap.thirtyDayPlan.length === 0 ||
      roadmap.ninetyDayPlan.length === 0 ||
      roadmap.sixMonthPlan.length === 0
    ) {
      throw new Error('Invalid roadmap format: missing plan items');
    }

    return roadmap;
  }
}
