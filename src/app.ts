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
  // Class properties - these store the services and readline interface
  private careerAdvisor: CareerAdvisorService;        // Service for career recommendations
  private roadmapGenerator: RoadmapGeneratorService;  // Service for learning roadmaps
  private safetyValidator: SafetyValidatorService;    // Service for safety validation
  private rl: readline.Interface;                     // Interface for reading user input

  /**
   * Constructor - initializes the application when you create: new CareerAdvisorApp()
   * Sets up all the services with the OpenAI API key from environment variables
   */
  constructor() {
    // Load API key from .env file (process.env contains environment variables)
    const apiKey = process.env.OPENAI_API_KEY;
    // Load model name, defaulting to 'gpt-4o-mini' if not set
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // Validate that API key exists
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not set in environment variables. Please create a .env file with your API key.'
      );
    }

    // Initialize all services with the API key
    this.careerAdvisor = new CareerAdvisorService(apiKey, model);
    this.roadmapGenerator = new RoadmapGeneratorService(apiKey, model);
    this.safetyValidator = new SafetyValidatorService();

    // Create readline interface for getting user input from console
    this.rl = readline.createInterface({
      input: process.stdin,   // Standard input (keyboard)
      output: process.stdout, // Standard output (console)
    });
  }

  /**
   * Prompt user for input
   * Helper method that displays a question and waits for user input
   * 
   * 'async' allows us to use 'await' to wait for user input
   * Promise<string> means this function will eventually return a string
   */
  private async prompt(question: string): Promise<string> {
    // Return a Promise that resolves when user provides input
    return new Promise((resolve) => {
      // Ask the question and wait for answer
      this.rl.question(question, (answer) => {
        // .trim() removes extra spaces from start and end of the answer
        // resolve() completes the Promise and returns the answer
        resolve(answer.trim());
      });
    });
  }

  /**
   * Collect user profile information
   * This method prompts the user to enter their details via the console
   */
  private async collectUserProfile(): Promise<UserProfile> {
    // Display welcome banner
    console.log('\n===========================================');
    console.log('   Welcome to Career Advisor AI');
    console.log('===========================================\n');
    console.log('Please provide your profile information:\n');

    // Prompt user for each field
    // 'await' waits for user to type and press Enter before continuing
    const education = await this.prompt('Education (e.g., Bachelor of Computer Science): ');
    const experience = await this.prompt('Experience (e.g., 3 years as Software Developer): ');
    const skillsInput = await this.prompt('Skills (comma-separated, e.g., JavaScript, Python, React): ');
    const careerGoal = await this.prompt('Career Goal (e.g., Become a Senior Developer): ');

    // Process the skills input string into an array
    // Example: "JavaScript, Python, React" becomes ["JavaScript", "Python", "React"]
    const skills = skillsInput
      .split(',')                    // Split by comma: creates array from comma-separated string
      .map((s) => s.trim())           // .map() removes spaces from start/end of each skill
      .filter((s) => s.length > 0);   // .filter() removes any empty strings from the array

    // Return the collected profile data as an object
    return {
      education,
      experience,
      skills,
      careerGoal,
    };
  }

  /**
   * Validate user profile
   * Checks that all required fields are filled in
   * Returns true if valid, false if any field is empty
   */
  private validateProfile(profile: UserProfile): boolean {
    // Check education field
    if (!profile.education || profile.education.length === 0) {
      console.error('\n❌ Error: Education field cannot be empty');
      return false;  // Return false immediately if validation fails
    }

    // Check experience field
    if (!profile.experience || profile.experience.length === 0) {
      console.error('\n❌ Error: Experience field cannot be empty');
      return false;
    }

    // Check skills array
    if (!profile.skills || profile.skills.length === 0) {
      console.error('\n❌ Error: Skills cannot be empty. Please provide at least one skill.');
      return false;
    }

    // Check career goal field
    if (!profile.careerGoal || profile.careerGoal.length === 0) {
      console.error('\n❌ Error: Career goal cannot be empty');
      return false;
    }

    return true;  // All validations passed
  }

  /**
   * Display career recommendations
   * This method formats and prints the job recommendations to the console
   */
  private displayRecommendations(profile: UserProfile, recommendations: any[]): void {
    // Print section header
    console.log('\n\n===========================================');
    console.log('   Career Recommendations');
    console.log('===========================================\n');

    // .forEach() loops through each recommendation in the array
    // It executes the function for each item, passing the item and its index
    recommendations.forEach((rec, index) => {
      // Display each recommendation with formatted output
      console.log(`\n${index + 1}. ${rec.role}`);
      console.log(`   Suitability Score: ${rec.suitabilityScore}/100`);
      
      // Ternary operator to show skills or "None" if empty
      // .join(', ') combines array items into a comma-separated string
      console.log(`   Skill Gaps: ${rec.skillGaps.length > 0 ? rec.skillGaps.join(', ') : 'None'}`);
      console.log(`   Explanation: ${rec.explanation}`);
    });
  }

  /**
   * Display learning roadmap
   * This method prints the 30-day, 90-day, and 6-month learning plans
   */
  private displayRoadmap(roadmap: any): void {
    // Print section header
    console.log('\n\n===========================================');
    console.log('   Learning Roadmap');
    console.log('===========================================\n');

    // Display 30-day plan
    console.log('📅 30-Day Plan:');
    // .forEach() loops through each item in the thirtyDayPlan array
    roadmap.thirtyDayPlan.forEach((item: string, index: number) => {
      // Print each action item with its number (index + 1 for human-readable numbering)
      console.log(`   ${index + 1}. ${item}`);
    });

    // Display 90-day plan
    console.log('\n📅 90-Day Plan:');
    roadmap.ninetyDayPlan.forEach((item: string, index: number) => {
      console.log(`   ${index + 1}. ${item}`);
    });

    // Display 6-month plan
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
      // .map() transforms each recommendation into a single string containing role + explanation
      // This creates an array of strings to check for bias/offensive content
      const contentToValidate = careerAdvice.recommendations.map(
        (rec) => `${rec.role} ${rec.explanation}`
      );
      // Pass all content to the safety validator to check for issues
      const safetyCheck = this.safetyValidator.validateMultipleFields(contentToValidate);

      // If safety check failed, display errors and exit
      if (!safetyCheck.isSafe) {
        console.error('\n❌ Safety Validation Failed:');
        // .forEach() loops through all issues and prints each one
        safetyCheck.issues.forEach((issue) => console.error(`   - ${issue}`));
        console.error('\n⚠️  The AI response contains potentially biased or unsafe content.');
        console.error('Please try again or contact support if this persists.');
        this.rl.close();  // Close the readline interface
        return;           // Exit the function early
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
        // Combine all three plans into one array using spread operator (...)
        // The ... operator "spreads" array items into a new array
        // Example: [...[1,2], ...[3,4]] becomes [1,2,3,4]
        const roadmapContent = [
          ...roadmap.thirtyDayPlan,    // Add all items from 30-day plan
          ...roadmap.ninetyDayPlan,    // Add all items from 90-day plan
          ...roadmap.sixMonthPlan,     // Add all items from 6-month plan
        ];
        // Check the combined roadmap content for safety issues
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
