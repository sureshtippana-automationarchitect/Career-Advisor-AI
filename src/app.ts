import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { UserProfile } from './models/interfaces.js';
import { CareerAdvisorService } from './services/CareerAdvisorService.js';
import { RoadmapGeneratorService } from './services/RoadmapGeneratorService.js';
import { SafetyValidatorService } from './services/SafetyValidatorService.js';

// Load environment variables
dotenv.config();

/**
 * Career Advisor AI - Main Application
 * A TypeScript console application that provides AI-powered career guidance
 */
class CareerAdvisorApp {
  private careerAdvisor: CareerAdvisorService;
  private roadmapGenerator: RoadmapGeneratorService;
  private safetyValidator: SafetyValidatorService;
  private rl: readline.Interface;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not set in environment variables. Please create a .env file with your API key.'
      );
    }

    this.careerAdvisor = new CareerAdvisorService(apiKey, model);
    this.roadmapGenerator = new RoadmapGeneratorService(apiKey, model);
    this.safetyValidator = new SafetyValidatorService();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Prompt user for input
   */
  private async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Collect user profile information
   */
  private async collectUserProfile(): Promise<UserProfile> {
    console.log('\n===========================================');
    console.log('   Welcome to Career Advisor AI');
    console.log('===========================================\n');
    console.log('Please provide your profile information:\n');

    const education = await this.prompt('Education (e.g., Bachelor of Computer Science): ');
    const experience = await this.prompt('Experience (e.g., 3 years as Software Developer): ');
    const skillsInput = await this.prompt('Skills (comma-separated, e.g., JavaScript, Python, React): ');
    const careerGoal = await this.prompt('Career Goal (e.g., Become a Senior Developer): ');

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      education,
      experience,
      skills,
      careerGoal,
    };
  }

  /**
   * Validate user profile
   */
  private validateProfile(profile: UserProfile): boolean {
    if (!profile.education || profile.education.length === 0) {
      console.error('\n❌ Error: Education field cannot be empty');
      return false;
    }

    if (!profile.experience || profile.experience.length === 0) {
      console.error('\n❌ Error: Experience field cannot be empty');
      return false;
    }

    if (!profile.skills || profile.skills.length === 0) {
      console.error('\n❌ Error: Skills cannot be empty. Please provide at least one skill.');
      return false;
    }

    if (!profile.careerGoal || profile.careerGoal.length === 0) {
      console.error('\n❌ Error: Career goal cannot be empty');
      return false;
    }

    return true;
  }

  /**
   * Display career recommendations
   */
  private displayRecommendations(profile: UserProfile, recommendations: any[]): void {
    console.log('\n\n===========================================');
    console.log('   Career Recommendations');
    console.log('===========================================\n');

    recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.role}`);
      console.log(`   Suitability Score: ${rec.suitabilityScore}/100`);
      console.log(`   Skill Gaps: ${rec.skillGaps.length > 0 ? rec.skillGaps.join(', ') : 'None'}`);
      console.log(`   Explanation: ${rec.explanation}`);
    });
  }

  /**
   * Display learning roadmap
   */
  private displayRoadmap(roadmap: any): void {
    console.log('\n\n===========================================');
    console.log('   Learning Roadmap');
    console.log('===========================================\n');

    console.log('📅 30-Day Plan:');
    roadmap.thirtyDayPlan.forEach((item: string, index: number) => {
      console.log(`   ${index + 1}. ${item}`);
    });

    console.log('\n📅 90-Day Plan:');
    roadmap.ninetyDayPlan.forEach((item: string, index: number) => {
      console.log(`   ${index + 1}. ${item}`);
    });

    console.log('\n📅 6-Month Plan:');
    roadmap.sixMonthPlan.forEach((item: string, index: number) => {
      console.log(`   ${index + 1}. ${item}`);
    });
  }

  /**
   * Main application flow
   */
  async run(): Promise<void> {
    try {
      // Collect user profile
      const profile = await this.collectUserProfile();

      // Validate profile
      if (!this.validateProfile(profile)) {
        this.rl.close();
        return;
      }

      console.log('\n\n🤖 Analyzing your profile...\n');

      // Generate career recommendations
      const careerAdvice = await this.careerAdvisor.generateCareerAdvice(profile);

      // Validate AI response for safety
      const contentToValidate = careerAdvice.recommendations.map(
        (rec) => `${rec.role} ${rec.explanation}`
      );
      const safetyCheck = this.safetyValidator.validateMultipleFields(contentToValidate);

      if (!safetyCheck.isSafe) {
        console.error('\n❌ Safety Validation Failed:');
        safetyCheck.issues.forEach((issue) => console.error(`   - ${issue}`));
        console.error('\n⚠️  The AI response contains potentially biased or unsafe content.');
        console.error('Please try again or contact support if this persists.');
        this.rl.close();
        return;
      }

      // Display recommendations
      this.displayRecommendations(profile, careerAdvice.recommendations);

      // Generate roadmap for top recommendation
      if (careerAdvice.recommendations.length > 0) {
        console.log('\n\n🚀 Generating learning roadmap for your top recommendation...\n');
        
        const topRecommendation = careerAdvice.recommendations[0];
        const roadmap = await this.roadmapGenerator.generateRoadmap(
          profile,
          topRecommendation
        );

        // Validate roadmap for safety
        const roadmapContent = [
          ...roadmap.thirtyDayPlan,
          ...roadmap.ninetyDayPlan,
          ...roadmap.sixMonthPlan,
        ];
        const roadmapSafetyCheck = this.safetyValidator.validateMultipleFields(roadmapContent);

        if (!roadmapSafetyCheck.isSafe) {
          console.error('\n❌ Roadmap Safety Validation Failed:');
          roadmapSafetyCheck.issues.forEach((issue) => console.error(`   - ${issue}`));
          console.error('\n⚠️  The roadmap contains potentially biased or unsafe content.');
        } else {
          this.displayRoadmap(roadmap);
        }
      }

      console.log('\n\n===========================================');
      console.log('   Thank you for using Career Advisor AI!');
      console.log('===========================================\n');
    } catch (error) {
      if (error instanceof Error) {
        console.error(`\n❌ Error: ${error.message}`);
      } else {
        console.error('\n❌ An unexpected error occurred');
      }
    } finally {
      this.rl.close();
    }
  }
}

// Run the application
const app = new CareerAdvisorApp();
app.run();
